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
testPineconeConnection();