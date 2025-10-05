# Database Seed Data

This document describes the test data that has been seeded into the database.

## Running the Seed Script

To populate the database with test data, run:

```bash
pnpm db:seed
```

This will:
1. Clear all existing data
2. Create fresh test data
3. Populate jobs, candidates, portfolios, and resumes

## Test Data Overview

### Jobs (3 total)

1. **Senior Frontend Developer**
   - Description: Looking for experienced React/TypeScript developer
   - Candidates: 3

2. **Backend Engineer**
   - Description: Building scalable APIs and microservices
   - Candidates: 2

3. **Full Stack Developer**
   - Description: End-to-end feature development
   - Candidates: 1

### Candidates (6 total)

#### Frontend Developer Candidates

1. **Alice Johnson** (alice.johnson@email.com)
   - Score: 95
   - Skills: React, TypeScript, Next.js, Tailwind CSS, GraphQL
   - Recommendation: Strong Hire
   - GitHub: https://github.com/alicejohnson
   - LinkedIn: https://linkedin.com/in/alicejohnson
   - Website: https://alice.dev

2. **Bob Smith** (bob.smith@email.com)
   - Score: 88
   - Skills: Vue.js, JavaScript, CSS, Webpack, REST APIs
   - Recommendation: Interview
   - GitHub: https://github.com/bobsmith
   - LinkedIn: https://linkedin.com/in/bobsmith

3. **Carol Davis** (carol.davis@email.com)
   - Score: 82
   - Skills: React, JavaScript, HTML/CSS, Figma, UI/UX Design
   - Recommendation: Maybe
   - LinkedIn: https://linkedin.com/in/caroldavis
   - Website: https://caroldesigns.com

#### Backend Engineer Candidates

4. **David Chen** (david.chen@email.com)
   - Score: 92
   - Skills: Node.js, PostgreSQL, Docker, Kubernetes, AWS
   - Recommendation: Strong Hire
   - GitHub: https://github.com/davidchen
   - LinkedIn: https://linkedin.com/in/davidchen

5. **Emma Wilson** (emma.wilson@email.com)
   - Score: 85
   - Skills: Python, Django, Redis, MongoDB, GCP
   - Recommendation: Interview
   - GitHub: https://github.com/emmawilson
   - LinkedIn: https://linkedin.com/in/emmawilson

#### Full Stack Developer Candidates

6. **Frank Martinez** (frank.martinez@email.com)
   - Score: 90
   - Skills: React, Node.js, TypeScript, PostgreSQL, MongoDB
   - Recommendation: Strong Hire
   - GitHub: https://github.com/frankmartinez
   - LinkedIn: https://linkedin.com/in/frankmartinez
   - Website: https://frank.codes

## Portfolio Analysis Data

All candidates have complete AI analysis data including:
- Overall Score (1-10)
- Resume Alignment Score
- Recommendation (strong_hire, interview, maybe, pass)
- Technical Level
- Summary
- Strengths (array)
- Weaknesses (array)
- Concerns (array)
- Standout Qualities (array)

## Sample Resumes

Two sample resume records are included for:
- Alice Johnson
- David Chen

## Testing the Application

After running the seed script, you can:

1. Visit `/dashboard` to see all 3 jobs
2. Click on "Senior Frontend Developer" to see 3 candidates ranked by score
3. Click on any candidate to see their detailed profile with AI analysis
4. All portfolio links and analysis data will be populated

## Resetting the Database

Running `pnpm db:seed` again will:
- Delete all existing data
- Create fresh test data
- This is useful for testing or resetting to a known state
