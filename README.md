# Lumina

Lumina is an AI-powered recruiter platform built with [Next.js](https://nextjs.org). It allows recruiters to upload resumes in bulk, analyze candidate portfolios (GitHub, LinkedIn, personal websites), and generate AI-driven candidate rankings and summaries.

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

## Project Directory Structure

lumina/
├── public/                  # Static assets (images, logos, etc.)
├── src/
│   └── app/
│       ├── page.tsx          # Home / Dashboard page
│       ├── jobs/
│       │   └── [id]/page.tsx # Dynamic job details page
│       └── candidates/
│           └── [id]/page.tsx # Dynamic candidate profile page
├── src/components/          # Reusable UI components
│   ├── UploadForm.tsx
│   ├── CandidateCard.tsx
│   └── CandidateDetail.tsx
├── src/lib/                 # Backend / utility functions
│   ├── openai.ts            # OpenAI API helpers
│   ├── parser.ts            # Resume parsing helper
│   └── githubMCP.ts         # GitHub MCP client (optional)
├── pages/api/               # API routes
│   ├── upload.ts             # Resume upload endpoint
│   ├── parse.ts              # Resume parsing endpoint
│   └── analyze.ts            # Candidate scoring endpoint
├── uploads/                 # Temporary folder for storing uploaded resumes
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── globals.css
├── LICENSE
├── next.config.js
└── .eslintrc.json
```
