import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import UploadForm from "@/components/UploadForm";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Upload Resumes | Lumina Dashboard",
  description: "Drag-and-drop candidate resumes, add job context, and monitor parsing progress.",
};

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Upload Interface
            </div>
            <h1 className="text-2xl font-semibold">Send us the resumes</h1>
            <p className="text-sm text-muted-foreground">
              Add PDF, DOCX, or ZIP resume bundles and include the job context so we can start ranking.
            </p>
          </div>
          <Button asChild variant="ghost" className="justify-start gap-2 md:justify-center">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <UploadForm />
      </main>
    </div>
  );
}
