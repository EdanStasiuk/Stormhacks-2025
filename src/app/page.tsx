import Link from "next/link";
import UploadForm from "@/components/UploadForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Briefcase, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Lumina</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Resume Screening</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Demo Links</CardTitle>
              <CardDescription>Explore the different pages and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <LayoutDashboard className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Dashboard</div>
                      <div className="text-xs text-muted-foreground">View all jobs & stats</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/jobs/1">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <Briefcase className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Job Details</div>
                      <div className="text-xs text-muted-foreground">See ranked candidates</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/candidates/1">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Candidate Profile</div>
                      <div className="text-xs text-muted-foreground">Full candidate details</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <UploadForm />
      </main>
    </div>
  );
}
