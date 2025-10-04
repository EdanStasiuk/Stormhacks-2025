import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ParseRequest {
  candidateId: string;
  resumeText: string;
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

    const { candidateId, resumeText }: ParseRequest = await req.json();

    await supabase.from('processing_logs').insert({
      candidate_id: candidateId,
      process_type: 'resume_parse',
      status: 'started',
      message: 'Starting resume parsing',
    });

    await supabase
      .from('candidates')
      .update({ status: 'parsing' })
      .eq('id', candidateId);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `You are a resume parser. Extract structured information from the following resume text.

Resume:
${resumeText}

Provide a JSON response with the following fields:
- name (string): Full name of the candidate
- email (string): Email address
- phone (string or null): Phone number
- skills (array of strings): List of technical and professional skills
- experience_years (number or null): Estimated years of professional experience
- education (string): Highest education level and institution
- linkedin_url (string or null): LinkedIn profile URL if mentioned
- github_url (string or null): GitHub profile URL if mentioned
- portfolio_url (string or null): Personal website or portfolio URL if mentioned

Return ONLY valid JSON, no explanations.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a resume parsing assistant. Always respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0].message.content;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

    await supabase
      .from('candidates')
      .update({
        name: parsedData.name || '',
        email: parsedData.email || '',
        phone: parsedData.phone,
        skills: parsedData.skills || [],
        experience_years: parsedData.experience_years,
        education: parsedData.education,
        linkedin_url: parsedData.linkedin_url,
        github_url: parsedData.github_url,
        portfolio_url: parsedData.portfolio_url,
        resume_text: resumeText,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    await supabase.from('processing_logs').insert({
      candidate_id: candidateId,
      process_type: 'resume_parse',
      status: 'completed',
      message: 'Resume parsed successfully',
      metadata: parsedData,
    });

    return new Response(
      JSON.stringify({ success: true, data: parsedData }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error parsing resume:', error);

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