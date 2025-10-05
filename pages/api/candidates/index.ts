import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

/**
 * GET /api/candidates?jobId=xxx - Get candidates by job
 * POST /api/candidates - Create a new candidate
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { jobId } = req.query;

      if (!jobId || typeof jobId !== "string") {
        return res.status(400).json({
          success: false,
          error: "jobId is required",
        });
      }

      const candidates = await prisma.candidate.findMany({
        where: { jobId },
        include: {
          portfolio: true,
          resumes: {
            orderBy: {
              uploadedAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          score: "desc",
        },
      });

      const formattedCandidates = candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        overallScore: candidate.score || 0,
        skillScore: candidate.portfolio?.overallScore || 0,
        experienceScore: candidate.portfolio?.resumeAlignment || 0,
        educationScore: candidate.portfolio?.overallScore || 0,
        portfolio: candidate.portfolio?.github || candidate.portfolio?.website || null,
        resumeUrl: candidate.resumes[0]?.fileUrl || null,
        insights: candidate.portfolio?.summary || "No analysis available yet",
        skills: candidate.skills || [],
        experience: candidate.experience || "",
        education: candidate.education || "",
      }));

      return res.status(200).json({
        success: true,
        data: formattedCandidates,
      });
    } catch (error: any) {
      console.error("Error fetching candidates:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch candidates",
      });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email, jobId, skills, experience, education } = req.body;

      if (!name || !email || !jobId) {
        return res.status(400).json({
          success: false,
          error: "name, email, and jobId are required",
        });
      }

      // Check if job exists
      const job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      const candidate = await prisma.candidate.create({
        data: {
          name,
          email,
          jobId,
          skills: skills || [],
          experience: experience || "",
          education: education || "",
        },
        include: {
          portfolio: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: candidate,
      });
    } catch (error: any) {
      console.error("Error creating candidate:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to create candidate",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}
