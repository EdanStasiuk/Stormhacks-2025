import Link from "next/link";
import UploadForm from "@/components/UploadForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LayoutDashboard, Briefcase, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b backdrop-blur-sm bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Lumina
              </h1>
              <p className="text-sm text-muted-foreground">AI-Powered Resume Screening</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button className="gradient-blue glow-blue">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="gradient-blue-subtle border-primary/30 glow-blue">
            <CardHeader>
              <CardTitle className="text-2xl">Demo Links</CardTitle>
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
