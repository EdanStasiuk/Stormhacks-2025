import Link from "next/link";
import type { CSSProperties } from "react";

export const revalidate = 60;

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

const featurePillars = [
  {
    icon: <Sparkles className="h-6 w-6 text-cyan-300" />,
    title: "Structured candidate briefs",
    description:
      "Instant summaries that highlight role fit, recent wins, and must-know context for recruiters.",
  },
  {
    icon: <Workflow className="h-6 w-6 text-purple-300" />,
    title: "Adaptive assignment flows",
    description:
      "Route resumes to the right reviewer, capture feedback, and keep conversations in one thread.",
  },
  {
    icon: <BadgeCheck className="h-6 w-6 text-blue-300" />,
    title: "Transparent scoring",
    description:
      "Explainable match criteria show the skills, tenure, and achievements that influence every rank.",
  },
];

const experienceHighlights = [
  {
    icon: CircuitBoard,
    title: "Realtime parsing",
    copy: "Every resume is parsed into structured data seconds after it lands in your intake folder.",
  },
  {
    icon: Palette,
    title: "Context-rich profiles",
    copy: "Readable profiles combine raw experience with portfolio links, certifications, and notes.",
  },
  {
    icon: Clock3,
    title: "Faster shortlists",
    copy: "Filter by skills, tenure, or location to hand recruiters a shortlist before the intake meeting ends.",
  },
  {
    icon: BarChart3,
    title: "ATS-friendly exports",
    copy: "Sync structured fields back to your ATS or share snapshots with hiring managers instantly.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Upload & align",
    detail: "Import resumes or connect your sourcing inbox, then tailor the scoring rubric to your open role.",
  },
  {
    step: "02",
    title: "Review & collaborate",
    detail: "Share structured candidate briefs, collect feedback, and surface questions before interviews start.",
  },
  {
    step: "03",
    title: "Move to outreach",
    detail: "Export ranked lists, trigger recruiter follow-ups, and update downstream tools without duplicate work.",
  },
];

const partners = [
  "In-house recruiting teams",
  "Talent acquisition agencies",
  "People operations leads",
  "Executive hiring pods",
  "University recruiting squads",
  "People analytics groups",
];

const marqueePartners = [...partners, ...partners];

const faqs = [
  {
    question: "Can we tune Lumina to our hiring rubric?",
    answer:
      "Yes. Adjust weighting for skills, tenure, education, or custom fields, and Lumina reflects the updates across new resumes immediately.",
  },
  {
    question: "How does Lumina handle sensitive information?",
    answer:
      "We redact personal identifiers before analysis and maintain an audit log for every generated insight so compliance and recruiting operations stay aligned.",
  },
  {
    question: "Does Lumina work with our existing ATS?",
    answer:
      "Export structured data as CSV, JSON, or through our API to populate the systems your recruiters already use.",
  },
];

export default async function Home() {
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

  const metrics = [
    {
      label: "Active roles",
      value: 15,
      description: "Jobs currently tracked inside Lumina for your recruiting team.",
    },
    {
      label: "Candidates enriched",
      value: 200,
      description: "People with structured profiles, notes, and reviewer feedback in one view.",
    },
    {
      label: "Resumes parsed",
      value: 50012,
      description: "Files converted into searchable data and ready to sync with your ATS.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.35)_0%,_rgba(0,0,0,0)_65%)] blur-[140px]" />
        <div className="absolute right-[-10%] top-[35%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.32)_0%,_rgba(0,0,0,0)_68%)] blur-[130px]" />
        <div className="absolute left-[-12%] bottom-[-15%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.28)_0%,_rgba(0,0,0,0)_70%)] blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.18)_0%,_rgba(0,0,0,0)_60%)] opacity-40 animate-spin-slower" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div className="group flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center">
              <span
                aria-hidden
                className="absolute -inset-4 z-[-2] rounded-[1.9rem] bg-cyan-500/25 opacity-0 blur-2xl transition duration-500 ease-out group-hover:opacity-70"
              />
              <span
                className="relative isolate flex h-full w-full items-center justify-center overflow-hidden rounded-[1.25rem] border border-cyan-400/40 bg-black/60 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.45)] transition duration-500 ease-out group-hover:-translate-y-1 group-hover:border-cyan-200/80 group-hover:shadow-[0_0_55px_rgba(168,85,247,0.6)] group-hover:text-white"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 z-[-1] bg-gradient-to-br from-cyan-500/35 via-transparent to-purple-500/30 transition duration-500 ease-out group-hover:opacity-100 group-hover:brightness-110"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 z-[-2] animate-spin-slower bg-[conic-gradient(from_140deg,_transparent_0deg,_rgba(34,211,238,0.4)_140deg,_rgba(168,85,247,0.22)_220deg,_transparent_360deg)] opacity-70 transition duration-[1200ms] group-hover:opacity-90 group-hover:[animation-duration:1.8s]"
                />
                <span
                  aria-hidden
                  className="absolute inset-[2px] z-[-1] rounded-[1.1rem] bg-black/80 backdrop-blur"
                />
                <span className="relative flex items-center justify-center gap-[0.2em] text-[1.4rem] font-semibold uppercase leading-none tracking-[0.08em]">
                  <span className="bg-gradient-to-br from-cyan-200 via-sky-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(56,189,248,0.55)] transition duration-500 ease-out group-hover:drop-shadow-[0_0_22px_rgba(59,130,246,0.8)]">
                    L
                  </span>
                  <span className="bg-gradient-to-br from-purple-300 via-sky-400 to-cyan-100 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.45)] transition duration-500 ease-out group-hover:drop-shadow-[0_0_22px_rgba(168,85,247,0.7)]">
                    T
                  </span>
                </span>
              </span>
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Lumina</p>
              <h1 className="text-lg font-semibold text-white">Talent Intelligence</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 lg:flex">
            <a className="relative transition hover:text-cyan-200 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-cyan-400 after:transition-transform after:duration-300 hover:after:scale-x-100" href="#features">
              Features
            </a>
            <a className="relative transition hover:text-cyan-200 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-cyan-400 after:transition-transform after:duration-300 hover:after:scale-x-100" href="#workflow">
              Workflow
            </a>
            <a className="relative transition hover:text-cyan-200 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-cyan-400 after:transition-transform after:duration-300 hover:after:scale-x-100" href="#showcase">
              Showcase
            </a>
            <a className="relative transition hover:text-cyan-200 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-cyan-400 after:transition-transform after:duration-300 hover:after:scale-x-100" href="#faqs">
              FAQs
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-slate-200 transition duration-500 ease-out hover:-translate-y-1 hover:border-cyan-400/60 hover:text-white"
            >
              Join beta
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_50px_-25px_rgba(34,211,238,0.65)] transition duration-500 ease-out hover:-translate-y-1 hover:brightness-110"
            >
              <Link href="/dashboard">
                Launch demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16">
        <section id="story" className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200 animate-fade-in-up"
              style={{ "--animation-delay": "60ms" } as CSSProperties}
            >
              Built for modern recruiting teams
            </span>
            <h2
              className="text-4xl font-semibold leading-tight text-white md:text-5xl animate-fade-in-up"
              style={{ "--animation-delay": "120ms" } as CSSProperties}
            >
              Deliver recruiter-ready intelligence the moment resumes enter the pipeline.
            </h2>
            <p
              className="text-base leading-7 text-slate-300 animate-fade-in-up"
              style={{ "--animation-delay": "200ms" } as CSSProperties}
            >
              Lumina turns raw resumes, job specs, and team feedback into narrative-rich candidate profiles. Recruiters get
              the context they need without chasing spreadsheets or manual notes.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up" style={{ "--animation-delay": "260ms" } as CSSProperties}>
              <Button className="bg-gradient-to-r from-cyan-500 via-emerald-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_-28px_rgba(34,211,238,0.7)] transition duration-500 ease-out hover:-translate-y-1 hover:brightness-110">
                Request a walkthrough
              </Button>
              <Button
                variant="outline"
                className="border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-slate-200 transition duration-500 ease-out hover:-translate-y-1 hover:border-cyan-400/50 hover:text-white"
              >
                View implementation guide
              </Button>
            </div>

            <dl className="grid gap-6 sm:grid-cols-3">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-fade-in-up"
                  style={{ "--animation-delay": `${320 + index * 120}ms` } as CSSProperties}
                >
                  <dt className="text-xs uppercase tracking-[0.4em] text-slate-500">{metric.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-white">{metric.value}</dd>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{metric.description}</p>
                </div>
              ))}
            </dl>
          </div>

          <div
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/5 p-8 shadow-[0_32px_90px_-48px_rgba(34,211,238,0.6)] backdrop-blur animate-fade-in-up"
            style={{ "--animation-delay": "380ms" } as CSSProperties}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_55%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Live snapshot</p>
                  <h3 className="text-lg font-semibold text-white">Candidate pulse monitor</h3>
                </div>
                <Rocket className="h-6 w-6 text-cyan-300 animate-glow" />
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
                  {featurePillars.map((pillar, index) => (
                    <div
                      key={pillar.title}
                      className="rounded-2xl border border-white/10 bg-black/60 p-4 animate-fade-in-up"
                      style={{ "--animation-delay": `${420 + index * 120}ms` } as CSSProperties}
                    >
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

        <section id="features" className="space-y-10 scroll-mt-24">
          <div className="max-w-3xl space-y-4">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-300 animate-fade-in-up"
              style={{ "--animation-delay": "40ms" } as CSSProperties}
            >
              Designed for recruiters
            </span>
            <h2
              className="text-3xl font-semibold text-white md:text-4xl animate-fade-in-up"
              style={{ "--animation-delay": "120ms" } as CSSProperties}
            >
              Everything your recruiting desk needs inside one workspace.
            </h2>
            <p
              className="text-base leading-7 text-slate-300 animate-fade-in-up"
              style={{ "--animation-delay": "200ms" } as CSSProperties}
            >
              From intake to outreach, Lumina keeps sourcing teams, hiring managers, and stakeholders aligned with
              structured candidate insights.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {experienceHighlights.map(({ icon: Icon, title, copy }, index) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_26px_80px_-46px_rgba(34,211,238,0.6)] transition duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_36px_90px_-42px_rgba(34,211,238,0.7)] hover:border-cyan-400/40 animate-fade-in-up"
                style={{ "--animation-delay": `${index * 120}ms` } as CSSProperties}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.22)_0%,_rgba(0,0,0,0)_70%)] blur-[110px]" />
                </div>
                <Icon className="relative h-7 w-7 text-cyan-200 animate-glow" />
                <h3 className="relative mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="relative mt-2 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12 scroll-mt-24" id="workflow">
          <div className="flex flex-col gap-4">
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200 animate-fade-in-up"
              style={{ "--animation-delay": "40ms" } as CSSProperties}
            >
              From intake to decision
            </span>
            <h2
              className="text-3xl font-semibold text-white md:text-4xl animate-fade-in-up"
              style={{ "--animation-delay": "120ms" } as CSSProperties}
            >
              Keep every resume moving with a transparent, repeatable process.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {workflow.map((item, index) => (
              <div
                key={item.step}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 animate-fade-in-up"
                style={{ "--animation-delay": `${index * 140}ms` } as CSSProperties}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">{item.step}</span>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="showcase" className="space-y-10 scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2
              className="text-3xl font-semibold text-white md:text-4xl animate-fade-in-up"
              style={{ "--animation-delay": "60ms" } as CSSProperties}
            >
              Chosen by teams who live and breathe recruiting.
            </h2>
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-slate-200 transition duration-500 ease-out hover:-translate-y-1 hover:border-cyan-400/50 hover:text-white animate-fade-in-up"
              style={{ "--animation-delay": "140ms" } as CSSProperties}
            >
              Become a launch partner
            </Button>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/60 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/60 to-transparent" />
            <div className="flex min-w-max gap-10 animate-marquee text-sm text-slate-400">
              {marqueePartners.map((partner, index) => (
                <span key={`${partner}-${index}`} className="uppercase tracking-[0.3em] text-slate-500">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="faqs" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col gap-4">
            <h2
              className="text-3xl font-semibold text-white md:text-4xl animate-fade-in-up"
              style={{ "--animation-delay": "40ms" } as CSSProperties}
            >
              Frequently asked by recruiters and hiring partners.
            </h2>
            <p
              className="max-w-3xl text-base leading-7 text-slate-300 animate-fade-in-up"
              style={{ "--animation-delay": "120ms" } as CSSProperties}
            >
              Lumina is purpose-built for teams that juggle high-volume pipelines and nuanced roles. We handle compliance,
              data hygiene, and reviewer visibility so you can focus on the candidate experience.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 animate-fade-in-up"
                style={{ "--animation-delay": `${index * 150}ms` } as CSSProperties}
              >
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
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Ready to streamline?</p>
            <h2 className="text-2xl font-semibold text-white">
              Bring Lumina into your recruiting stack and keep every candidate conversation grounded in data.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_-28px_rgba(34,211,238,0.7)] transition duration-500 ease-out hover:-translate-y-1 hover:brightness-110">
              Book office hours
            </Button>
            <Button
              variant="outline"
              className="border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-slate-200 transition duration-500 ease-out hover:-translate-y-1 hover:border-cyan-400/60 hover:text-white"
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
