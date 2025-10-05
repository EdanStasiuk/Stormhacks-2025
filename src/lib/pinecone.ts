import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

export { pinecone };

async function testPineconeConnection() {
    try {
        const indexes = await pinecone.listIndexes();
        console.log('Pinecone indexes:', indexes);
    } catch (error) {
        console.error('Error connecting to Pinecone:', error);
    }
}

// Uncomment the line below to test the connection
// testPineconeConnection();

async function createStarterIndex() {
    try {
        const indexName = 'job-matching-index';

        await pinecone.createIndexForModel({
            name: indexName,
            cloud: 'aws',
            region: 'us-east-1',
            embed: {
                model: 'llama-text-embed-v2',
                fieldMap: { text: 'chunk_text' },
            },
            waitUntilReady: true,
        });

        console.log(`Index "${indexName}" created successfully.`);
    } catch (error) {
        console.error('Error creating starter index:', error);
    }
}

// Uncomment the line below to create the starter index
// createStarterIndex();

/**
 * Query Pinecone for similar vectors (semantic search)
 * @param embedding - The query embedding vector
 * @param topK - Number of top results to return (default: 10)
 * @param filter - Optional metadata filter
 * @returns Array of matches with scores
 */
export async function queryPinecone(
    embedding: number[],
    topK: number = 10,
    filter?: Record<string, any>
) {
    try {
        const index = pinecone.Index('candidates-job-matching');

        const queryResponse = await index.query({
            vector: embedding,
            topK,
            includeMetadata: true,
            includeValues: false,
            ...(filter && { filter }),
        });

        return queryResponse.matches || [];
    } catch (error) {
        console.error('Error querying Pinecone:', error);
        throw error;
    }
}