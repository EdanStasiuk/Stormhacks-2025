/**
 * In-memory processing status tracker
 * Tracks the current stage of resume upload and portfolio analysis
 */

export interface ProcessingStage {
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
  startedAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
  error?: string;
}

// In-memory cache (Note: This resets on server restart)
const processingStatus = new Map<string, ProcessingStage>();

/**
 * Update processing status for a job
 */
export function updateProcessingStatus(
  jobId: string,
  stage: ProcessingStage['stage'],
  message: string,
  progress?: { current: number; total: number }
) {
  const existing = processingStatus.get(jobId);

  const status: ProcessingStage = {
    stage,
    message,
    progress,
    startedAt: existing?.startedAt || new Date(),
    updatedAt: new Date(),
    completedAt: (stage === 'complete' || stage === 'error') ? new Date() : undefined,
  };

  processingStatus.set(jobId, status);
  console.log(`📊 [${jobId}] ${stage}: ${message}${progress ? ` (${progress.current}/${progress.total})` : ''}`);
}

/**
 * Set error status
 */
export function setProcessingError(jobId: string, error: string) {
  const existing = processingStatus.get(jobId);

  processingStatus.set(jobId, {
    stage: 'error',
    message: `Error: ${error}`,
    startedAt: existing?.startedAt || new Date(),
    updatedAt: new Date(),
    completedAt: new Date(),
    error,
  });
}

/**
 * Get processing status for a job
 */
export function getProcessingStatus(jobId: string): ProcessingStage | null {
  return processingStatus.get(jobId) || null;
}

/**
 * Clear processing status for a job
 */
export function clearProcessingStatus(jobId: string) {
  processingStatus.delete(jobId);
}

/**
 * Get all processing statuses (for debugging)
 */
export function getAllProcessingStatuses(): Map<string, ProcessingStage> {
  return processingStatus;
}
