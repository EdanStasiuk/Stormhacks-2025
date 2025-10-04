import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface AnalysisRequest {
  candidateId: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  jobDescription: string;
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

    const { candidateId, githubUrl, linkedinUrl, portfolioUrl, jobDescription }: AnalysisRequest = await req.json();

    await supabase.from('processing_logs').insert({
      candidate_id: candidateId,
      process_type: 'portfolio_analysis',
      status: 'started',
      message: 'Starting portfolio analysis',
    });

    await supabase
      .from('candidates')
      .update({ status: 'analyzing' })
      .eq('id', candidateId);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const analyses: any[] = [];

    if (githubUrl) {
      try {
        const username = githubUrl.split('github.com/')[1]?.split('/')[0];
        if (username) {
          const userResponse = await fetch(`https://api.github.com/users/${username}`);
          const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
          
          if (userResponse.ok && reposResponse.ok) {
            const userData = await userResponse.json();
            const reposData = await reposResponse.json();

            const reposInfo = reposData.map((repo: any) => ({
              name: repo.name,
              description: repo.description,
              language: repo.language,
              stars: repo.stargazers_count,
              topics: repo.topics,
            }));

            const prompt = `Analyze this GitHub profile for a candidate applying to this job:

Job Description:
${jobDescription}

GitHub Profile:
- Username: ${userData.login}
- Public Repos: ${userData.public_repos}
- Followers: ${userData.followers}
- Bio: ${userData.bio || 'N/A'}

Recent Repositories:
${JSON.stringify(reposInfo, null, 2)}

Provide a JSON response with:
- analysis_summary (string): 2-3 sentence summary of technical capabilities
- technical_skills (object): Key skills and proficiency level (beginner/intermediate/advanced)
- projects (array): Notable projects with brief descriptions
- activity_score (number 0-100): How active and engaged they are
- relevance_score (number 0-100): How relevant their work is to the job

Return ONLY valid JSON.`;

            const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`,
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  { role: 'system', content: 'You are a technical recruiter analyzing candidate portfolios. Always respond with valid JSON only.' },
                  { role: 'user', content: prompt },
                ],
                temperature: 0.5,
              }),
            });

            if (analysisResponse.ok) {
              const analysisData = await analysisResponse.json();
              const content = analysisData.choices[0].message.content;
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              const parsedAnalysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

              await supabase.from('portfolio_analyses').insert({
                candidate_id: candidateId,
                source_type: 'github',
                source_url: githubUrl,
                analysis_summary: parsedAnalysis.analysis_summary,
                technical_skills: parsedAnalysis.technical_skills,
                projects: parsedAnalysis.projects,
                activity_score: parsedAnalysis.activity_score,
                relevance_score: parsedAnalysis.relevance_score,
                raw_data: { user: userData, repos: reposInfo },
              });

              analyses.push({
                type: 'github',
                ...parsedAnalysis,
              });
            }
          }
        }
      } catch (error) {
        console.error('GitHub analysis error:', error);
      }
    }

    if (linkedinUrl) {
      await supabase.from('portfolio_analyses').insert({
        candidate_id: candidateId,
        source_type: 'linkedin',
        source_url: linkedinUrl,
        analysis_summary: 'LinkedIn profile detected. Manual review recommended.',
      });

      analyses.push({
        type: 'linkedin',
        analysis_summary: 'LinkedIn profile available for manual review',
      });
    }

    if (portfolioUrl) {
      await supabase.from('portfolio_analyses').insert({
        candidate_id: candidateId,
        source_type: 'website',
        source_url: portfolioUrl,
        analysis_summary: 'Personal portfolio detected. Manual review recommended.',
      });

      analyses.push({
        type: 'website',
        analysis_summary: 'Personal portfolio available for manual review',
      });
    }

    await supabase.from('processing_logs').insert({
      candidate_id: candidateId,
      process_type: 'portfolio_analysis',
      status: 'completed',
      message: `Analyzed ${analyses.length} portfolio source(s)`,
      metadata: { analyses },
    });

    return new Response(
      JSON.stringify({ success: true, analyses }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error analyzing portfolio:', error);

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