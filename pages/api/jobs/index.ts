import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

/**
 * GET /api/jobs - Get all jobs
 * POST /api/jobs - Create a new job
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

      const job = await prisma.job.create({
        data: {
          title,
          description: description || "",
        },
      });

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
