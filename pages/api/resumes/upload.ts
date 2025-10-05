/**
 * Orchestration Endpoint: Job Resume Upload & Candidate Matching
 *
 * This endpoint handles the complete candidate processing pipeline:
 * 1. Accept ZIP/PDF resume uploads for a specific job
 * 2. Extract and parse resumes (PDF text extraction)
 * 3. Use AI to extract structured candidate data (name, email, skills, etc.)
 * 4. Create Candidate records in database with jobId
 * 5. Generate embeddings for each resume
 * 6. Store embeddings in Pinecone vector database
 * 7. Match candidates to job using semantic search
 * 8. Update candidate scores
 * 9. Select top N candidates
 * 10. Run portfolio-analyzer on top candidates (if GitHub provided)
 * 11. Store analysis results
 */

import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import { PDFParse } from 'pdf-parse';
import { readFile } from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { pinecone } from '@/lib/pinecone';
import { parseResume, ensureValidEmail } from '@/lib/resumeParser';
import { analyzePortfolio } from '@/lib/portfolioAnalyzer';
import { savePortfolioAnalysis } from '@/lib/db';
import { updateProcessingStatus, setProcessingError } from '@/lib/processingStatus';

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

const gemini = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
});

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generate embedding using Gemini
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await gemini.models.embedContent({
    model: 'gemini-embedding-001',
    contents: [text],
  });

  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error('Failed to generate embeddings');
  }

  const embedding = response.embeddings[0];

  if (Array.isArray(embedding)) {
    return embedding;
  } else if (embedding && typeof embedding === 'object' && 'values' in embedding) {
    return (embedding as any).values;
  } else {
    throw new Error('Invalid embedding format');
  }
}

/**
 * Extract text from PDF file
 */
async function extractPdfText(filePath: string): Promise<string> {
  const fileBuffer = await readFile(filePath);
  const parser = new PDFParse({ data: fileBuffer });
  const result = await parser.getText();
  return result.text;
}

/**
 * Extract PDFs from ZIP file
 */
async function extractPdfsFromZip(zipFilePath: string): Promise<string[]> {
  const extractedFiles: string[] = [];
  const extractDir = path.join(uploadDir, `extracted-${Date.now()}`);

  if (!fs.existsSync(extractDir)) {
    fs.mkdirSync(extractDir, { recursive: true });
  }

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Parse())
      .on('entry', (entry: any) => {
        const fileName = entry.path;
        const fullPath = path.join(extractDir, path.basename(fileName));

        if (path.extname(fileName).toLowerCase() === '.pdf') {
          extractedFiles.push(fullPath);
          entry.pipe(fs.createWriteStream(fullPath));
        } else {
          entry.autodrain();
        }
      })
      .on('close', () => resolve())
      .on('error', reject);
  });

  return extractedFiles;
}

// ==================== MAIN HANDLER ====================

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024, // 100MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ success: false, error: 'Error processing upload' });
    }

    try {
      // Extract jobId from form data
      const jobId = Array.isArray(fields.jobId) ? fields.jobId[0] : fields.jobId;

      if (!jobId) {
        return res.status(400).json({ success: false, error: 'jobId is required' });
      }

      console.log(`\n📦 Starting resume upload pipeline for job: ${jobId}`);

      updateProcessingStatus(jobId, 'uploading', 'Initializing upload pipeline');

      // Verify job exists
      const job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }

      // Get uploaded files
      const uploadedFiles = files.resumes as File | File[] | undefined;
      if (!uploadedFiles) {
        return res.status(400).json({ success: false, error: 'No files uploaded' });
      }

      const fileList = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
      const pdfFiles: string[] = [];

      updateProcessingStatus(jobId, 'uploading', 'Extracting files from uploads');

      // Process files (extract ZIPs, collect PDFs)
      for (const file of fileList) {
        if (file.mimetype === 'application/zip' || file.originalFilename?.endsWith('.zip')) {
          console.log(`📂 Extracting ZIP: ${file.originalFilename}`);
          const extracted = await extractPdfsFromZip(file.filepath);
          pdfFiles.push(...extracted);
        } else if (file.mimetype === 'application/pdf' || file.originalFilename?.endsWith('.pdf')) {
          pdfFiles.push(file.filepath);
        }
      }

      console.log(`📄 Found ${pdfFiles.length} PDF resumes to process`);

      if (pdfFiles.length === 0) {
        setProcessingError(jobId, 'No PDF files found in upload');
        return res.status(400).json({ success: false, error: 'No PDF files found' });
      }

      updateProcessingStatus(
        jobId,
        'parsing_resumes',
        'Parsing resumes and extracting candidate data',
        { current: 0, total: pdfFiles.length }
      );

      const processedCandidates: string[] = [];
      const errors: string[] = [];

      // Process each resume
      for (let i = 0; i < pdfFiles.length; i++) {
        const pdfPath = pdfFiles[i];
        const fileName = path.basename(pdfPath);

        try {
          console.log(`\n[${i + 1}/${pdfFiles.length}] Processing: ${fileName}`);

          updateProcessingStatus(
            jobId,
            'parsing_resumes',
            `Processing ${fileName}`,
            { current: i + 1, total: pdfFiles.length }
          );

          // 1. Extract text from PDF
          const resumeText = await extractPdfText(pdfPath);
          console.log(`  ✅ Extracted ${resumeText.length} characters of text`);

          // 2. Parse resume using AI
          const parsedData = await parseResume(resumeText);
          console.log(`  ✅ Parsed candidate: ${parsedData.name} (${parsedData.email})`);

          // 3. Generate file reference (not storing actual file)
          const fileUrl = `local://resumes/${jobId}/${fileName}`;

          // 4. Check if candidate already exists (by email)
          const validEmail = ensureValidEmail(parsedData.email);
          let candidate = await prisma.candidate.findFirst({
            where: {
              email: validEmail,
              jobId: jobId,
            },
          });

          // 5. Create or update candidate
          if (candidate) {
            console.log(`  ⚠️  Candidate already exists, updating...`);
            candidate = await prisma.candidate.update({
              where: { id: candidate.id },
              data: {
                name: parsedData.name,
                skills: parsedData.skills,
                experience: parsedData.experience,
                education: parsedData.education,
              },
            });
          } else {
            candidate = await prisma.candidate.create({
              data: {
                name: parsedData.name,
                email: validEmail,
                skills: parsedData.skills,
                experience: parsedData.experience,
                education: parsedData.education,
                jobId: jobId,
              },
            });
            console.log(`  ✅ Created candidate: ${candidate.id}`);
          }

          // 5b. Create/update portfolio if URLs found in resume
          if (parsedData.github || parsedData.linkedin || parsedData.website) {
            await prisma.portfolio.upsert({
              where: {
                candidateId: candidate.id,
              },
              update: {
                github: parsedData.github || undefined,
                linkedin: parsedData.linkedin || undefined,
                website: parsedData.website || undefined,
              },
              create: {
                candidateId: candidate.id,
                github: parsedData.github || undefined,
                linkedin: parsedData.linkedin || undefined,
                website: parsedData.website || undefined,
              },
            });
            console.log(`  ✅ Portfolio URLs: ${parsedData.github ? '✓GitHub ' : ''}${parsedData.linkedin ? '✓LinkedIn ' : ''}${parsedData.website ? '✓Website' : ''}`);
          }

          // 6. Create resume record (storing parsed data only, not file)
          const resume = await prisma.resume.create({
            data: {
              fileUrl: fileUrl, // Reference only, file not stored
              parsedText: resumeText,
              parsedData: parsedData as any,
              candidateId: candidate.id,
            },
          });
          console.log(`  ✅ Created resume record: ${resume.id}`);

          // 7. Generate and store embedding
          const embedding = await generateEmbedding(resumeText);
          const index = pinecone.Index('candidates-job-matching');
          await index.upsert([
            {
              id: `resume-${resume.id}`,
              values: embedding,
              metadata: {
                candidateId: candidate.id,
                resumeId: resume.id,
                jobId: jobId,
                type: 'resume',
              },
            },
          ]);
          console.log(`  ✅ Stored embedding in Pinecone`);

          processedCandidates.push(candidate.id);
        } catch (error: any) {
          console.error(`  ❌ Error processing ${fileName}:`, error.message);
          errors.push(`${fileName}: ${error.message}`);
        }
      }

      console.log(`\n✅ Processed ${processedCandidates.length} candidates`);

      updateProcessingStatus(
        jobId,
        'generating_embeddings',
        'Generating embeddings complete'
      );

      // 8. Match all candidates to the job description
      if (job.description && processedCandidates.length > 0) {
        console.log(`\n🔍 Running semantic matching...`);

        updateProcessingStatus(
          jobId,
          'semantic_matching',
          'Matching candidates to job description'
        );

        try {
          const jobText = `${job.title}\n\n${job.description}`;
          const jobEmbedding = await generateEmbedding(jobText);

          const index = pinecone.Index('candidates-job-matching');
          const queryResponse = await index.query({
            vector: jobEmbedding,
            topK: processedCandidates.length,
            filter: { jobId: jobId },
            includeMetadata: true,
          });

          // Update candidate scores
          for (const match of queryResponse.matches || []) {
            const candidateId = match.metadata?.candidateId as string;
            if (candidateId && match.score) {
              await prisma.candidate.update({
                where: { id: candidateId },
                data: { score: match.score },
              });
              console.log(`  ✅ Updated score for candidate ${candidateId}: ${match.score.toFixed(3)}`);
            }
          }
        } catch (error: any) {
          console.error('Error during matching:', error);
          errors.push(`Matching error: ${error.message}`);
        }
      }

      // 9. Analyze top 10% of candidates with portfolio analysis
      if (processedCandidates.length > 0) {
        console.log(`\n🎯 Starting portfolio analysis for top 10% of candidates...`);

        updateProcessingStatus(
          jobId,
          'portfolio_analysis',
          'Analyzing top 10% of candidates'
        );

        try {
          // Fetch all candidates for this job, sorted by score
          const allCandidates = await prisma.candidate.findMany({
            where: {
              jobId: jobId,
              score: {
                not: null,
              },
            },
            orderBy: {
              score: 'desc',
            },
            include: {
              portfolio: true,
              resumes: {
                take: 1,
                orderBy: {
                  uploadedAt: 'desc',
                },
              },
            },
          });

          console.log(`  📊 Total candidates with scores: ${allCandidates.length}`);

          // Calculate top 10% (minimum 1, maximum 10)
          const topCount = Math.max(1, Math.min(10, Math.ceil(allCandidates.length * 0.1)));
          const topCandidates = allCandidates.slice(0, topCount);

          const topWithGithub = topCandidates.filter(c => c.portfolio?.github);

          console.log(`  🏆 Top ${topCount} candidates (${Math.round((topCount / allCandidates.length) * 100)}%)`);
          console.log(`  🔗 ${topWithGithub.length} have GitHub URLs and will be analyzed`);

          if (topWithGithub.length === 0) {
            console.log(`  ⚠️  No candidates in top ${topCount} have GitHub URLs - skipping portfolio analysis`);
          }

          let analyzedCount = 0;
          let skippedCount = 0;

          for (let idx = 0; idx < topCandidates.length; idx++) {
            const candidate = topCandidates[idx];

            updateProcessingStatus(
              jobId,
              'portfolio_analysis',
              `Analyzing candidate ${idx + 1}/${topCandidates.length}: ${candidate.name}`,
              { current: idx + 1, total: topCandidates.length }
            );
            try {
              // Check if portfolio exists and has GitHub URL
              const githubUrl = candidate.portfolio?.github;

              if (!githubUrl) {
                console.log(`  ⏭️  Skipping ${candidate.name} - no GitHub URL in portfolio`);
                skippedCount++;
                continue;
              }

              console.log(`\n  🔬 Analyzing ${candidate.name} (score: ${candidate.score?.toFixed(3)})`);
              console.log(`     GitHub: ${githubUrl}`);
              console.log(`     This may take 30-60 seconds per candidate...`);

              // Get resume data
              const latestResume = candidate.resumes[0];
              const resumeData = latestResume?.parsedData as any || {
                skills: candidate.skills,
                experience: [candidate.experience],
                rawText: latestResume?.parsedText || "",
              };

              // Run portfolio analysis
              const analysisResult = await analyzePortfolio({
                candidateId: candidate.id,
                resumeData: resumeData,
                github: githubUrl,
                jobDescription: job.description || undefined,
              });

              // Save analysis
              await savePortfolioAnalysis(candidate.id, githubUrl, analysisResult);

              console.log(
                `  ✅ Analysis complete - Overall: ${analysisResult.overallScore}/10, Recommendation: ${analysisResult.recommendation}`
              );

              analyzedCount++;
            } catch (error: any) {
              console.error(`  ❌ Error analyzing ${candidate.name}:`, error.message);
              errors.push(`Portfolio analysis for ${candidate.name}: ${error.message}`);
              skippedCount++;
            }
          }

          console.log(`  ✨ Portfolio analysis complete: ${analyzedCount} analyzed, ${skippedCount} skipped`);
        } catch (error: any) {
          console.error('Error during portfolio analysis:', error);
          errors.push(`Portfolio analysis error: ${error.message}`);
        }
      }

      // Clean up temp files
      for (const pdfPath of pdfFiles) {
        try {
          await fs.promises.unlink(pdfPath);
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      console.log(`\n✨ Upload pipeline complete!`);

      updateProcessingStatus(jobId, 'complete', 'Upload and analysis complete');

      // Calculate analysis stats
      const allCandidatesForJob = await prisma.candidate.findMany({
        where: { jobId: jobId },
        include: {
          portfolio: {
            select: {
              analyzedAt: true,
            },
          },
        },
      });

      const analyzedCandidatesCount = allCandidatesForJob.filter(
        (c) => c.portfolio?.analyzedAt
      ).length;

      return res.status(200).json({
        success: true,
        message: `Successfully processed ${processedCandidates.length} candidates`,
        processedCount: processedCandidates.length,
        analyzedCount: analyzedCandidatesCount,
        totalCandidatesForJob: allCandidatesForJob.length,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error: any) {
      console.error('Upload pipeline error:', error);

      const jobId = Array.isArray(fields?.jobId) ? fields.jobId[0] : fields?.jobId;
      if (jobId) {
        setProcessingError(jobId, error.message || 'Internal server error');
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  });
}
