import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmbeddingRequest {
  candidateId?: string;
  jobId?: string;
  text: string;
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

    const { candidateId, jobId, text }: EmbeddingRequest = await req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const logData: any = {
      process_type: 'embedding',
      status: 'started',
      message: 'Generating embedding',
    };
    
    if (candidateId) logData.candidate_id = candidateId;
    if (jobId) logData.job_id = jobId;
    
    await supabase.from('processing_logs').insert(logData);

    const openaiResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-large',
        input: text,
        encoding_format: 'float',
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const embeddingData = await openaiResponse.json();
    const embedding = embeddingData.data[0].embedding;

    if (candidateId) {
      await supabase
        .from('candidates')
        .update({
          embedding: JSON.stringify(embedding),
          updated_at: new Date().toISOString(),
        })
        .eq('id', candidateId);
    }

    if (jobId) {
      await supabase
        .from('jobs')
        .update({
          embedding: JSON.stringify(embedding),
          updated_at: new Date().toISOString(),
        })
        .eq('id', jobId);
    }

    const successLogData: any = {
      process_type: 'embedding',
      status: 'completed',
      message: 'Embedding generated successfully',
    };
    
    if (candidateId) successLogData.candidate_id = candidateId;
    if (jobId) successLogData.job_id = jobId;
    
    await supabase.from('processing_logs').insert(successLogData);

    return new Response(
      JSON.stringify({ success: true, embedding }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error generating embedding:', error);

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