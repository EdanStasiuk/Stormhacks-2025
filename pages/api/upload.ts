import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import { supabase } from '../../src/lib/supabase';
import { PDFParse } from 'pdf-parse';
import { readFile } from 'fs/promises';
import { prisma } from '../../src/lib/prisma';

export const config = {
    api: {
        bodyParser: false, // Disable bodyParser to handle file uploads
    },
};

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

async function handleZipUpload(filePath: string) {
    const extractedFiles: string[] = [];

    await fs.createReadStream(filePath)
        .pipe(unzipper.Parse())
        .on('entry', async (entry) => {
            const fileName = entry.path;
            const fullPath = path.join(uploadDir, fileName);

            if (path.extname(fileName).toLowerCase() === '.pdf') {
                extractedFiles.push(fullPath);
                entry.pipe(fs.createWriteStream(fullPath));
            } else {
                entry.autodrain();
            }
        })
        .promise();

    return extractedFiles;
}

async function handleSinglePdfUpload(file: formidable.File): Promise<string> {
    const filePath = path.join(uploadDir, file.originalFilename || file.newFilename);
    await fs.promises.rename(file.filepath, filePath);
    return filePath;
}

const bucketName = 'uploads';

async function uploadToSupabase(filePath: string, bucket: string, fileName: string): Promise<string> {
    const fileBuffer = await fs.promises.readFile(filePath);
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
    });

    if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
    }

    return data.path;
}

async function parseResume(filePath: string): Promise<{ text: string; metadata: any }> {
    const fileBuffer = await readFile(filePath);
    const parser = new PDFParse({ data: fileBuffer });
    const textResult = await parser.getText();

    return {
        text: textResult.text,
        metadata: {}, // Metadata extraction removed as `numpages` and `info` are not available
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new formidable.IncomingForm({
        uploadDir,
        keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).json({ error: 'Error processing upload' });
        }

        try {
            const uploadedFiles = files.file as formidable.File | formidable.File[] | undefined;
            if (!uploadedFiles) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            let processedFiles: string[] = [];

            if (Array.isArray(uploadedFiles)) {
                for (const file of uploadedFiles) {
                    if (file.mimetype === 'application/zip') {
                        const extracted = await handleZipUpload(file.filepath);
                        for (const extractedFile of extracted) {
                            const fileName = path.basename(extractedFile);
                            const supabasePath = await uploadToSupabase(extractedFile, bucketName, fileName);
                            processedFiles.push(supabasePath);
                        }
                    } else if (file.mimetype === 'application/pdf') {
                        const singleFile = await handleSinglePdfUpload(file);
                        const fileName = path.basename(singleFile);
                        const supabasePath = await uploadToSupabase(singleFile, bucketName, fileName);

                        // Save parsed data to database
                        const parsed = await parseResume(singleFile);
                        const candidateId = Array.isArray(fields.candidateId) ? fields.candidateId[0] : fields.candidateId;

                        if (!candidateId) {
                            throw new Error('Candidate ID is required to save the resume.');
                        }

                        await prisma.resume.create({
                            data: {
                                fileUrl: supabasePath,
                                parsedText: parsed.text,
                                metadata: parsed.metadata,
                                candidateId,
                                parsedData: {}, // Provide an empty object or actual parsed data if available
                            },
                        });

                        processedFiles.push(supabasePath);
                    }
                }
            } else {
                if (uploadedFiles.mimetype === 'application/zip') {
                    const extracted = await handleZipUpload(uploadedFiles.filepath);
                    for (const extractedFile of extracted) {
                        const fileName = path.basename(extractedFile);
                        const supabasePath = await uploadToSupabase(extractedFile, bucketName, fileName);
                        processedFiles.push(supabasePath);
                    }
                } else if (uploadedFiles.mimetype === 'application/pdf') {
                    const singleFile = await handleSinglePdfUpload(uploadedFiles);
                    const fileName = path.basename(singleFile);
                    const supabasePath = await uploadToSupabase(singleFile, bucketName, fileName);

                    // Save parsed data to database
                    const parsed = await parseResume(singleFile);
                    const candidateId = Array.isArray(fields.candidateId) ? fields.candidateId[0] : fields.candidateId;

                    if (!candidateId) {
                        throw new Error('Candidate ID is required to save the resume.');
                    }

                    await prisma.resume.create({
                        data: {
                            fileUrl: supabasePath,
                            parsedText: parsed.text,
                            metadata: parsed.metadata,
                            candidateId,
                            parsedData: {}, // Provide an empty object or actual parsed data if available
                        },
                    });

                    processedFiles.push(supabasePath);
                }
            }

            res.status(200).json({ message: 'Files uploaded successfully', files: processedFiles });
        } catch (error) {
            console.error('Error handling upload:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}