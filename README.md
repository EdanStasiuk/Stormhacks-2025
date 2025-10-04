# Lumina - AI Recruiter Platform

An intelligent recruitment platform that uses AI to parse, analyze, and rank candidates based on their resumes and online portfolios.

## Features

- **Resume Upload & Parsing**: Upload multiple resumes in PDF or TXT format and automatically extract structured information
- **AI-Powered Analysis**: Uses OpenAI GPT-4o-mini to extract candidate details including skills, experience, and contact information
- **Semantic Matching**: Generates embeddings using OpenAI's text-embedding-3-large model to match candidates with job descriptions
- **Portfolio Analysis**: Automatically analyzes GitHub profiles, LinkedIn, and personal websites
- **Intelligent Ranking**: Combines resume similarity scores with portfolio analysis for comprehensive candidate evaluation
- **Real-time Updates**: Live progress tracking as resumes are processed
- **Secure Authentication**: Email/password authentication with Supabase

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI**: OpenAI GPT-4o-mini & text-embedding-3-large
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## Architecture

### Database Schema
- `jobs`: Job postings with embeddings
- `candidates`: Candidate profiles with parsed resume data
- `resume_files`: Uploaded file metadata
- `portfolio_analyses`: AI analysis of GitHub, LinkedIn, and portfolio sites
- `processing_logs`: Audit trail of all processing activities

### Edge Functions
- `parse-resume`: Extracts structured data from resume text using AI
- `generate-embeddings`: Creates semantic embeddings for similarity search
- `analyze-portfolio`: Analyzes GitHub repos and online profiles
- `rank-candidates`: Calculates final ranking scores

## Getting Started

1. Sign up for an account
2. Create a new job posting
3. Upload candidate resumes
4. Wait for automatic processing and ranking
5. Click "Analyze Portfolios" to fetch GitHub/LinkedIn insights
6. Review ranked candidates and view detailed profiles

## How It Works

1. **Upload**: Recruiter uploads resumes and creates a job description
2. **Parse**: AI extracts structured data (name, email, skills, etc.)
3. **Embed**: Text is converted to semantic embeddings
4. **Match**: Cosine similarity is calculated between job and resumes
5. **Analyze**: GitHub profiles are automatically analyzed for technical skills
6. **Rank**: Final scores combine resume match (60%) and portfolio quality (40%)
7. **Review**: View ranked candidates with AI-generated insights
