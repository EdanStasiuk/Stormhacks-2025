import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CandidateDetail } from './CandidateDetail';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  skills: string[] | null;
  experience_years: number | null;
  education: string | null;
  resume_text: string;
  similarity_score: number | null;
  overall_score: number | null;
  status: string;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
}

interface CandidateListProps {
  jobId: string;
  jobDescription: string;
}

export function CandidateList({ jobId, jobDescription }: CandidateListProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [sortBy, setSortBy] = useState<'overall_score' | 'similarity_score'>('overall_score');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadCandidates();

    const channel = supabase
      .channel('candidates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'candidates',
          filter: `job_id=eq.${jobId}`,
        },
        () => {
          loadCandidates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  const loadCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('job_id', jobId)
        .order(sortBy, { ascending: false, nullsFirst: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeAllPortfolios = async () => {
    setAnalyzing(true);
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    for (const candidate of candidates) {
      if (candidate.github_url || candidate.linkedin_url || candidate.portfolio_url) {
        try {
          await fetch(`${supabaseUrl}/functions/v1/analyze-portfolio`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({
              candidateId: candidate.id,
              githubUrl: candidate.github_url,
              linkedinUrl: candidate.linkedin_url,
              portfolioUrl: candidate.portfolio_url,
              jobDescription,
            }),
          });
        } catch (error) {
          console.error('Portfolio analysis error:', error);
        }
      }
    }

    await fetch(`${supabaseUrl}/functions/v1/rank-candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ jobId }),
    });

    setAnalyzing(false);
    loadCandidates();
  };

  useEffect(() => {
    loadCandidates();
  }, [sortBy]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Loading candidates...</p>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-slate-600">No candidates yet. Upload resumes to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Candidates ({candidates.length})
            </h3>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="overall_score">Overall Score</option>
                <option value="similarity_score">Resume Match</option>
              </select>
              <button
                onClick={analyzeAllPortfolios}
                disabled={analyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Portfolios'}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Overall Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {candidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-900">
                        {candidate.name || 'Unnamed'}
                      </div>
                      <div className="text-sm text-slate-500">{candidate.email}</div>
                      <div className="flex gap-2 mt-1">
                        {candidate.github_url && (
                          <span className="text-xs text-slate-500">GitHub</span>
                        )}
                        {candidate.linkedin_url && (
                          <span className="text-xs text-slate-500">LinkedIn</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills?.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills && candidate.skills.length > 3 && (
                        <span className="px-2 py-1 text-slate-500 text-xs">
                          +{candidate.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {candidate.experience_years ? `${candidate.experience_years} years` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {candidate.similarity_score !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 w-20">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${candidate.similarity_score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {Math.round(candidate.similarity_score * 100)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {candidate.overall_score !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 w-20">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${candidate.overall_score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {Math.round(candidate.overall_score * 100)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        candidate.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : candidate.status === 'analyzing'
                          ? 'bg-blue-100 text-blue-700'
                          : candidate.status === 'parsing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCandidate && (
        <CandidateDetail
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  );
}
