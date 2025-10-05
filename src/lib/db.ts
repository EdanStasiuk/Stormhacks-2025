import { PrismaClient } from '@prisma/client';
import { PortfolioAnalysisResult } from './portfolioAnalyzer';

const prisma = new PrismaClient();

export { prisma };

/**
 * Save portfolio analysis results to the database
 */
export async function savePortfolioAnalysis(
  candidateId: string,
  githubUrl: string,
  analysisResult: PortfolioAnalysisResult
) {
  try {
    // Upsert portfolio record (create or update)
    const portfolio = await prisma.portfolio.upsert({
      where: {
        candidateId: candidateId,
      },
      update: {
        github: githubUrl,
        analysisData: analysisResult as any, // Store full analysis as JSON
        overallScore: analysisResult.overallScore,
        resumeAlignment: analysisResult.resumeAlignment,
        recommendation: analysisResult.recommendation,
        technicalLevel: analysisResult.technicalLevel,
        summary: analysisResult.summary,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        concerns: analysisResult.concerns,
        standoutQualities: analysisResult.standoutQualities,
        analyzedAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        candidateId: candidateId,
        github: githubUrl,
        analysisData: analysisResult as any,
        overallScore: analysisResult.overallScore,
        resumeAlignment: analysisResult.resumeAlignment,
        recommendation: analysisResult.recommendation,
        technicalLevel: analysisResult.technicalLevel,
        summary: analysisResult.summary,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        concerns: analysisResult.concerns,
        standoutQualities: analysisResult.standoutQualities,
        analyzedAt: new Date(),
      },
    });

    console.log(`✅ Portfolio analysis saved to database for candidate: ${candidateId}`);
    return portfolio;
  } catch (error) {
    console.error('Error saving portfolio analysis to database:', error);
    throw error;
  }
}

/**
 * Get portfolio analysis for a candidate
 */
export async function getPortfolioAnalysis(candidateId: string) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        candidateId: candidateId,
      },
    });

    return portfolio;
  } catch (error) {
    console.error('Error fetching portfolio analysis:', error);
    throw error;
  }
}

/**
 * Get all portfolios with analysis
 */
export async function getAllPortfolioAnalyses() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: {
        analysisData: {
          not: null,
        },
      },
      orderBy: {
        analyzedAt: 'desc',
      },
    });

    return portfolios;
  } catch (error) {
    console.error('Error fetching all portfolio analyses:', error);
    throw error;
  }
}
