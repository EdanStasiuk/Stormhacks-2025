import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

/**
 * GET /api/jobs/[id] - Get a specific job with its candidates
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      error: "Invalid job ID",
    });
  }

  if (req.method === "GET") {
    try {
      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          _count: {
            select: { candidates: true },
          },
        },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: job.id,
          title: job.title,
          description: job.description,
          candidateCount: job._count.candidates,
          status: "active",
          createdAt: job.createdAt.toISOString(),
          updatedAt: job.updatedAt.toISOString(),
        },
      });
    } catch (error: any) {
      console.error("Error fetching job:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch job",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}
