/**
 * Agentic Portfolio Analyzer
 *
 * Multi-phase AI-powered analysis of candidate portfolios using Gemini
 *
 * Workflow:
 * 1. Context Gathering - Extract candidate profile from resume
 * 2. Repository Discovery - Intelligently filter and rank repos
 * 3. Deep Analysis - Detailed evaluation of selected repos
 * 4. Final Synthesis - Generate comprehensive assessment
 */

import { generateJSON, generateContent } from "./gemini";
import {
  fetchGitHubPortfolio,
  fetchRepoReadme,
  fetchRepoLanguages,
  GitHubRepo,
} from "./github";

// ================== TYPES ==================

export interface ResumeData {
  skills?: string[];
  experience?: string[];
  projects?: string[];
  rawText?: string;
}

export interface PortfolioAnalysisInput {
  candidateId: string;
  resumeData: ResumeData;
  github?: string;
  jobDescription?: string;
}

export interface CandidateProfile {
  technicalSkills: string[];
  careerLevel: "junior" | "mid" | "senior" | "lead" | "unknown";
  projectThemes: string[];
  searchCriteria: string[];
}

export interface SelectedRepo {
  name: string;
  fullName: string;
  url: string;
  relevanceScore: number;
  reason: string;
}

export interface RepoAnalysis {
  repo: string;
  url: string;
  qualityScore: number; // 1-10 - How impressive/well-built the project is
  relevanceScore: number; // 1-10 - How well it matches resume skills/claims
  impressivenessLevel: "exceptional" | "strong" | "good" | "average" | "weak";
  resumeMatchLevel: "perfect_match" | "strong_match" | "partial_match" | "weak_match" | "no_match";
  technologies: string[];
  strengths: string[];
  concerns: string[];
  matchesResumeClaims: boolean;
  resumeClaimsValidated: string[]; // Specific resume claims this project validates
  resumeClaimsContradicted: string[]; // Claims that don't match the evidence
  insights: string;
}

export interface PortfolioAnalysisResult {
  candidateId: string;
  overallScore: number; // 1-10
  summary: string;
  topProjects: RepoAnalysis[];
  strengths: string[];
  weaknesses: string[];
  concerns: string[];
  resumeAlignment: number; // 1-10
  recommendation: "strong_hire" | "interview" | "maybe" | "pass";
  technicalLevel: string;
  standoutQualities: string[];
}

// ================== PHASE 1: CONTEXT GATHERING ==================

async function phaseOneContextGathering(
  resumeData: ResumeData,
  jobDescription?: string
): Promise<CandidateProfile> {
  const prompt = `You are analyzing a candidate's resume to extract their technical profile.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `Job Requirements:\n${jobDescription}\n` : ""}

Extract the following information:
1. Technical skills mentioned (programming languages, frameworks, tools)
2. Career level based on experience (junior/mid/senior/lead)
3. Project themes (e.g., "web development", "machine learning", "mobile apps")
4. Search criteria for finding relevant GitHub repositories

Respond with JSON only:
{
  "technicalSkills": ["skill1", "skill2"],
  "careerLevel": "mid",
  "projectThemes": ["theme1", "theme2"],
  "searchCriteria": ["criteria1", "criteria2"]
}`;

  return generateJSON<CandidateProfile>(prompt);
}

// ================== PHASE 2: REPOSITORY DISCOVERY ==================

async function phaseTwoRepositoryDiscovery(
  repos: GitHubRepo[],
  candidateProfile: CandidateProfile,
  topN: number = 5
): Promise<SelectedRepo[]> {
  const repoSummaries = repos.map((repo) => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    topics: repo.topics,
    lastUpdated: repo.updated_at,
    isFork: repo.fork,
  }));

  const prompt = `You are evaluating GitHub repositories to find the most impressive and relevant ones for a candidate.

Candidate Profile:
- Technical Skills: ${candidateProfile.technicalSkills.join(", ")}
- Career Level: ${candidateProfile.careerLevel}
- Project Themes: ${candidateProfile.projectThemes.join(", ")}

Available Repositories (${repos.length} total):
${JSON.stringify(repoSummaries, null, 2)}

Your task:
1. Filter out trivial repos (tutorials, forks, toy projects, practice exercises)
2. Rank remaining repos by:
   - Relevance to candidate's stated skills and themes
   - Project complexity and impressiveness
   - Code quality signals (stars, activity, description quality)
3. Select the top ${topN} most impressive and relevant repositories

For each selected repo, provide:
- relevanceScore (1-10): How well it matches the candidate's profile
- reason: Brief explanation of why this repo is impressive/relevant

Respond with JSON only:
{
  "selectedRepos": [
    {
      "name": "repo-name",
      "fullName": "username/repo-name",
      "url": "https://github.com/username/repo-name",
      "relevanceScore": 8,
      "reason": "Demonstrates advanced React skills with production-quality code"
    }
  ]
}`;

  const result = await generateJSON<{ selectedRepos: SelectedRepo[] }>(
    prompt
  );

  return result.selectedRepos.slice(0, topN);
}

// ================== PHASE 3: DEEP REPOSITORY ANALYSIS ==================

async function phaseThreeDeepAnalysis(
  selectedRepos: SelectedRepo[],
  candidateProfile: CandidateProfile,
  resumeData: ResumeData
): Promise<RepoAnalysis[]> {
  const analyses: RepoAnalysis[] = [];

  for (const selectedRepo of selectedRepos) {
    const [owner, repoName] = selectedRepo.fullName.split("/");

    try {
      // Fetch detailed repo data
      const [readme, languages] = await Promise.all([
        fetchRepoReadme(owner, repoName),
        fetchRepoLanguages(owner, repoName),
      ]);

      const prompt = `You are conducting a deep technical analysis of a GitHub repository for candidate evaluation.

Repository: ${selectedRepo.name}
URL: ${selectedRepo.url}
Why Selected: ${selectedRepo.reason}

README Content:
${readme ? readme.substring(0, 3000) : "No README available"}

Languages Used:
${JSON.stringify(languages, null, 2)}

Candidate's Resume Claims:
${JSON.stringify(resumeData, null, 2)}

Candidate Profile:
- Skills: ${candidateProfile.technicalSkills.join(", ")}
- Level: ${candidateProfile.careerLevel}

Analyze this repository comprehensively:

1. **Impressiveness**: How well-built, sophisticated, and impressive is this project?
   - Rate qualityScore (1-10) and provide impressivenessLevel: exceptional/strong/good/average/weak

2. **Resume Match**: How well does this project match the candidate's resume claims?
   - Rate relevanceScore (1-10) and provide resumeMatchLevel: perfect_match/strong_match/partial_match/weak_match/no_match
   - List specific resume claims this project VALIDATES (resumeClaimsValidated)
   - List specific resume claims this project CONTRADICTS (resumeClaimsContradicted)

3. **Technical Analysis**:
   - Technologies used
   - Strengths (what's impressive about it)
   - Concerns or red flags
   - Overall insights

Respond with JSON only:
{
  "qualityScore": 8,
  "relevanceScore": 9,
  "impressivenessLevel": "strong",
  "resumeMatchLevel": "strong_match",
  "technologies": ["React", "TypeScript", "Node.js"],
  "strengths": ["Well documented", "Production ready", "Good architecture"],
  "concerns": ["Limited test coverage"],
  "matchesResumeClaims": true,
  "resumeClaimsValidated": ["Claims 5 years React experience - validated by advanced React patterns", "Built scalable systems - architecture supports this"],
  "resumeClaimsContradicted": [],
  "insights": "This project demonstrates strong full-stack skills with modern tooling. The architecture shows senior-level decision making. Validates resume claims about React expertise."
}`;

      const analysis = await generateJSON<Omit<RepoAnalysis, "repo" | "url">>(
        prompt
      );

      analyses.push({
        repo: selectedRepo.name,
        url: selectedRepo.url,
        ...analysis,
      });
    } catch (error) {
      console.error(`Error analyzing repo ${selectedRepo.name}:`, error);
      // Continue with other repos
    }
  }

  return analyses;
}

// ================== PHASE 4: FINAL SYNTHESIS ==================

async function phaseFourFinalSynthesis(
  candidateProfile: CandidateProfile,
  repoAnalyses: RepoAnalysis[],
  resumeData: ResumeData,
  jobDescription?: string
): Promise<Omit<PortfolioAnalysisResult, "candidateId">> {
  const prompt = `You are a senior technical recruiter providing a final hiring assessment.

Candidate Profile:
- Technical Skills: ${candidateProfile.technicalSkills.join(", ")}
- Career Level: ${candidateProfile.careerLevel}
- Project Themes: ${candidateProfile.projectThemes.join(", ")}

Resume Data:
${JSON.stringify(resumeData, null, 2)}

GitHub Repository Analysis:
${JSON.stringify(repoAnalyses, null, 2)}

${jobDescription ? `Job Requirements:\n${jobDescription}` : ""}

Provide a comprehensive hiring assessment:

1. Overall portfolio quality score (1-10)
2. Key strengths demonstrated through projects
3. Weaknesses or gaps in portfolio
4. Any concerns or red flags
5. Resume-portfolio alignment score (1-10)
6. Hiring recommendation: strong_hire | interview | maybe | pass
7. Actual technical level demonstrated (may differ from resume claims)
8. Standout qualities that make this candidate unique

Be honest and critical. If the portfolio doesn't match resume claims, say so.

Respond with JSON only:
{
  "overallScore": 8.5,
  "summary": "Strong full-stack developer with proven track record...",
  "topProjects": ${JSON.stringify(repoAnalyses.slice(0, 3))},
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Gap 1", "Gap 2"],
  "concerns": ["Concern 1"] or [],
  "resumeAlignment": 9,
  "recommendation": "interview",
  "technicalLevel": "mid-to-senior",
  "standoutQualities": ["Quality 1", "Quality 2"]
}`;

  const result = await generateJSON<
    Omit<PortfolioAnalysisResult, "candidateId">
  >(prompt);

  return result;
}

// ================== MAIN ORCHESTRATOR ==================

export async function analyzePortfolio(
  input: PortfolioAnalysisInput
): Promise<PortfolioAnalysisResult> {
  console.log(`\n🤖 Starting agentic portfolio analysis for candidate ${input.candidateId}`);

  // PHASE 1: Context Gathering
  console.log("\n📋 Phase 1: Context Gathering");
  const candidateProfile = await phaseOneContextGathering(
    input.resumeData,
    input.jobDescription
  );
  console.log("✅ Candidate profile extracted:", candidateProfile);

  let repoAnalyses: RepoAnalysis[] = [];

  // PHASE 2 & 3: GitHub Analysis (if provided)
  if (input.github) {
    console.log("\n🔍 Phase 2: Repository Discovery");
    const githubData = await fetchGitHubPortfolio(input.github);
    console.log(`Found ${githubData.repos.length} repositories`);

    const selectedRepos = await phaseTwoRepositoryDiscovery(
      githubData.repos,
      candidateProfile,
      5
    );
    console.log(`✅ Selected ${selectedRepos.length} top repositories:`, selectedRepos.map(r => r.name));

    console.log("\n🔬 Phase 3: Deep Repository Analysis");
    repoAnalyses = await phaseThreeDeepAnalysis(
      selectedRepos,
      candidateProfile,
      input.resumeData
    );
    console.log(`✅ Analyzed ${repoAnalyses.length} repositories`);
  }

  // PHASE 4: Final Synthesis
  console.log("\n🎯 Phase 4: Final Synthesis");
  const finalAssessment = await phaseFourFinalSynthesis(
    candidateProfile,
    repoAnalyses,
    input.resumeData,
    input.jobDescription
  );
  console.log("✅ Final assessment complete");

  const result: PortfolioAnalysisResult = {
    candidateId: input.candidateId,
    ...finalAssessment,
  };

  console.log("\n✨ Portfolio analysis complete!");
  return result;
}
