import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { pinecone } from "@/lib/pinecone";

/**
 * GET /api/candidates/[id] - Get a specific candidate with full details
 * DELETE /api/candidates/[id] - Delete a candidate and all associated data
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      error: "Invalid candidate ID",
    });
  }

  if (req.method === "GET") {
    try {
      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          portfolio: true,
          resumes: {
            orderBy: {
              uploadedAt: "desc",
            },
          },
          transcripts: {
            orderBy: {
              uploadedAt: "desc",
            },
          },
          job: true,
        },
      });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          error: "Candidate not found",
        });
      }

      const formattedCandidate = {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills || [],
        experience: candidate.experience || "",
        education: candidate.education || "",
        overallScore: candidate.portfolio?.overallScore || candidate.score || 0,
        skillScore: candidate.portfolio?.overallScore || candidate.score || 0,
        experienceScore: candidate.portfolio?.resumeAlignment || candidate.score || 0,
        educationScore: candidate.portfolio?.overallScore || candidate.score || 0,
        linkedin: candidate.portfolio?.linkedin || null,
        github: candidate.portfolio?.github || null,
        resumeUrl: candidate.resumes[0]?.fileUrl || null,
        insights: candidate.portfolio?.summary || "No analysis available yet",
        job: {
          id: candidate.job.id,
          title: candidate.job.title,
        },
        portfolio: candidate.portfolio ? {
          github: candidate.portfolio.github,
          linkedin: candidate.portfolio.linkedin,
          website: candidate.portfolio.website,
          analysisData: candidate.portfolio.analysisData,
          analyzedAt: candidate.portfolio.analyzedAt,
          overallScore: candidate.portfolio.overallScore,
          resumeAlignment: candidate.portfolio.resumeAlignment,
          recommendation: candidate.portfolio.recommendation,
          technicalLevel: candidate.portfolio.technicalLevel,
          summary: candidate.portfolio.summary,
          strengths: candidate.portfolio.strengths,
          weaknesses: candidate.portfolio.weaknesses,
          concerns: candidate.portfolio.concerns,
          standoutQualities: candidate.portfolio.standoutQualities,
        } : undefined,
        resumes: candidate.resumes.map(r => ({
          id: r.id,
          fileUrl: r.fileUrl,
          uploadedAt: r.uploadedAt.toISOString(),
        })),
        createdAt: candidate.createdAt.toISOString(),
        updatedAt: candidate.updatedAt.toISOString(),
      };

      return res.status(200).json({
        success: true,
        data: formattedCandidate,
      });
    } catch (error: any) {
      console.error("Error fetching candidate:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch candidate",
      });
    }
  } else if (req.method === "DELETE") {
    try {
      // Get candidate with all related data
      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          resumes: true,
          portfolio: true,
          transcripts: true,
        },
      });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          error: "Candidate not found",
        });
      }

      // Delete all resume embeddings from Pinecone
      const index = pinecone.Index("candidates-job-matching");
      for (const resume of candidate.resumes) {
        try {
          await index.deleteOne(`resume-${resume.id}`);
          console.log(`✅ Deleted resume embedding from Pinecone: resume-${resume.id}`);
        } catch (pineconeError) {
          console.error(`Error deleting resume ${resume.id} from Pinecone:`, pineconeError);
          // Continue with deletion even if Pinecone fails
        }
      }

      // Delete the candidate (cascading deletes will handle related records)
      await prisma.candidate.delete({
        where: { id },
      });

      console.log(`✅ Deleted candidate: ${id}`);

      return res.status(200).json({
        success: true,
        message: "Candidate deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting candidate:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to delete candidate",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}
