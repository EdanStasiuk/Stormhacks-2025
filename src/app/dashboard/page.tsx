"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, Briefcase, Users, Clock } from "lucide-react";

interface Job {
  id: string;
  title: string;
  candidateCount: number;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs");
        const result = await response.json();
        if (result.success) {
          setJobs(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b backdrop-blur-sm bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Lumina
              </h1>
              <p className="text-sm text-muted-foreground">Recruiter Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/">
                <Button className="gradient-blue glow-blue">
                  <Plus className="h-4 w-4 mr-2" />
                  New Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {jobs.filter((j) => j.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {jobs.reduce((acc, job) => acc + job.candidateCount, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{jobs.length}</div>
              <p className="text-xs text-muted-foreground">jobs this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>View and manage your job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No jobs yet. Create your first job to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block p-4 rounded-lg border hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.candidateCount} candidates
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={job.status === "active" ? "default" : "secondary"}>
                      {job.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
