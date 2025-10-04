import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { JobCreator } from './JobCreator';
import { ResumeUploader } from './ResumeUploader';
import { CandidateList } from './CandidateList';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJobCreator, setShowJobCreator] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);

      if (data && data.length > 0 && !selectedJob) {
        setSelectedJob(data[0]);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    setSelectedJob(newJob);
    setShowJobCreator(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-slate-900">Lumina</h1>
            <nav className="flex gap-6">
              <button className="text-blue-600 font-medium">Jobs</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {jobs.length === 0 && !showJobCreator ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Your First Job</h2>
            <p className="text-slate-600 mb-6">Get started by posting a job and uploading candidate resumes</p>
            <button
              onClick={() => setShowJobCreator(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Create Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Jobs</h2>
                  <button
                    onClick={() => setShowJobCreator(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + New
                  </button>
                </div>
                <div className="space-y-2">
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedJob?.id === job.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-medium truncate">{job.title}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-9">
              {showJobCreator ? (
                <JobCreator
                  onJobCreated={handleJobCreated}
                  onCancel={() => setShowJobCreator(false)}
                />
              ) : selectedJob ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedJob.title}</h2>
                    <p className="text-slate-600 whitespace-pre-line">{selectedJob.description}</p>
                  </div>

                  <ResumeUploader jobId={selectedJob.id} />

                  <CandidateList jobId={selectedJob.id} jobDescription={selectedJob.description} />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
