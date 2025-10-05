/**
 * GET /api/jobs/[id]/portfolio-status
 *
 * Check portfolio analysis status for a job's candidates
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getProcessingStatus } from "@/lib/processingStatus";

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

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use GET.",
    });
  }

  try {
    // Get current processing status
    const processingStatus = getProcessingStatus(id);

    // Get all candidates for this job
    const candidates = await prisma.candidate.findMany({
      where: { jobId: id },
      include: {
        portfolio: {
          select: {
            id: true,
            github: true,
            linkedin: true,
            website: true,
            analyzedAt: true,
            overallScore: true,
            recommendation: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    });

    const totalCandidates = candidates.length;
    const candidatesWithPortfolio = candidates.filter(c => c.portfolio).length;
    const candidatesWithGithub = candidates.filter(c => c.portfolio?.github).length;
    const candidatesAnalyzed = candidates.filter(c => c.portfolio?.analyzedAt).length;

    const candidateDetails = candidates.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      score: c.score,
      hasPortfolio: !!c.portfolio,
      hasGithub: !!c.portfolio?.github,
      githubUrl: c.portfolio?.github,
      isAnalyzed: !!c.portfolio?.analyzedAt,
      analyzedAt: c.portfolio?.analyzedAt,
      overallScore: c.portfolio?.overallScore,
      recommendation: c.portfolio?.recommendation,
    }));

    return res.status(200).json({
      success: true,
      processing: processingStatus || { stage: 'idle', message: 'No active processing' },
      summary: {
        totalCandidates,
        candidatesWithPortfolio,
        candidatesWithGithub,
        candidatesAnalyzed,
        pendingAnalysis: candidatesWithGithub - candidatesAnalyzed,
      },
      candidates: candidateDetails,
    });
  } catch (error: any) {
    console.error("Error checking portfolio status:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
