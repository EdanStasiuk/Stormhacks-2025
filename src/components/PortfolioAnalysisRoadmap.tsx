"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  Loader2,
  FileText,
  Brain,
  Database,
  GitBranch,
  Sparkles,
  Award,
} from "lucide-react";

interface ProcessingStage {
  stage:
    | 'idle'
    | 'uploading'
    | 'parsing_resumes'
    | 'creating_candidates'
    | 'generating_embeddings'
    | 'semantic_matching'
    | 'portfolio_analysis'
    | 'complete'
    | 'error';
  message: string;
  progress?: {
    current: number;
    total: number;
  };
  startedAt?: string;
  updatedAt?: string;
  completedAt?: string;
  error?: string;
}

interface PortfolioAnalysisRoadmapProps {
  jobId: string;
  candidateName: string;
  onComplete?: () => void;
}

const stages = [
  {
    key: 'parsing_resumes',
    label: 'Resume Parsing',
    description: 'Extracting text and structured data from PDF',
    icon: FileText,
    color: 'text-blue-500',
  },
  {
    key: 'creating_candidates',
    label: 'Candidate Creation',
    description: 'Creating candidate profiles in database',
    icon: Database,
    color: 'text-purple-500',
  },
  {
    key: 'generating_embeddings',
    label: 'Embedding Generation',
    description: 'Creating vector embeddings for semantic search',
    icon: Brain,
    color: 'text-indigo-500',
  },
  {
    key: 'semantic_matching',
    label: 'Semantic Matching',
    description: 'Matching candidates to job requirements',
    icon: GitBranch,
    color: 'text-cyan-500',
  },
  {
    key: 'portfolio_analysis',
    label: 'Portfolio Analysis',
    description: 'AI-powered GitHub portfolio evaluation',
    icon: Sparkles,
    color: 'text-amber-500',
  },
  {
    key: 'complete',
    label: 'Analysis Complete',
    description: 'All processing finished successfully',
    icon: Award,
    color: 'text-green-500',
  },
];

export default function PortfolioAnalysisRoadmap({
  jobId,
  candidateName,
  onComplete,
}: PortfolioAnalysisRoadmapProps) {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStage | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}/portfolio-status`);
        const data = await response.json();

        if (data.success && data.processing) {
          setProcessingStatus(data.processing);

          // Stop polling when complete or error
          if (data.processing.stage === 'complete' || data.processing.stage === 'error') {
            setIsPolling(false);
            if (data.processing.stage === 'complete' && onComplete) {
              setTimeout(() => onComplete(), 1000); // Small delay before callback
            }
          }
        }
      } catch (error) {
        console.error('Error fetching portfolio status:', error);
      }
    };

    if (isPolling) {
      fetchStatus();
      interval = setInterval(fetchStatus, 2000); // Poll every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, isPolling, onComplete]);

  const getCurrentStageIndex = () => {
    if (!processingStatus) return -1;
    return stages.findIndex((s) => s.key === processingStatus.stage);
  };

  const currentStageIndex = getCurrentStageIndex();

  const getStageStatus = (index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'pending';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Analyzing Portfolio
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {processingStatus?.message || 'Initializing analysis...'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current candidate: {candidateName}
            </p>
          </div>
          {processingStatus?.progress && (
            <Badge variant="secondary" className="text-sm">
              {processingStatus.progress.current} / {processingStatus.progress.total}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress bar */}
        {processingStatus && currentStageIndex >= 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Progress</span>
              <span>
                {Math.round(((currentStageIndex + 1) / stages.length) * 100)}%
              </span>
            </div>
            <Progress
              value={((currentStageIndex + 1) / stages.length) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* Roadmap */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(index);
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="relative">
                {/* Connecting line */}
                {index < stages.length - 1 && (
                  <div
                    className={`absolute left-5 top-12 w-0.5 h-8 transition-colors ${
                      status === 'completed'
                        ? 'bg-primary'
                        : 'bg-muted-foreground/20'
                    }`}
                  />
                )}

                <div
                  className={`flex gap-4 items-start p-4 rounded-lg border-2 transition-all ${
                    status === 'current'
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : status === 'completed'
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-muted bg-muted/30'
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 pt-0.5">
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    ) : status === 'current' ? (
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    ) : (
                      <Circle className="h-10 w-10 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 ${stage.color}`} />
                      <h3
                        className={`font-semibold ${
                          status === 'current'
                            ? 'text-primary'
                            : status === 'completed'
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {stage.label}
                      </h3>
                      {status === 'completed' && (
                        <Badge variant="secondary" className="text-xs">
                          Done
                        </Badge>
                      )}
                      {status === 'current' && (
                        <Badge className="text-xs">In Progress</Badge>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        status === 'pending'
                          ? 'text-muted-foreground/60'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {stage.description}
                    </p>

                    {/* Show detailed message for current stage */}
                    {status === 'current' && processingStatus && (
                      <div className="mt-2 text-xs text-primary/80 font-medium">
                        {processingStatus.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estimated time remaining */}
        {processingStatus && currentStageIndex >= 0 && currentStageIndex < stages.length - 1 && (
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium">⏱️ Estimated time: 30-90 seconds per candidate</p>
            <p className="text-xs mt-1">Analyzing GitHub repos and generating comprehensive insights</p>
          </div>
        )}

        {/* Error state */}
        {processingStatus?.stage === 'error' && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Processing Error
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {processingStatus.error || 'An error occurred during processing'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
