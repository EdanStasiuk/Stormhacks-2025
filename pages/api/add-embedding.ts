import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { pinecone } from '../../src/lib/pinecone';

const gemini = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
});

async function generateEmbedding(text: string) {
    const response = await gemini.models.embedContent({
        model: 'gemini-embedding-001',
        contents: [text],
    });

    if (!response.embeddings || response.embeddings.length === 0) {
        throw new Error('Failed to generate embeddings: No embeddings returned');
    }

    const embedding = response.embeddings[0];

    if (!Array.isArray(embedding)) {
        throw new Error('Failed to generate embeddings: Invalid embedding format');
    }

    return embedding;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text, metadata } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing text input' });
        }

        const embedding = await generateEmbedding(text);

        const index = pinecone.Index('candidates-job-matching');
        await index.upsert([
            {
                id: metadata?.id || `item-${Date.now()}`,
                values: embedding,
                metadata,
            },
        ]);

        res.status(200).json({ message: 'Embedding added successfully' });
    } catch (error) {
        console.error('Error adding embedding:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}