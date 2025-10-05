import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CircuitBoard,
  Clock3,
  Palette,
  Rocket,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const metrics = [
  {
    label: "Resumes scored",
    value: "3.2M+",
    description: "Processed through Lumina pipelines in the last 12 weeks",
  },
  {
    label: "Hiring cycle speed",
    value: "4.6×",
    description: "Average acceleration reported by hackathon partner teams",
  },
  {
    label: "Signal visibility",
    value: "92%",
    description: "Of recruiters say they uncover hidden talent with Lumina",
  },
];

const featurePillars = [
  {
    icon: <Sparkles className="h-6 w-6 text-cyan-300" />,
    title: "AI copilots that feel human",
    description:
      "Instant talent briefs generated from raw resumes, job specs, and portfolio links — with narrative context you can trust.",
  },
  {
    icon: <Workflow className="h-6 w-6 text-purple-300" />,
    title: "Adaptive hiring workflows",
    description:
      "Drag-and-drop flows that recalibrate ranking models in real time as your team collaborates on priorities.",
  },
  {
    icon: <BadgeCheck className="h-6 w-6 text-blue-300" />,
    title: "Bias-aware scoring engine",
    description:
      "Transparent scoring with fairness guardrails, redaction, and reviewer checkpoints baked into every step.",
  },
];

const experienceHighlights = [
  {
    icon: CircuitBoard,
    title: "Realtime signal graph",
    copy: "Visualize skills, experience, and potential across every candidate in one pulsing, living graph.",
  },
  {
    icon: Palette,
    title: "Story-driven briefs",
    copy: "Beautiful candidate cards with AI-written summaries, portfolio callouts, and interview-ready prompts.",
  },
  {
    icon: Clock3,
    title: "Minutes, not months",
    copy: "Upload a stack of resumes, paste your job brief, and watch Lumina draft your shortlist before the demo clock hits zero.",
  },
  {
    icon: BarChart3,
    title: "Insights that ship",
    copy: "Ship analytics dashboards, Slack digests, and hiring snapshots to keep the whole team aligned overnight.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Upload & calibrate",
    detail: "Drop resumes, link your job description, and Lumina auto-redacts PII while learning what success looks like for your team.",
  },
  {
    step: "02",
    title: "Rank with transparency",
    detail: "Our explainable AI surfaces match scores with the exact projects, skills, and outcomes that drove the decision.",
  },
  {
    step: "03",
    title: "Activate the shortlist",
    detail: "Export to your ATS, spin up interview packets, or invite stakeholders into live collaboration mode — all in one click.",
  },
];

const partners = [
  "Vercel x Hack Club",
  "SF Build Fest",
  "AI Builders League",
  "Toronto Dev Summit",
  "MLH Prime",
  "Neo Launchpad",
];

const faqs = [
  {
    question: "Can I customize the scoring model during a hackathon?",
    answer:
      "Absolutely. Drag the sliders for seniority, domain expertise, or culture fit and Lumina recalibrates rankings instantly with full visibility into the changes.",
  },
  {
    question: "Do you support sensitive hiring data?",
    answer:
      "Yes. Every resume is auto-redacted before analysis and we provide audit trails on every AI-generated insight so judges and stakeholders see the entire journey.",
  },
  {
    question: "How fast can we launch a live demo?",
    answer:
      "In under five minutes. Spin up a workspace, invite teammates, and stream your first hiring insights live on stage with our prebuilt showcase scenes.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.35)_0%,_rgba(0,0,0,0)_65%)] blur-[140px]" />
        <div className="absolute right-[-10%] top-[35%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.32)_0%,_rgba(0,0,0,0)_68%)] blur-[130px]" />
        <div className="absolute left-[-12%] bottom-[-15%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.28)_0%,_rgba(0,0,0,0)_70%)] blur-[120px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/15 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200 shadow-[0_0_35px_rgba(34,211,238,0.45)]">
              LT
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Lumina</p>
              <h1 className="text-lg font-semibold text-white">Talent Intelligence</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 lg:flex">
            <a className="transition hover:text-cyan-200" href="#story">
              Story
            </a>
            <a className="transition hover:text-cyan-200" href="#features">
              Features
            </a>
            <a className="transition hover:text-cyan-200" href="#workflow">
              Workflow
            </a>
            <a className="transition hover:text-cyan-200" href="#showcase">
              Showcase
            </a>
            <a className="transition hover:text-cyan-200" href="#faqs">
              FAQs
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-slate-200 transition hover:border-cyan-400/60 hover:text-white"
            >
              Join beta
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_50px_-25px_rgba(34,211,238,0.65)] transition hover:brightness-110">
              Launch demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16">
        <section id="story" className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200">
              Built for hackathon momentum
            </span>
            <h2 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Ship recruiter-ready intelligence in the time it takes to pitch your idea.
            </h2>
            <p className="text-base leading-7 text-slate-300">
              Lumina turns raw resumes, job specs, and team intuition into narrative-rich candidate stories. Our AI copilots
              handle the heavy lifting so your hackathon demo looks like a production launch.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button className="bg-gradient-to-r from-cyan-500 via-emerald-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_-28px_rgba(34,211,238,0.7)] transition hover:brightness-110">
                Get live walkthrough
              </Button>
              <Button
                variant="outline"
                className="border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-white"
              >
                Download starter kit
              </Button>
            </div>

            <dl className="grid gap-6 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <dt className="text-xs uppercase tracking-[0.4em] text-slate-500">{metric.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-white">{metric.value}</dd>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{metric.description}</p>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/5 p-8 shadow-[0_32px_90px_-48px_rgba(34,211,238,0.6)] backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_55%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Live snapshot</p>
                  <h3 className="text-lg font-semibold text-white">Candidate pulse monitor</h3>
                </div>
                <Rocket className="h-6 w-6 text-cyan-300" />
              </div>
              <div className="grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Top signal</p>
                  <h4 className="mt-2 text-lg font-semibold text-white">Aria Chen · Full-Stack Architect</h4>
                  <p className="mt-2 text-sm text-slate-300">
                    AI-native platform lead who shipped LangChain-based hiring copilots across 40k resumes/day.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {featurePillars.map((pillar) => (
                    <div key={pillar.title} className="rounded-2xl border border-white/10 bg-black/60 p-4">
                      <div className="flex items-center gap-3">
                        {pillar.icon}
                        <h4 className="text-sm font-semibold text-white">{pillar.title}</h4>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-300">
              Experience the flow
            </span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Everything your judging panel wants to see in one unified cockpit.
            </h2>
            <p className="text-base leading-7 text-slate-300">
              From data ingestion to stakeholder-ready storytelling, Lumina is your hackathon teammate that makes hiring
              intelligence impossible to ignore.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {experienceHighlights.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_26px_80px_-46px_rgba(34,211,238,0.6)] transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.22)_0%,_rgba(0,0,0,0)_70%)] blur-[110px]" />
                </div>
                <Icon className="relative h-7 w-7 text-cyan-200" />
                <h3 className="relative mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="relative mt-2 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12" id="workflow">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Demo-ready in three acts
            </span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Craft a hiring experience that feels like magic live on stage.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {workflow.map((item) => (
              <div key={item.step} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">{item.step}</span>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="showcase" className="space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Trusted by builders at the world's boldest hackathons.
            </h2>
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-slate-200 transition hover:border-cyan-400/50 hover:text-white"
            >
              Become a launch partner
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
            {partners.map((partner) => (
              <span key={partner} className="uppercase tracking-[0.3em] text-slate-500">
                {partner}
              </span>
            ))}
          </div>
        </section>

        <section id="faqs" className="space-y-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Frequently asked by judges and mentors alike.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-slate-300">
              Lumina is purpose-built for teams that want to demonstrate real traction fast. We handle the compliance and
              visibility questions so you can focus on the story.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Ready to build?</p>
            <h2 className="text-2xl font-semibold text-white">
              Spin up Lumina in your next hackathon and wow the judges.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_-28px_rgba(34,211,238,0.7)] transition hover:brightness-110">
              Book office hours
            </Button>
            <Button
              variant="outline"
              className="border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:text-white"
            >
              Download pitch deck
            </Button>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Lumina Talent Intelligence</span>
            <div className="flex items-center gap-4">
              <Link href="#" className="transition hover:text-cyan-200">
                Privacy
              </Link>
              <Link href="#" className="transition hover:text-cyan-200">
                Terms
              </Link>
              <Link href="#" className="transition hover:text-cyan-200">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
