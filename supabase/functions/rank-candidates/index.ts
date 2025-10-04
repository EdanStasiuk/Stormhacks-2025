import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RankingRequest {
  jobId: string;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { jobId }: RankingRequest = await req.json();

    await supabase.from('processing_logs').insert({
      job_id: jobId,
      process_type: 'ranking',
      status: 'started',
      message: 'Starting candidate ranking',
    });

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('embedding, description')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      throw new Error('Job not found');
    }

    if (!job.embedding) {
      throw new Error('Job embedding not generated');
    }

    const jobEmbedding = typeof job.embedding === 'string' 
      ? JSON.parse(job.embedding) 
      : job.embedding;

    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('id, embedding, status')
      .eq('job_id', jobId)
      .not('embedding', 'is', null);

    if (candidatesError) {
      throw new Error(`Error fetching candidates: ${candidatesError.message}`);
    }

    if (!candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No candidates with embeddings found', ranked: 0 }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    for (const candidate of candidates) {
      const candidateEmbedding = typeof candidate.embedding === 'string'
        ? JSON.parse(candidate.embedding)
        : candidate.embedding;

      const similarityScore = cosineSimilarity(jobEmbedding, candidateEmbedding);

      const { data: portfolioAnalyses } = await supabase
        .from('portfolio_analyses')
        .select('relevance_score, activity_score')
        .eq('candidate_id', candidate.id);

      let portfolioScore = 0;
      if (portfolioAnalyses && portfolioAnalyses.length > 0) {
        const avgRelevance = portfolioAnalyses.reduce((sum, a) => sum + (a.relevance_score || 0), 0) / portfolioAnalyses.length;
        const avgActivity = portfolioAnalyses.reduce((sum, a) => sum + (a.activity_score || 0), 0) / portfolioAnalyses.length;
        portfolioScore = (avgRelevance * 0.7 + avgActivity * 0.3) / 100;
      }

      const overallScore = portfolioScore > 0
        ? (similarityScore * 0.6 + portfolioScore * 0.4)
        : similarityScore;

      await supabase
        .from('candidates')
        .update({
          similarity_score: similarityScore,
          overall_score: overallScore,
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', candidate.id);
    }

    await supabase.from('processing_logs').insert({
      job_id: jobId,
      process_type: 'ranking',
      status: 'completed',
      message: `Ranked ${candidates.length} candidates`,
      metadata: { candidate_count: candidates.length },
    });

    return new Response(
      JSON.stringify({ success: true, ranked: candidates.length }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error ranking candidates:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});