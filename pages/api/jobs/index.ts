import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { GoogleGenAI } from '@google/genai';
import { pinecone } from "@/lib/pinecone";

const gemini = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
});

/**
 * Generate embedding for text using Gemini
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await gemini.models.embedContent({
    model: 'gemini-embedding-001',
    contents: [text],
  });

  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error('Failed to generate embeddings: No embeddings returned');
  }

  const embedding = response.embeddings[0];

  if (Array.isArray(embedding)) {
    return embedding;
  } else if (embedding && typeof embedding === 'object' && 'values' in embedding) {
    return (embedding as any).values;
  } else {
    throw new Error('Failed to generate embeddings: Invalid embedding format');
  }
}

/**
 * GET /api/jobs - Get all jobs
 * POST /api/jobs - Create a new job (with embedding generation)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const jobs = await prisma.job.findMany({
        include: {
          _count: {
            select: { candidates: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const formattedJobs = jobs.map((job) => ({
        id: job.id,
        title: job.title,
        description: job.description,
        candidateCount: job._count.candidates,
        status: "active", // You can add a status field to the schema if needed
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
      }));

      return res.status(200).json({
        success: true,
        data: formattedJobs,
      });
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch jobs",
      });
    }
  } else if (req.method === "POST") {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: "Title and description are required.",
        });
      }

      // Create job in database
      const job = await prisma.job.create({
        data: {
          title,
          description: description || "",
        },
      });

      // Generate and store job embedding in Pinecone
      if (description) {
        console.log(`📊 Generating embedding for job: ${job.id}`);

        const jobText = `${title}\n\n${description}`;
        const jobEmbedding = await generateEmbedding(jobText);

        const index = pinecone.Index('candidates-job-matching');
        await index.upsert([
          {
            id: `job-${job.id}`,
            values: jobEmbedding,
            metadata: {
              jobId: job.id,
              title: job.title,
              type: 'job',
            },
          },
        ]);

        console.log(`✅ Job embedding stored in Pinecone: job-${job.id}`);
      }

      return res.status(201).json({
        success: true,
        data: job,
      });
    } catch (error: any) {
      console.error("Error creating job:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to create job",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}
