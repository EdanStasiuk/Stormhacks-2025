"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  ExternalLink,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";

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

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CandidateDetailModal({
  candidate,
  open,
  onOpenChange,
}: CandidateDetailModalProps) {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-3 w-3" />
                {candidate.email}
              </DialogDescription>
            </div>
            <Badge variant="default" className="text-lg px-3">
              {candidate.overallScore}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Score Breakdown */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Score Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Skills</span>
                  <span className="font-bold">{candidate.skillScore}</span>
                </div>
                <Progress value={candidate.skillScore} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Experience</span>
                  <span className="font-bold">{candidate.experienceScore}</span>
                </div>
                <Progress value={candidate.experienceScore} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Education</span>
                  <span className="font-bold">{candidate.educationScore}</span>
                </div>
                <Progress value={candidate.educationScore} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall</span>
                  <span className="font-bold">{candidate.overallScore}</span>
                </div>
                <Progress value={candidate.overallScore} />
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Insights */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Insights
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm italic">&quot;{candidate.insights}&quot;</p>
            </div>
          </div>

          <Separator />

          {/* Links */}
          {candidate.portfolio && (
            <div>
              <h3 className="font-semibold mb-3">Links</h3>
              <div className="flex gap-2">
                <a
                  href={candidate.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Portfolio
                </a>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">Schedule Interview</Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              View Resume
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = `/candidates/${candidate.id}`)}
            >
              Full Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
