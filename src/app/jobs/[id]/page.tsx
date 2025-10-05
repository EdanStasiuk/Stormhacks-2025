"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CandidateCard from "@/components/CandidateCard";
import JobResumeUpload from "@/components/JobResumeUpload";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, ArrowUpDown, UserPlus, UserMinus } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  portfolio: string | null;
  resumeUrl: string | null;
  insights: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  candidateCount: number;
  status: string;
  createdAt: string;
}

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"overall" | "skills" | "experience">("overall");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [interviewCandidates, setInterviewCandidates] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    try {
      const jobId = params.id as string;

      // Fetch job details
      const jobResponse = await fetch(`/api/jobs/${jobId}`);
      const jobResult = await jobResponse.json();
      if (jobResult.success) {
        setJob(jobResult.data);
      }

      // Fetch candidates for this job
      const candidatesResponse = await fetch(`/api/candidates?jobId=${jobId}`);
      const candidatesResult = await candidatesResponse.json();
      if (candidatesResult.success) {
        setCandidates(candidatesResult.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const toggleInterviewCandidate = (candidateId: string) => {
    setInterviewCandidates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortBy === "overall") return b.overallScore - a.overallScore;
    if (sortBy === "skills") return b.skillScore - a.skillScore;
    if (sortBy === "experience") return b.experienceScore - a.experienceScore;
    return 0;
  });

  const availableCandidates = sortedCandidates.filter((c) => !interviewCandidates.has(c.id));
  const selectedForInterview = sortedCandidates.filter((c) => interviewCandidates.has(c.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Job not found</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b backdrop-blur-sm bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {job.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {job.candidateCount} candidates screened
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Job Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>{job.description}</CardDescription>
              </div>
              <Badge variant={job.status === "active" ? "default" : "secondary"}>
                {job.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Resume Upload */}
        <div className="mb-6">
          <JobResumeUpload jobId={job.id} onUploadComplete={fetchData} />
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall Score</SelectItem>
                <SelectItem value="skills">Skills Match</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              Cards
            </Button>
          </div>
        </div>

        {/* Interview List */}
        {selectedForInterview.length > 0 && (
          <Card className="mb-6 border-primary/50">
            <CardHeader>
              <CardTitle className="text-primary">Selected for Interview ({selectedForInterview.length})</CardTitle>
              <CardDescription>
                Candidates you've selected to interview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Overall Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedForInterview.map((candidate) => (
                    <TableRow key={candidate.id} className="bg-primary/5">
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {candidate.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            candidate.overallScore >= 90
                              ? "default"
                              : candidate.overallScore >= 80
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {candidate.overallScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/candidates/${candidate.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleInterviewCandidate(candidate.id)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Candidates Display */}
        {candidates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No candidates yet for this job.</p>
            </CardContent>
          </Card>
        ) : viewMode === "table" ? (
          <Card>
            <CardHeader>
              <CardTitle>All Candidates</CardTitle>
              <CardDescription>
                Candidates ranked by AI analysis of resume match to job requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Overall Score</TableHead>
                    <TableHead className="text-center">Skills</TableHead>
                    <TableHead className="text-center">Experience</TableHead>
                    <TableHead>Portfolio</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableCandidates.map((candidate, index) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {candidate.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            candidate.overallScore >= 90
                              ? "default"
                              : candidate.overallScore >= 80
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {candidate.overallScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{candidate.skillScore}</TableCell>
                      <TableCell className="text-center">{candidate.experienceScore}</TableCell>
                      <TableCell>
                        {candidate.portfolio ? (
                          <a
                            href={candidate.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/candidates/${candidate.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => toggleInterviewCandidate(candidate.id)}
                            className="gap-1"
                          >
                            <UserPlus className="h-4 w-4" />
                            Interview
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCandidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} rank={index + 1} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
