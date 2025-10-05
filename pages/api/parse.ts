import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { pinecone } from '../../src/lib/pinecone';
import { prisma } from '../../src/lib/prisma';

const gemini = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
});

async function generateEmbedding(text: string) {
    const response = await gemini.models.embedContent({
        model: 'gemini-embedding-001',
        contents: [text],
    });

    if (!response.embeddings || response.embeddings.length === 0) {
        throw new Error('Failed to generate embeddings: No embeddings returned');
    }

    const embedding = response.embeddings[0];

    if (!Array.isArray(embedding)) {
        throw new Error('Failed to generate embeddings: Invalid embedding format');
    }

    return embedding;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { resumes, transcripts, jobDescription } = req.body;

        // Generate embedding for job description
        const jobEmbedding = await generateEmbedding(jobDescription);

        // Upsert job description embedding to Pinecone
        const jobIndex = pinecone.Index('candidates-job-matching');
        await jobIndex.upsert([
            {
                id: `job-${Date.now()}`,
                values: jobEmbedding,
            },
        ]);

        // Process resumes and transcripts
        for (const resume of resumes) {
            const resumeEmbedding = await generateEmbedding(resume.text);
            await jobIndex.upsert([
                {
                    id: `resume-${resume.id}`,
                    values: resumeEmbedding,
                },
            ]);

            // Save resume to database
            await prisma.resume.create({
                data: {
                    fileUrl: resume.fileUrl,
                    parsedData: resume.parsedData,
                    candidateId: resume.candidateId,
                },
            });
        }

        for (const transcript of transcripts) {
            const transcriptEmbedding = await generateEmbedding(transcript.text);
            await jobIndex.upsert([
                {
                    id: `transcript-${transcript.id}`,
                    values: transcriptEmbedding,
                },
            ]);

            // Save transcript to database
            await prisma.transcript.create({
                data: {
                    fileUrl: transcript.fileUrl,
                    parsedData: transcript.parsedData,
                    candidateId: transcript.candidateId,
                },
            });
        }

        res.status(200).json({ message: 'Data processed successfully' });
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}