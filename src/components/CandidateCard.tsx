import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Award, Briefcase, GraduationCap } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  portfolio: string | null;
  resumeUrl: string;
  insights: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
}

export default function CandidateCard({ candidate, rank }: CandidateCardProps) {
  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 80) return "secondary";
    return "outline";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
              #{rank}
            </div>
            <div>
              <CardTitle className="text-lg">{candidate.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Mail className="h-3 w-3" />
                {candidate.email}
              </div>
            </div>
          </div>
          <Badge variant={getScoreBadgeVariant(candidate.overallScore)} className="text-lg px-3">
            {candidate.overallScore}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <Award className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Skills</span>
            <span className="font-semibold">{candidate.skillScore}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <Briefcase className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Experience</span>
            <span className="font-semibold">{candidate.experienceScore}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <GraduationCap className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Education</span>
            <span className="font-semibold">{candidate.educationScore}</span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="p-3 bg-muted/50 rounded-md">
          <p className="text-sm text-muted-foreground italic">&quot;{candidate.insights}&quot;</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/candidates/${candidate.id}`} className="flex-1">
            <Button variant="default" className="w-full">
              View Full Profile
            </Button>
          </Link>
          {candidate.portfolio && (
            <a
              href={candidate.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
