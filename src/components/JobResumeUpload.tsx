"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileText, Archive } from "lucide-react";

interface UploadedFile {
  file: File;
  id: string;
}

interface JobResumeUploadProps {
  jobId: string;
  onUploadComplete?: () => void;
}

export default function JobResumeUpload({ jobId, onUploadComplete }: JobResumeUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const fileIdCounter = useRef(0);
  const [stage, setStage] = useState<"idle" | "uploading" | "parsing" | "complete">("idle");
  const [parsingProgress, setParsingProgress] = useState(0);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
    ];
    const allowedExtensions = ["pdf", "zip"];
    const maxSize = 50 * 1024 * 1024; // 50MB for zip files

    if (!validTypes.includes(file.type)) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        setErrors((prev) => [...prev, `${file.name}: Only PDF or ZIP files are allowed`]);
        return false;
      }
    }

    if (file.size > maxSize) {
      setErrors((prev) => [...prev, `${file.name}: File size must be less than 50MB`]);
      return false;
    }

    return true;
  };

  const handleFiles = (fileList: FileList) => {
    setErrors([]);
    const validFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file) => {
      if (validateFile(file)) {
        fileIdCounter.current += 1;
        validFiles.push({
          file,
          id: `${file.name}-${fileIdCounter.current}`,
        });
      }
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors([]);

    if (files.length === 0) {
      setErrors(["Please upload at least one resume or zip file"]);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setParsingProgress(0);
    setStage("uploading");

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("resumes", f.file));
      formData.append("jobId", jobId);

      setUploadProgress(30);

      // Upload files
      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(60);
      setStage("parsing");
      setParsingProgress(50);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      setParsingProgress(100);

      if (result.success) {
        setStage("complete");
        setFiles([]);

        // Show success message if there were any errors
        if (result.errors && result.errors.length > 0) {
          setErrors([
            `Processed ${result.processedCount} candidates successfully.`,
            ...result.errors.map((e: string) => `⚠️ ${e}`)
          ]);
        }

        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        setErrors([result.error || "Upload failed"]);
      }
    } catch (error: any) {
      setErrors([error.message || "Upload failed. Please try again."]);
    } finally {
      setIsUploading(false);
      setTimeout(() => setStage("idle"), 1000);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "zip") {
      return <Archive className="h-4 w-4 text-muted-foreground" />;
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resumes</CardTitle>
        <CardDescription>
          Upload individual PDF resumes or a ZIP file containing multiple PDF resumes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf,.zip"
                onChange={handleFileInput}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium text-primary">Click to upload</span> or drag and
                  drop
                </div>
                <p className="text-xs text-muted-foreground">
                  PDF files or ZIP archive (max 50MB)
                </p>
              </label>
            </div>
          </div>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Uploaded Files ({files.length})</div>
              <div className="space-y-2">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      {getFileIcon(f.file.name)}
                      <span className="text-sm">{f.file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(f.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(f.id)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <ul className="text-sm text-destructive space-y-1">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading files</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
              {stage !== "idle" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {stage === "parsing" || stage === "complete"
                        ? "Parsing resumes"
                        : "Processing"}
                    </span>
                    <span>{stage === "idle" ? "0%" : `${parsingProgress}%`}</span>
                  </div>
                  <Progress value={stage === "idle" ? 0 : parsingProgress} />
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full gradient-blue glow-blue"
            disabled={isUploading || files.length === 0}
          >
            {isUploading
              ? stage === "complete"
                ? "Complete!"
                : "Uploading..."
              : "Upload & Process Resumes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
