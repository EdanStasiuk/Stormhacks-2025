import type { NextApiRequest, NextApiResponse } from "next";
import { analyzePortfolio, PortfolioAnalysisInput, PortfolioAnalysisResult } from "@/lib/portfolioAnalyzer";
import { savePortfolioAnalysis } from "@/lib/db";

export interface PortfolioAnalyzeRequest {
  candidateId: string;
  resumeData: {
    skills?: string[];
    experience?: string[];
    projects?: string[];
    rawText?: string;
  };
  github?: string;
  jobDescription?: string;
}

export interface PortfolioAnalyzeResponse {
  success: boolean;
  data?: PortfolioAnalysisResult;
  error?: string;
}

/**
 * POST /api/portfolio-analyze
 *
 * Agentic portfolio analysis endpoint
 *
 * Request body:
 * {
 *   candidateId: string,
 *   resumeData: { skills, experience, projects, rawText },
 *   github?: string,
 *   jobDescription?: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: { ...analysisResult }
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PortfolioAnalyzeResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const input: PortfolioAnalysisInput = req.body;

    // Validation
    if (!input.candidateId) {
      return res.status(400).json({
        success: false,
        error: "candidateId is required",
      });
    }

    if (!input.resumeData) {
      return res.status(400).json({
        success: false,
        error: "resumeData is required",
      });
    }

    if (!input.github) {
      return res.status(400).json({
        success: false,
        error: "github URL is required",
      });
    }

    console.log(`\n📨 Received portfolio analysis request for candidate: ${input.candidateId}`);

    // Run the agentic analysis
    const result = await analyzePortfolio(input);

    console.log(`✅ Analysis complete for candidate: ${input.candidateId}`);

    // Save to database
    await savePortfolioAnalysis(input.candidateId, input.github!, result);

    console.log(`💾 Portfolio analysis saved to database for candidate: ${input.candidateId}`);

    return res.status(200).json({
      success: true,
      data: {
        candidateId: result.candidateId,
        overallScore: result.overallScore,
        recommendation: result.recommendation,
        summary: result.summary,
        topProjects: [], // Add actual top projects here
        strengths: [], // Add actual strengths here
        weaknesses: [], // Add actual weaknesses here
        concerns: [], // Add actual concerns here
        standoutQualities: [], // Add standout qualities here
        resumeAlignment: 0, // Add actual alignment score here
        technicalLevel: '', // Add actual technical level here
      },
    });
  } catch (error: any) {
    console.error("Portfolio analysis error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error during portfolio analysis",
    });
  }
}
