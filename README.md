# Lumina - AI-Powered Talent Intelligence Platform

## Inspiration

Recruiters spend countless hours manually screening resumes, cross-referencing portfolios, and verifying candidate claims. We built **Lumina** to automate this tedious process and deliver recruiter-ready intelligence the moment a resume enters the pipeline.

---

## What It Does

Lumina transforms raw resumes and candidate portfolios into comprehensive, narrative-rich candidate profiles. Key features include:

- **Bulk Resume Processing** – Upload multiple resumes at once for a job position
- **Intelligent Parsing** – Extracts structured data from PDFs including skills, experience, and education
- **Smart Candidate Ranking** – Uses semantic matching with Pinecone vector search to score candidates against job requirements
- **Deep Portfolio Analysis** – Automatically analyzes GitHub profiles through a 4-phase agentic workflow:
  1. **Context Gathering** – Extracts candidate technical profile from resume
  2. **Repository Discovery** – Filters and ranks repositories by relevance
  3. **Deep Analysis** – Evaluates code quality, validates resume claims, identifies strengths/concerns
  4. **Final Synthesis** – Generates comprehensive hiring assessment with recommendations
- **Resume Validation** – Cross-references GitHub projects against resume claims
- **Comprehensive Scoring** – Provides overall match, skills alignment, portfolio quality, and resume-portfolio alignment
- **Interview Selection** – Allows recruiters to shortlist candidates and manage interview pipelines

---

## How We Built It

**Tech Stack:**

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (via Supabase)
- **AI/ML:** Google Gemini for multi-phase agentic analysis and embeddings of resumes/job descriptions
- **Vector Search:** Pinecone for semantic candidate matching
- **Storage:** Supabase for resume file storage
- **APIs:** GitHub API for portfolio analysis

**Architecture:**  
The app uses a multi-phase agentic approach for portfolio analysis, where AI agents autonomously gather context, discover relevant repositories, perform deep technical analysis, and synthesize final recommendations. Semantic search enables intelligent candidate ranking by comparing resume embeddings with job description embeddings in vector space.

---

## Challenges We Ran Into

- Designing an effective multi-phase AI workflow balancing thoroughness with speed
- Parsing diverse resume formats and extracting structured data reliably
- Validating resume claims against actual GitHub projects
- Building a scalable architecture for bulk resume uploads
- Creating a fair scoring system that weighs skills, experience, and portfolio quality

---

## Accomplishments We're Proud Of

- Fully functional 4-phase agentic analysis system for evaluating candidate portfolios
- Resume claim validation against GitHub projects
- Beautiful, responsive UI with real-time analysis progress
- Semantic search system beyond keyword matching
- Comprehensive scoring framework covering job match, skills, experience, and portfolio quality

---

## What We Learned

- Orchestrating multi-phase AI workflows for complex decision-making
- The power of vector embeddings for semantic candidate matching
- Strategies for parsing and structuring unstructured resume data
- Building trust through transparent scoring and explainable AI recommendations
- Validating self-reported skills against tangible evidence

---

## What's Next for Lumina

- LinkedIn profile analysis alongside GitHub
- Team collaboration features for multi-reviewer workflows
- Custom scoring rubrics adaptable to different roles
- ATS integrations for seamless data export
- Interview scheduling and email automation
- Bulk candidate communication features
- Expanded AI analysis to include code quality metrics and contribution patterns
- Support for additional portfolio platforms (GitLab, Bitbucket, personal websites)

---

## Built For

**StormHacks 2025**
