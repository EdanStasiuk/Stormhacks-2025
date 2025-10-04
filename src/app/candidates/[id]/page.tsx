"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Mail,
  ExternalLink,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";

// Mock data - replace with actual API call
const mockCandidate = {
  id: "1",
  name: "Alice Johnson",
  email: "alice@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  overallScore: 95,
  skillScore: 98,
  experienceScore: 92,
  educationScore: 90,
  portfolio: "https://alice.dev",
  linkedin: "https://linkedin.com/in/alicejohnson",
  github: "https://github.com/alicejohnson",
  resumeUrl: "/resumes/alice.pdf",
  insights: "Strong React and TypeScript experience. 5+ years in frontend development.",
  skills: [
    { name: "React", match: 98 },
    { name: "TypeScript", match: 95 },
    { name: "Next.js", match: 92 },
    { name: "Tailwind CSS", match: 90 },
    { name: "Node.js", match: 85 },
    { name: "GraphQL", match: 80 },
  ],
  experience: [
    {
      title: "Senior Frontend Developer",
      company: "Tech Corp",
      duration: "2021 - Present",
      description:
        "Led frontend development for flagship SaaS product. Improved performance by 40%.",
    },
    {
      title: "Frontend Developer",
      company: "StartupXYZ",
      duration: "2019 - 2021",
      description: "Built responsive web applications using React and Redux.",
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "Stanford University",
      year: "2019",
    },
  ],
  aiAnalysis: {
    strengths: [
      "Extensive React and TypeScript expertise matches job requirements perfectly",
      "Strong track record of performance optimization",
      "Proven leadership experience in frontend architecture",
    ],
    concerns: [
      "Limited experience with testing frameworks mentioned in job description",
      "No mention of accessibility (a11y) best practices",
    ],
    recommendation:
      "Highly recommended for interview. Candidate demonstrates exceptional technical skills and leadership experience that align perfectly with the role requirements.",
  },
};

export default function CandidateDetail() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{mockCandidate.name}</h1>
                <p className="text-sm text-muted-foreground">{mockCandidate.location}</p>
              </div>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              Overall Score: {mockCandidate.overallScore}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${mockCandidate.email}`} className="text-primary hover:underline">
                    {mockCandidate.email}
                  </a>
                </div>
                <div className="flex gap-2">
                  {mockCandidate.portfolio && (
                    <a
                      href={mockCandidate.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Portfolio
                    </a>
                  )}
                  {mockCandidate.linkedin && (
                    <a
                      href={mockCandidate.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                  {mockCandidate.github && (
                    <a
                      href={mockCandidate.github}
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
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills Match
                </CardTitle>
                <CardDescription>How candidate skills align with job requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCandidate.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.match}%</span>
                    </div>
                    <Progress value={skill.match} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCandidate.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4">
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} " {exp.duration}
                    </p>
                    <p className="text-sm mt-2">{exp.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCandidate.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution} " {edu.year}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall</span>
                    <span className="font-bold">{mockCandidate.overallScore}</span>
                  </div>
                  <Progress value={mockCandidate.overallScore} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Skills</span>
                    <span className="font-bold">{mockCandidate.skillScore}</span>
                  </div>
                  <Progress value={mockCandidate.skillScore} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Experience</span>
                    <span className="font-bold">{mockCandidate.experienceScore}</span>
                  </div>
                  <Progress value={mockCandidate.experienceScore} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Education</span>
                    <span className="font-bold">{mockCandidate.educationScore}</span>
                  </div>
                  <Progress value={mockCandidate.educationScore} />
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2 text-green-600">Strengths</h3>
                  <ul className="space-y-1 text-sm">
                    {mockCandidate.aiAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-green-600">"</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2 text-amber-600">Areas to Explore</h3>
                  <ul className="space-y-1 text-sm">
                    {mockCandidate.aiAnalysis.concerns.map((concern, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-amber-600">"</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <h3 className="font-semibold text-sm mb-2">Recommendation</h3>
                  <p className="text-sm text-muted-foreground">
                    {mockCandidate.aiAnalysis.recommendation}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">Schedule Interview</Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
