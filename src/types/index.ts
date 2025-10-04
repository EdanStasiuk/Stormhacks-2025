export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  portfolio: string | null;
  linkedin?: string;
  github?: string;
  resumeUrl: string;
  insights: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  candidateCount: number;
  status: "active" | "completed" | "draft";
  createdAt: string;
}

export interface Skill {
  name: string;
  match: number;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface AIAnalysis {
  strengths: string[];
  concerns: string[];
  recommendation: string;
}
