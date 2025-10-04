import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
}

interface PortfolioAnalysis {
  id: string;
  source_type: string;
  source_url: string;
  analysis_summary: string;
  technical_skills: any;
  projects: any[];
  activity_score: number | null;
  relevance_score: number | null;
}

interface CandidateDetailProps {
  candidate: Candidate;
  onClose: () => void;
}

export function CandidateDetail({ candidate, onClose }: CandidateDetailProps) {
  const [analyses, setAnalyses] = useState<PortfolioAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyses();
  }, [candidate.id]);

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_analyses')
        .select('*')
        .eq('candidate_id', candidate.id);

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">{candidate.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-slate-500">Email:</span>
                    <p className="text-slate-900">{candidate.email}</p>
                  </div>
                  {candidate.phone && (
                    <div>
                      <span className="text-sm text-slate-500">Phone:</span>
                      <p className="text-slate-900">{candidate.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Scores
                </h3>
                <div className="space-y-3">
                  {candidate.similarity_score !== null && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600">Resume Match</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {Math.round(candidate.similarity_score * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${candidate.similarity_score * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {candidate.overall_score !== null && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600">Overall Score</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {Math.round(candidate.overall_score * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${candidate.overall_score * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {candidate.skills && candidate.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(candidate.experience_years || candidate.education) && (
              <div className="grid grid-cols-2 gap-6">
                {candidate.experience_years && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Experience
                    </h3>
                    <p className="text-slate-900">{candidate.experience_years} years</p>
                  </div>
                )}
                {candidate.education && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Education
                    </h3>
                    <p className="text-slate-900">{candidate.education}</p>
                  </div>
                )}
              </div>
            )}

            {(candidate.github_url || candidate.linkedin_url || candidate.portfolio_url) && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Online Presence
                </h3>
                <div className="space-y-2">
                  {candidate.github_url && (
                    <a
                      href={candidate.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub Profile
                    </a>
                  )}
                  {candidate.linkedin_url && (
                    <a
                      href={candidate.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn Profile
                    </a>
                  )}
                  {candidate.portfolio_url && (
                    <a
                      href={candidate.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Portfolio Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {!loading && analyses.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Portfolio Analysis
                </h3>
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900 capitalize">
                          {analysis.source_type}
                        </span>
                        {analysis.relevance_score !== null && (
                          <span className="text-sm text-slate-600">
                            Relevance: {Math.round(analysis.relevance_score)}%
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 text-sm mb-3">{analysis.analysis_summary}</p>

                      {analysis.technical_skills && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                            Technical Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(analysis.technical_skills).map(([skill, level]: any) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-white text-slate-700 text-xs rounded border border-slate-200"
                              >
                                {skill}: {level}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysis.projects && analysis.projects.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                            Notable Projects
                          </p>
                          <ul className="space-y-1">
                            {analysis.projects.map((project: any, idx: number) => (
                              <li key={idx} className="text-sm text-slate-600">
                                {typeof project === 'string' ? project : project.name || project.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {candidate.resume_text && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Resume Content
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                    {candidate.resume_text}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
