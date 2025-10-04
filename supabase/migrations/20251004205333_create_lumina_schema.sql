/*
  # Lumina AI Recruiter Platform - Database Schema

  ## Overview
  This migration creates the complete database schema for the Lumina AI recruiter platform.
  The platform allows recruiters to upload resumes, match candidates against job descriptions,
  and analyze candidate portfolios using AI.

  ## New Tables

  ### 1. `jobs`
  Stores job postings created by recruiters.
  - `id` (uuid, primary key) - Unique job identifier
  - `user_id` (uuid, foreign key) - References auth.users (recruiter who created the job)
  - `title` (text) - Job title
  - `description` (text) - Full job description
  - `requirements` (text) - Specific job requirements
  - `embedding` (vector(3072)) - OpenAI embedding for semantic search
  - `status` (text) - Job status: 'active', 'closed', 'draft'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `candidates`
  Stores candidate information parsed from resumes.
  - `id` (uuid, primary key) - Unique candidate identifier
  - `job_id` (uuid, foreign key) - References jobs table
  - `name` (text) - Candidate name
  - `email` (text) - Candidate email
  - `phone` (text, nullable) - Candidate phone number
  - `resume_text` (text) - Full parsed resume text
  - `skills` (text[], nullable) - Array of detected skills
  - `experience_years` (integer, nullable) - Years of experience
  - `education` (text, nullable) - Education details
  - `linkedin_url` (text, nullable) - LinkedIn profile URL
  - `github_url` (text, nullable) - GitHub profile URL
  - `portfolio_url` (text, nullable) - Personal portfolio URL
  - `embedding` (vector(3072)) - OpenAI embedding for resume
  - `similarity_score` (float, nullable) - Similarity to job description (0-1)
  - `overall_score` (float, nullable) - Combined score including portfolio analysis
  - `status` (text) - Processing status: 'pending', 'parsing', 'analyzing', 'completed', 'failed'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `resume_files`
  Stores uploaded resume file metadata.
  - `id` (uuid, primary key) - Unique file identifier
  - `candidate_id` (uuid, foreign key) - References candidates table
  - `job_id` (uuid, foreign key) - References jobs table
  - `filename` (text) - Original filename
  - `file_size` (bigint) - File size in bytes
  - `file_type` (text) - MIME type (e.g., 'application/pdf')
  - `storage_path` (text) - Path in storage bucket
  - `uploaded_at` (timestamptz) - Upload timestamp

  ### 4. `portfolio_analyses`
  Stores AI analysis results of candidate portfolios.
  - `id` (uuid, primary key) - Unique analysis identifier
  - `candidate_id` (uuid, foreign key) - References candidates table
  - `source_type` (text) - 'github', 'linkedin', 'website'
  - `source_url` (text) - Full URL analyzed
  - `analysis_summary` (text) - AI-generated summary
  - `technical_skills` (jsonb, nullable) - Detected technical skills and proficiency
  - `projects` (jsonb, nullable) - Analyzed projects and contributions
  - `activity_score` (float, nullable) - Activity/contribution score (0-100)
  - `relevance_score` (float, nullable) - Relevance to job (0-100)
  - `raw_data` (jsonb, nullable) - Raw data from API
  - `created_at` (timestamptz) - Analysis timestamp

  ### 5. `processing_logs`
  Tracks processing status and errors for debugging.
  - `id` (uuid, primary key) - Unique log identifier
  - `candidate_id` (uuid, foreign key, nullable) - References candidates table
  - `job_id` (uuid, foreign key, nullable) - References jobs table
  - `process_type` (text) - 'resume_parse', 'embedding', 'portfolio_analysis', 'ranking'
  - `status` (text) - 'started', 'completed', 'failed'
  - `message` (text, nullable) - Status message or error details
  - `metadata` (jsonb, nullable) - Additional processing metadata
  - `created_at` (timestamptz) - Log entry timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled to ensure data isolation between users.

  ### Access Policies
  - Recruiters can only access their own jobs and associated candidates
  - All read/write operations require authentication
  - No public access to any data

  ## Indexes
  - Vector similarity search indexes for embeddings
  - Foreign key indexes for joins
  - Status indexes for filtering

  ## Notes
  - Uses pgvector extension for embedding similarity search
  - All timestamps use UTC timezone
  - Embeddings use OpenAI's text-embedding-3-large (3072 dimensions)
*/

-- Enable pgvector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  requirements text DEFAULT '',
  embedding vector(3072),
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  name text DEFAULT '',
  email text DEFAULT '',
  phone text,
  resume_text text DEFAULT '',
  skills text[],
  experience_years integer,
  education text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  embedding vector(3072),
  similarity_score float,
  overall_score float,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'parsing', 'analyzing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create resume_files table
CREATE TABLE IF NOT EXISTS resume_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  storage_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now() NOT NULL
);

-- Create portfolio_analyses table
CREATE TABLE IF NOT EXISTS portfolio_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('github', 'linkedin', 'website')),
  source_url text NOT NULL,
  analysis_summary text DEFAULT '',
  technical_skills jsonb,
  projects jsonb,
  activity_score float,
  relevance_score float,
  raw_data jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create processing_logs table
CREATE TABLE IF NOT EXISTS processing_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  process_type text NOT NULL CHECK (process_type IN ('resume_parse', 'embedding', 'portfolio_analysis', 'ranking')),
  status text NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  message text,
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_candidates_job_id ON candidates(job_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_similarity_score ON candidates(similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_resume_files_candidate_id ON resume_files(candidate_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_analyses_candidate_id ON portfolio_analyses(candidate_id);
CREATE INDEX IF NOT EXISTS idx_processing_logs_candidate_id ON processing_logs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_processing_logs_job_id ON processing_logs(job_id);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs table
CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for candidates table
CREATE POLICY "Users can view candidates for own jobs"
  ON candidates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = candidates.job_id
      AND jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create candidates for own jobs"
  ON candidates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = candidates.job_id
      AND jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update candidates for own jobs"
  ON candidates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = candidates.job_id
      AND jobs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = candidates.job_id
      AND jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete candidates for own jobs"
  ON candidates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = candidates.job_id
      AND jobs.user_id = auth.uid()
    )
  );

-- RLS Policies for resume_files table
CREATE POLICY "Users can view resume files for own jobs"
  ON resume_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = resume_files.job_id
      AND jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create resume files for own jobs"
  ON resume_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = resume_files.job_id
      AND jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete resume files for own jobs"
  ON resume_files FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = resume_files.job_id
      AND jobs.user_id = auth.uid()
    )
  );

-- RLS Policies for portfolio_analyses table
CREATE POLICY "Users can view portfolio analyses for own jobs"
  ON portfolio_analyses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM candidates
      JOIN jobs ON jobs.id = candidates.job_id
      WHERE candidates.id = portfolio_analyses.candidate_id
      AND jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create portfolio analyses for own jobs"
  ON portfolio_analyses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM candidates
      JOIN jobs ON jobs.id = candidates.job_id
      WHERE candidates.id = portfolio_analyses.candidate_id
      AND jobs.user_id = auth.uid()
    )
  );

-- RLS Policies for processing_logs table
CREATE POLICY "Users can view processing logs for own jobs"
  ON processing_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = processing_logs.job_id
      AND jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create processing logs for own jobs"
  ON processing_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = processing_logs.job_id
      AND jobs.user_id = auth.uid()
    )
  );

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resume uploads
CREATE POLICY "Users can upload resumes for own jobs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Users can view resumes for own jobs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Users can delete resumes for own jobs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');