import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { queryPinecone } from '../../src/lib/pinecone';
import { prisma } from '../../src/lib/prisma';

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

    // Handle both array format and object format with values property
    if (Array.isArray(embedding)) {
        return embedding;
    } else if (embedding && typeof embedding === 'object' && 'values' in embedding) {
        return (embedding as any).values;
    } else {
        throw new Error('Failed to generate embeddings: Invalid embedding format');
    }
}

export interface CandidateMatch {
    candidateId: string;
    resumeId: string;
    score: number;
    metadata?: Record<string, any>;
}

export interface MatchCandidatesRequest {
    jobDescription: string;
    jobId?: string;
    topK?: number;
    threshold?: number; // Minimum similarity score (0-1)
    updateScores?: boolean; // Whether to update candidate scores in DB
}

export interface MatchCandidatesResponse {
    success: boolean;
    matches?: CandidateMatch[];
    count?: number;
    error?: string;
}

/**
 * POST /api/match-candidates
 *
 * Match candidates to a job description using semantic search
 *
 * Request body:
 * {
 *   jobDescription: string,
 *   jobId?: string,
 *   topK?: number (default: 10),
 *   threshold?: number (default: 0.0),
 *   updateScores?: boolean (default: false)
 * }
 *
 * Response:
 * {
 *   success: true,
 *   matches: [{ candidateId, resumeId, score, metadata }],
 *   count: number
 * }
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MatchCandidatesResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST.',
        });
    }

    try {
        const {
            jobDescription,
            jobId,
            topK = 10,
            threshold = 0.0,
            updateScores = false,
        }: MatchCandidatesRequest = req.body;

        // Validation
        if (!jobDescription || typeof jobDescription !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'jobDescription is required and must be a string',
            });
        }

        console.log(`\n🔍 Matching candidates for job${jobId ? ` ID: ${jobId}` : ''}`);
        console.log(`Job description: ${jobDescription.substring(0, 100)}...`);

        // Generate embedding for job description
        const jobEmbedding = await generateEmbedding(jobDescription);
        console.log(`✅ Generated job embedding (${jobEmbedding.length} dimensions)`);

        // Query Pinecone for similar resume embeddings
        const pineconeMatches = await queryPinecone(jobEmbedding, topK);
        console.log(`✅ Found ${pineconeMatches.length} matches from Pinecone`);

        // Filter by threshold and extract candidate information
        const matches: CandidateMatch[] = [];

        for (const match of pineconeMatches) {
            if (match.score && match.score >= threshold) {
                // Extract candidateId and resumeId from Pinecone ID
                // Expected format: "resume-{resumeId}" or custom format
                const id = match.id || '';

                // Parse the ID to extract resume/candidate information
                let resumeId = '';
                let candidateId = '';

                if (id.startsWith('resume-')) {
                    resumeId = id.replace('resume-', '');

                    // Look up the resume to get candidateId
                    try {
                        const resume = await prisma.resume.findUnique({
                            where: { id: resumeId },
                            select: { candidateId: true },
                        });

                        if (resume) {
                            candidateId = resume.candidateId;
                        }
                    } catch (error) {
                        console.warn(`Could not find resume ${resumeId}:`, error);
                        continue;
                    }
                }

                if (candidateId && resumeId) {
                    matches.push({
                        candidateId,
                        resumeId,
                        score: match.score,
                        metadata: match.metadata as Record<string, any>,
                    });

                    // Update candidate score in database if requested
                    if (updateScores && jobId) {
                        try {
                            await prisma.candidate.update({
                                where: { id: candidateId },
                                data: { score: match.score },
                            });
                        } catch (error) {
                            console.warn(`Could not update score for candidate ${candidateId}:`, error);
                        }
                    }
                }
            }
        }

        // Sort by score descending
        matches.sort((a, b) => b.score - a.score);

        console.log(`✅ Processed ${matches.length} candidate matches (threshold: ${threshold})`);

        return res.status(200).json({
            success: true,
            matches,
            count: matches.length,
        });
    } catch (error: any) {
        console.error('Error matching candidates:', error);

        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error during candidate matching',
        });
    }
}
