"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/ThemeToggle";
import PortfolioAnalysisRoadmap from "@/components/PortfolioAnalysisRoadmap";
import {
  ArrowLeft,
  Mail,
  ExternalLink,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
  Loader2,
} from "lucide-react";

interface RepoAnalysis {
  repo: string;
  url: string;
  qualityScore: number;
  relevanceScore: number;
  impressivenessLevel: string;
  resumeMatchLevel: string;
  technologies: string[];
  strengths: string[];
  concerns: string[];
  matchesResumeClaims: boolean;
  resumeClaimsValidated: string[];
  resumeClaimsContradicted: string[];
  insights: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  education: string;
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  linkedin: string | null;
  github: string | null;
  resumeUrl: string | null;
  insights: string;
  job: {
    id: string;
    title: string;
  };
  portfolio?: {
    github: string | null;
    linkedin: string | null;
    website: string | null;
    analysisData: any;
    analyzedAt: string | null;
    overallScore: number | null;
    resumeAlignment: number | null;
    recommendation: string | null;
    technicalLevel: string | null;
    summary: string | null;
    strengths: string[];
    weaknesses: string[];
    concerns: string[];
    standoutQualities: string[];
  };
  resumes?: Array<{
    id: string;
    fileUrl: string;
    uploadedAt: string;
  }>;
}

export default function CandidateDetail() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const fetchCandidate = async () => {
    try {
      const candidateId = params.id as string;
      const response = await fetch(`/api/candidates/${candidateId}`);
      const result = await response.json();
      if (result.success) {
        setCandidate(result.data);

        // Check if portfolio analysis is pending
        const hasGithub = result.data.portfolio?.github;
        const hasAnalysis = result.data.portfolio?.analyzedAt;

        // Show roadmap if has GitHub but no analysis yet
        if (hasGithub && !hasAnalysis) {
          setShowRoadmap(true);
        } else {
          setShowRoadmap(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [params.id]);

  const handleAnalysisComplete = () => {
    // Refresh candidate data when analysis completes
    fetchCandidate();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Candidate not found</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  {candidate.name}
                </h1>
                <p className="text-sm text-muted-foreground">{candidate.job.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Match Score</div>
                <div className="text-lg font-semibold">{candidate.overallScore}</div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Analysis Roadmap - shows if analysis is in progress */}
          {showRoadmap && candidate.portfolio?.github && (
            <div className="lg:col-span-3">
              <PortfolioAnalysisRoadmap
                jobId={candidate.job.id}
                candidateName={candidate.name}
                onComplete={handleAnalysisComplete}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${candidate.email}`} className="text-primary hover:underline">
                    {candidate.email}
                  </a>
                </div>
                <div className="flex gap-2">
                  {candidate.portfolio?.website && (
                    <a
                      href={candidate.portfolio.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Portfolio
                    </a>
                  )}
                  {candidate.portfolio?.linkedin && (
                    <a
                      href={candidate.portfolio.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                  {candidate.portfolio?.github && (
                    <a
                      href={candidate.portfolio.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      GitHub
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Match */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No skills data available</p>
                )}
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Overall Skill Match</span>
                      <span className="text-muted-foreground">{candidate.skillScore}%</span>
                    </div>
                    <Progress value={candidate.skillScore} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.experience ? (
                  <div className="border-l-2 border-muted pl-4">
                    <p className="text-sm">{candidate.experience}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No experience data available</p>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidate.education ? (
                  <div>
                    <p className="text-sm">{candidate.education}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No education data available</p>
                )}
              </CardContent>
            </Card>

            {/* Top Projects - from analysisData if available */}
            {candidate.portfolio?.analysisData?.topProjects &&
              candidate.portfolio.analysisData.topProjects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {candidate.portfolio.analysisData.topProjects.map(
                      (project: RepoAnalysis, index: number) => (
                        <div key={index} className="border-l-2 border-primary/40 pl-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold hover:text-primary flex items-center gap-1"
                              >
                                {project.repo}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                <Badge variant="outline" className="text-xs">
                                  Quality: {project.qualityScore}/10
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Relevance: {project.relevanceScore}/10
                                </Badge>
                                {project.impressivenessLevel && (
                                  <Badge
                                    variant={
                                      project.impressivenessLevel === 'exceptional' ? 'default' :
                                      project.impressivenessLevel === 'strong' ? 'secondary' :
                                      'outline'
                                    }
                                    className="text-xs"
                                  >
                                    {project.impressivenessLevel.replace('_', ' ')}
                                  </Badge>
                                )}
                                {project.resumeMatchLevel && (
                                  <Badge variant="outline" className="text-xs">
                                    {project.resumeMatchLevel.replace(/_/g, ' ')}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Technologies */}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 5).map((tech, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Insights */}
                          <p className="text-sm text-muted-foreground italic">{project.insights}</p>

                          {/* Strengths */}
                          {project.strengths && project.strengths.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium text-green-600">✓ Strengths:</span>
                              <ul className="list-disc list-inside ml-2 text-muted-foreground">
                                {project.strengths.map((strength, i) => (
                                  <li key={i}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Concerns */}
                          {project.concerns && project.concerns.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium text-amber-600">⚠ Concerns:</span>
                              <ul className="list-disc list-inside ml-2 text-muted-foreground">
                                {project.concerns.map((concern, i) => (
                                  <li key={i}>{concern}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Resume Claims Validated */}
                          {project.resumeClaimsValidated && project.resumeClaimsValidated.length > 0 && (
                            <div className="text-xs bg-green-50 dark:bg-green-950/20 p-2 rounded">
                              <span className="font-medium text-green-700 dark:text-green-400">✓ Validates Resume Claims:</span>
                              <ul className="list-disc list-inside ml-2 text-green-600 dark:text-green-500 mt-1">
                                {project.resumeClaimsValidated.map((claim, i) => (
                                  <li key={i}>{claim}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Resume Claims Contradicted */}
                          {project.resumeClaimsContradicted && project.resumeClaimsContradicted.length > 0 && (
                            <div className="text-xs bg-red-50 dark:bg-red-950/20 p-2 rounded">
                              <span className="font-medium text-red-700 dark:text-red-400">✗ Contradicts Resume Claims:</span>
                              <ul className="list-disc list-inside ml-2 text-red-600 dark:text-red-500 mt-1">
                                {project.resumeClaimsContradicted.map((claim, i) => (
                                  <li key={i}>{claim}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Portfolio Overall Score (if available) */}
                {candidate.portfolio?.overallScore != null && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Portfolio Quality</span>
                      <span className="font-bold">{candidate.portfolio.overallScore}/10</span>
                    </div>
                    <Progress value={(candidate.portfolio.overallScore / 10) * 100} />
                  </div>
                )}

                {/* Resume Alignment Score (if available) */}
                {candidate.portfolio?.resumeAlignment != null && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resume Alignment</span>
                      <span className="font-bold">{candidate.portfolio.resumeAlignment}/10</span>
                    </div>
                    <Progress value={(candidate.portfolio.resumeAlignment / 10) * 100} />
                  </div>
                )}

                {/* Semantic Match Score (from candidate.score) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Job Match</span>
                    <span className="font-bold">{candidate.overallScore}</span>
                  </div>
                  <Progress value={candidate.overallScore} />
                </div>

                {/* Skills Score */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Skills</span>
                    <span className="font-bold">{candidate.skillScore}</span>
                  </div>
                  <Progress value={candidate.skillScore} />
                </div>
              </CardContent>
            </Card>

            {/* Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {showRoadmap ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Analysis In Progress
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-primary" />
                      Analysis
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {showRoadmap && (
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Analyzing portfolio... This may take 1-3 minutes.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      See progress roadmap above
                    </p>
                  </div>
                )}

                {!showRoadmap && candidate.portfolio?.summary && (
                  <div className="pb-3 border-b">
                    <p className="text-sm leading-relaxed">{candidate.portfolio.summary}</p>
                  </div>
                )}

                {!showRoadmap && !candidate.portfolio?.summary && candidate.portfolio?.github && (
                  <div className="p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
                    Portfolio analysis not yet available
                  </div>
                )}

                {!showRoadmap && !candidate.portfolio?.github && (
                  <div className="p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
                    No GitHub portfolio provided
                  </div>
                )}
                {!showRoadmap && (
                  <div>
                    <h3 className="font-medium text-sm mb-1.5">Strengths</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {candidate.portfolio?.strengths && candidate.portfolio.strengths.length > 0 ? (
                        candidate.portfolio.strengths.map((strength, index) => (
                          <li key={index} className="flex gap-2 leading-relaxed">
                            <span className="mt-1.5">·</span>
                            <span>{strength}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">No data available</li>
                      )}
                    </ul>
                  </div>
                )}
                {!showRoadmap && candidate.portfolio?.standoutQualities &&
                  candidate.portfolio.standoutQualities.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm mb-1.5">Highlights</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {candidate.portfolio.standoutQualities.map((quality, index) => (
                          <li key={index} className="flex gap-2 leading-relaxed">
                            <span className="mt-1.5">·</span>
                            <span>{quality}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                {!showRoadmap && candidate.portfolio?.concerns && candidate.portfolio.concerns.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm mb-1.5">Questions</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {candidate.portfolio.concerns.map((concern, index) => (
                        <li key={index} className="flex gap-2 leading-relaxed">
                          <span className="mt-1.5">·</span>
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!showRoadmap && candidate.portfolio?.weaknesses && candidate.portfolio.weaknesses.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm mb-1.5">Gaps</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {candidate.portfolio.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex gap-2 leading-relaxed">
                          <span className="mt-1.5">·</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!showRoadmap && candidate.portfolio?.recommendation && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">Decision</h3>
                      {candidate.portfolio?.technicalLevel && (
                        <span className="text-xs text-muted-foreground">
                          {candidate.portfolio.technicalLevel}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {candidate.portfolio.recommendation.replace(/_/g, " ")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">Schedule Interview</Button>
                {candidate.resumeUrl ? (
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    <FileText className="h-4 w-4 mr-2" />
                    No Resume
                  </Button>
                )}
                <a href={`mailto:${candidate.email}`} className="block">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
