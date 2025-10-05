/**
 * POST /api/jobs/analyze-top-candidates
 *
 * Runs portfolio analysis on top N candidates for a specific job
 *
 * Request body:
 * {
 *   jobId: string,
 *   topN?: number (default: 5),
 *   minScore?: number (default: 0.7)
 * }
 *
 * This endpoint:
 * 1. Fetches top N candidates for a job (by score)
 * 2. For each candidate with a GitHub URL in their portfolio
 * 3. Runs portfolio-analyzer
 * 4. Saves the analysis results
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { analyzePortfolio } from "@/lib/portfolioAnalyzer";
import { savePortfolioAnalysis } from "@/lib/db";

interface AnalyzeTopCandidatesRequest {
  jobId: string;
  topN?: number;
  minScore?: number;
}

interface AnalyzeTopCandidatesResponse {
  success: boolean;
  analyzed?: number;
  skipped?: number;
  errors?: string[];
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyzeTopCandidatesResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const {
      jobId,
      topN = 5,
      minScore = 0.7,
    }: AnalyzeTopCandidatesRequest = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: "jobId is required",
      });
    }

    console.log(`\n🎯 Analyzing top ${topN} candidates for job: ${jobId}`);

    // Fetch job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Fetch top candidates with scores
    const candidates = await prisma.candidate.findMany({
      where: {
        jobId: jobId,
        score: {
          gte: minScore,
        },
      },
      orderBy: {
        score: "desc",
      },
      take: topN,
      include: {
        portfolio: true,
        resumes: {
          take: 1,
          orderBy: {
            uploadedAt: "desc",
          },
        },
      },
    });

    console.log(`📊 Found ${candidates.length} candidates to analyze`);

    if (candidates.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No candidates found with score >= ${minScore}`,
        analyzed: 0,
        skipped: 0,
      });
    }

    let analyzedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    // Analyze each candidate
    for (const candidate of candidates) {
      try {
        // Check if portfolio exists and has GitHub URL
        const githubUrl = candidate.portfolio?.github;

        if (!githubUrl) {
          console.log(`  ⏭️  Skipping ${candidate.name} - no GitHub URL`);
          skippedCount++;
          continue;
        }

        console.log(`\n  🔍 Analyzing ${candidate.name} (${githubUrl})`);

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
          `  ✅ Analysis complete - Score: ${analysisResult.overallScore}/10, Recommendation: ${analysisResult.recommendation}`
        );

        analyzedCount++;
      } catch (error: any) {
        console.error(`  ❌ Error analyzing ${candidate.name}:`, error.message);
        errors.push(`${candidate.name}: ${error.message}`);
        skippedCount++;
      }
    }

    console.log(`\n✨ Portfolio analysis complete!`);
    console.log(`  ✅ Analyzed: ${analyzedCount}`);
    console.log(`  ⏭️  Skipped: ${skippedCount}`);

    return res.status(200).json({
      success: true,
      analyzed: analyzedCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Analyzed ${analyzedCount} candidates, skipped ${skippedCount}`,
    });
  } catch (error: any) {
    console.error("Error analyzing top candidates:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
