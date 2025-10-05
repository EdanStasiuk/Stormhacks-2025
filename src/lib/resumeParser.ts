/**
 * Resume Parser
 *
 * Uses Gemini AI to extract structured candidate data from resume text
 */

import { generateJSON } from "./gemini";

export interface ParsedResumeData {
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: string;
  education: string;
  github?: string;
  linkedin?: string;
  website?: string;
  rawText: string;
}

/**
 * Parse resume text and extract structured candidate information
 *
 * @param resumeText - Raw text extracted from PDF resume
 * @returns Structured candidate data
 */
export async function parseResume(resumeText: string): Promise<ParsedResumeData> {
  const prompt = `You are a resume parser. Extract structured information from the following resume text.

Resume Text:
${resumeText}

Extract the following information:
1. Candidate's full name
2. Email address
3. Phone number (if available)
4. List of technical skills (programming languages, frameworks, tools, technologies)
5. Work experience summary (combine all experience into a single descriptive paragraph)
6. Education summary (degrees, institutions, graduation years)
7. GitHub profile URL (if available)
8. LinkedIn profile URL (if available)
9. Personal website URL (if available)

IMPORTANT RULES:
- If you cannot find the name, use "Unknown Candidate"
- If you cannot find the email, generate a placeholder like "noemail+[random]@example.com"
- Extract ALL technical skills mentioned (be generous, include technologies, languages, frameworks, tools)
- For experience and education, create a brief summary paragraph
- Look for GitHub, LinkedIn, and personal website URLs in the resume
- Only include URLs if they are valid and present in the resume

Respond with JSON only:
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "skills": ["JavaScript", "React", "Node.js", "Python"],
  "experience": "5 years as Software Engineer at ABC Corp, worked on web applications using React and Node.js. Previously 2 years at XYZ Inc as Junior Developer.",
  "education": "B.S. Computer Science from University of Example (2018). Relevant coursework in algorithms and data structures.",
  "github": "https://github.com/johndoe",
  "linkedin": "https://linkedin.com/in/johndoe",
  "website": "https://johndoe.dev"
}`;

  const parsed = await generateJSON<Omit<ParsedResumeData, "rawText">>(prompt);

  return {
    ...parsed,
    rawText: resumeText,
  };
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a unique placeholder email
 */
export function generatePlaceholderEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `noemail+${timestamp}-${random}@placeholder.com`;
}

/**
 * Ensure email is valid, generate placeholder if needed
 */
export function ensureValidEmail(email: string | undefined): string {
  if (!email || !isValidEmail(email)) {
    return generatePlaceholderEmail();
  }
  return email;
}
