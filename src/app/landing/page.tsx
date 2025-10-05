"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sparkles,
  Zap,
  Users,
  FileSearch,
  GitBranch,
  Linkedin,
  Globe,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: FileSearch,
      title: "Smart Resume Parsing",
      description: "Parse thousands of resumes instantly with AI-powered analysis",
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Intelligent Ranking",
      description: "Automatically rank candidates based on job fit and qualifications",
      color: "text-purple-500",
    },
    {
      icon: Sparkles,
      title: "AI Portfolio Analysis",
      description: "Deep dive into LinkedIn, GitHub, and personal websites",
      color: "text-cyan-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process hundreds of candidates in seconds, not hours",
      color: "text-yellow-500",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Resumes Processed" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "10x", label: "Faster Hiring" },
    { value: "500+", label: "Companies Trust Us" },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Upload Resumes",
      description: "Bulk upload candidate resumes (PDF/DOCX) and job description",
      icon: Users,
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Our AI agents parse resumes and analyze portfolios across platforms",
      icon: Sparkles,
    },
    {
      step: 3,
      title: "Get Rankings",
      description: "Receive ranked candidates with detailed insights and recommendations",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Lumina
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/">
                <Button className="gradient-blue glow-blue">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-blue-subtle opacity-30" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Recruitment</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Find the Perfect{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Candidate
              </span>
              <br />
              in Minutes, Not Weeks
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Lumina uses advanced AI to parse, rank, and analyze thousands of resumes against your job description.
              Get deep insights from LinkedIn, GitHub, and portfolios automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/">
                <Button size="lg" className="gradient-blue glow-blue text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary/30 hover:bg-primary/10">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Supercharge Your{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Hiring Process
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to find, analyze, and hire the best candidates
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`transition-all duration-300 border-primary/20 hover:border-primary/40 ${
                  hoveredFeature === index ? "scale-105 glow-blue" : ""
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to better hiring</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full gradient-blue flex items-center justify-center text-white font-bold text-xl mb-4">
                      {item.step}
                    </div>
                    <item.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="text-base">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
                {item.step < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Analysis Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                AI Agents Analyze{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Everything
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Our AI doesn't just read resumes. It dives deep into candidate portfolios across multiple platforms to give you the complete picture.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Linkedin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">LinkedIn Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Extract professional experience, skills, endorsements, and network quality
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GitBranch className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">GitHub Deep Dive</h3>
                    <p className="text-sm text-muted-foreground">
                      Analyze code quality, contributions, project complexity, and tech stack
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Portfolio Review</h3>
                    <p className="text-sm text-muted-foreground">
                      Evaluate personal websites, projects, blog posts, and online presence
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="gradient-blue-subtle border-primary/30 glow-blue">
              <CardHeader>
                <CardTitle className="text-2xl">Complete Candidate Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <span className="text-sm">Technical Skills Match</span>
                  <span className="font-bold text-primary">98%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <span className="text-sm">Experience Alignment</span>
                  <span className="font-bold text-primary">92%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <span className="text-sm">Portfolio Quality</span>
                  <span className="font-bold text-primary">95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <span className="text-sm">Overall Fit Score</span>
                  <span className="font-bold text-primary text-xl">95/100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Why Choose Lumina?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Clock, text: "Save 90% of time on resume screening" },
                { icon: Shield, text: "Reduce hiring bias with objective AI analysis" },
                { icon: CheckCircle2, text: "Make data-driven hiring decisions" },
                { icon: TrendingUp, text: "Improve candidate quality by 3x" },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
                  <benefit.icon className="h-8 w-8 text-primary flex-shrink-0" />
                  <span className="text-lg">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="gradient-blue-subtle border-primary/30 glow-blue max-w-4xl mx-auto">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Transform Your Hiring?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of companies using AI to find the perfect candidates faster
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/">
                  <Button size="lg" className="gradient-blue glow-blue text-lg px-8">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary/30 hover:bg-primary/10">
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">No credit card required • 14-day free trial</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Lumina
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Features</a>
              <a href="#" className="hover:text-primary transition-colors">Pricing</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Lumina. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
