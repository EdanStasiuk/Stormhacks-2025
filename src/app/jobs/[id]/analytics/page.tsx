"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, TrendingUp, Users, Award, Target } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  portfolio?: {
    overallScore: number | null;
    resumeAlignment: number | null;
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
}

export default function JobAnalytics() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobId = params.id as string;

        const [jobResponse, candidatesResponse] = await Promise.all([
          fetch(`/api/jobs/${jobId}`),
          fetch(`/api/candidates?jobId=${jobId}`),
        ]);

        const jobResult = await jobResponse.json();
        const candidatesResult = await candidatesResponse.json();

        if (jobResult.success) setJob(jobResult.data);
        if (candidatesResult.success) setCandidates(candidatesResult.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Job not found</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const avgOverallScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.overallScore, 0) / candidates.length)
    : 0;
  const avgSkillScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.skillScore, 0) / candidates.length)
    : 0;
  const topCandidates = candidates.filter(c => c.overallScore >= 90);
  const strongCandidates = candidates.filter(c => c.overallScore >= 80 && c.overallScore < 90);

  // Prepare scatter plot data
  const maxScore = 100;
  const plotWidth = 600;
  const plotHeight = 400;
  const padding = 60;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b backdrop-blur-sm bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/jobs/${params.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Candidates
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {job.title} - Analytics
                </h1>
                <p className="text-sm text-muted-foreground">
                  Data-driven insights for {candidates.length} candidates
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Candidates
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{candidates.length}</div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Top Tier (90+)
                </CardTitle>
                <Award className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {topCandidates.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Strong (80-89)
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {strongCandidates.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Match Score
                </CardTitle>
                <Target className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {avgOverallScore}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scatter Plot */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skills vs Experience Analysis</CardTitle>
            <CardDescription>
              Visualize candidate positioning based on skills match and experience level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <svg
                width={plotWidth}
                height={plotHeight}
                className="border rounded-lg bg-muted/5"
                viewBox={`0 0 ${plotWidth} ${plotHeight}`}
              >
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const x = padding + ((plotWidth - 2 * padding) * val) / maxScore;
                  const y = plotHeight - padding - ((plotHeight - 2 * padding) * val) / maxScore;
                  return (
                    <g key={val}>
                      <line
                        x1={x}
                        y1={padding}
                        x2={x}
                        y2={plotHeight - padding}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        strokeDasharray="2,2"
                      />
                      <line
                        x1={padding}
                        y1={y}
                        x2={plotWidth - padding}
                        y2={y}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        strokeDasharray="2,2"
                      />
                    </g>
                  );
                })}

                {/* Axes */}
                <line
                  x1={padding}
                  y1={plotHeight - padding}
                  x2={plotWidth - padding}
                  y2={plotHeight - padding}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                />
                <line
                  x1={padding}
                  y1={padding}
                  x2={padding}
                  y2={plotHeight - padding}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                />

                {/* Axis labels */}
                <text
                  x={plotWidth / 2}
                  y={plotHeight - 10}
                  textAnchor="middle"
                  className="fill-current text-xs"
                  opacity="0.6"
                >
                  Skills Match Score →
                </text>
                <text
                  x={15}
                  y={plotHeight / 2}
                  textAnchor="middle"
                  className="fill-current text-xs"
                  opacity="0.6"
                  transform={`rotate(-90, 15, ${plotHeight / 2})`}
                >
                  ← Experience Score
                </text>

                {/* Quadrant labels */}
                <text
                  x={plotWidth - padding - 80}
                  y={padding + 30}
                  className="fill-green-500 text-xs font-semibold"
                  opacity="0.4"
                >
                  ★ Elite
                </text>
                <text
                  x={padding + 20}
                  y={padding + 30}
                  className="fill-blue-500 text-xs font-semibold"
                  opacity="0.4"
                >
                  High Potential
                </text>
                <text
                  x={plotWidth - padding - 80}
                  y={plotHeight - padding - 20}
                  className="fill-yellow-500 text-xs font-semibold"
                  opacity="0.4"
                >
                  Experienced
                </text>

                {/* Data points */}
                {candidates.map((candidate, idx) => {
                  const x = padding + ((plotWidth - 2 * padding) * candidate.skillScore) / maxScore;
                  const y = plotHeight - padding - ((plotHeight - 2 * padding) * candidate.experienceScore) / maxScore;

                  const getColor = (score: number) => {
                    if (score >= 90) return "rgb(34, 197, 94)"; // green
                    if (score >= 80) return "rgb(59, 130, 246)"; // blue
                    if (score >= 70) return "rgb(234, 179, 8)"; // yellow
                    return "rgb(156, 163, 175)"; // gray
                  };

                  const color = getColor(candidate.overallScore);

                  return (
                    <g key={candidate.id}>
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill={color}
                        fillOpacity="0.7"
                        stroke={color}
                        strokeWidth="2"
                        className="hover:opacity-100 cursor-pointer transition-all"
                        onClick={() => router.push(`/candidates/${candidate.id}`)}
                      >
                        <title>
                          {candidate.name}: Skills {candidate.skillScore}, Experience {candidate.experienceScore}, Overall {candidate.overallScore}
                        </title>
                      </circle>
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="fill-current text-[10px] font-medium pointer-events-none"
                        opacity="0.8"
                      >
                        {candidate.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Legend */}
                <g transform={`translate(${plotWidth - 150}, ${padding})`}>
                  <text className="fill-current text-xs font-semibold" opacity="0.6">
                    Overall Score
                  </text>
                  {[
                    { label: "90+ Elite", color: "rgb(34, 197, 94)" },
                    { label: "80-89 Strong", color: "rgb(59, 130, 246)" },
                    { label: "70-79 Good", color: "rgb(234, 179, 8)" },
                    { label: "<70 Consider", color: "rgb(156, 163, 175)" },
                  ].map((item, idx) => (
                    <g key={item.label} transform={`translate(0, ${20 + idx * 18})`}>
                      <circle cx="6" cy="0" r="5" fill={item.color} opacity="0.7" />
                      <text x="16" y="4" className="fill-current text-[10px]" opacity="0.6">
                        {item.label}
                      </text>
                    </g>
                  ))}
                </g>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>How candidates perform across metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: "Overall Match", avg: avgOverallScore, max: Math.max(...candidates.map(c => c.overallScore), 0) },
                  { label: "Skills Match", avg: avgSkillScore, max: Math.max(...candidates.map(c => c.skillScore), 0) },
                  { label: "Experience", avg: Math.round(candidates.reduce((sum, c) => sum + c.experienceScore, 0) / candidates.length || 0), max: Math.max(...candidates.map(c => c.experienceScore), 0) },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.label}</span>
                      <span className="text-muted-foreground">
                        Avg: {metric.avg} | Top: {metric.max}
                      </span>
                    </div>
                    <div className="h-8 bg-muted rounded-lg overflow-hidden flex">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center text-xs font-semibold text-white transition-all"
                        style={{ width: `${metric.avg}%` }}
                      >
                        {metric.avg}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Highest scoring candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidates
                  .sort((a, b) => b.overallScore - a.overallScore)
                  .slice(0, 5)
                  .map((candidate, idx) => (
                    <div
                      key={candidate.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => router.push(`/candidates/${candidate.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          idx === 0 ? 'bg-yellow-500 text-white' :
                          idx === 1 ? 'bg-gray-400 text-white' :
                          idx === 2 ? 'bg-orange-600 text-white' :
                          'bg-muted-foreground/20'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.email}</p>
                        </div>
                      </div>
                      <Badge variant={candidate.overallScore >= 90 ? "default" : "secondary"}>
                        {candidate.overallScore}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
