import type { NextApiRequest, NextApiResponse } from "next";
import { getPortfolioAnalysis, getAllPortfolioAnalyses } from "@/lib/db";

/**
 * GET /api/portfolio-get?candidateId=xxx
 * GET /api/portfolio-get (get all)
 *
 * Retrieve portfolio analysis from database
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use GET.",
    });
  }

  try {
    const { candidateId } = req.query;

    if (candidateId && typeof candidateId === "string") {
      // Get specific candidate's portfolio analysis
      const portfolio = await getPortfolioAnalysis(candidateId);

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          error: "Portfolio analysis not found for this candidate",
        });
      }

      return res.status(200).json({
        success: true,
        data: portfolio,
      });
    } else {
      // Get all portfolio analyses
      const portfolios = await getAllPortfolioAnalyses();

      return res.status(200).json({
        success: true,
        data: portfolios,
        count: portfolios.length,
      });
    }
  } catch (error: any) {
    console.error("Error retrieving portfolio analysis:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error while retrieving portfolio analysis",
    });
  }
}
