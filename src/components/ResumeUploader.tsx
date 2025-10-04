import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface ResumeUploaderProps {
  jobId: string;
}

export function ResumeUploader({ jobId }: ResumeUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage('');
    setProgress(0);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const totalFiles = files.length;
      let processed = 0;

      for (const file of Array.from(files)) {
        const candidate = await createCandidate(file);
        const resumeText = await extractTextFromFile(file);

        await fetch(`${supabaseUrl}/functions/v1/parse-resume`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            candidateId: candidate.id,
            resumeText,
          }),
        });

        await fetch(`${supabaseUrl}/functions/v1/generate-embeddings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            candidateId: candidate.id,
            text: resumeText,
          }),
        });

        processed++;
        setProgress((processed / totalFiles) * 100);
      }

      await fetch(`${supabaseUrl}/functions/v1/rank-candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ jobId }),
      });

      setMessage(`Successfully uploaded and processed ${totalFiles} resume(s)`);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage(`Error: ${error.message || 'Failed to upload resumes'}`);
    } finally {
      setUploading(false);
      setTimeout(() => {
        setProgress(0);
        setMessage('');
      }, 3000);
    }
  };

  const createCandidate = async (file: File) => {
    const { data, error } = await supabase
      .from('candidates')
      .insert({
        job_id: jobId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    const fileName = `${data.id}/${file.name}`;
    await supabase.storage.from('resumes').upload(fileName, file);

    await supabase.from('resume_files').insert({
      candidate_id: data.id,
      job_id: jobId,
      filename: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: fileName,
    });

    return data;
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target?.result as string;

        if (file.type === 'application/pdf') {
          resolve(content);
        } else if (file.type === 'text/plain') {
          resolve(content);
        } else {
          resolve(content);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Resumes</h3>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-slate-700 font-medium mb-1">
              {uploading ? 'Processing...' : 'Click to upload resumes'}
            </p>
            <p className="text-sm text-slate-500">
              PDF, TXT, DOC, or DOCX (multiple files supported)
            </p>
          </label>
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 text-center">
              Processing {Math.round(progress)}%
            </p>
          </div>
        )}

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            message.startsWith('Error')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
