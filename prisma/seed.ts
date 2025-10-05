import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.transcript.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.job.deleteMany();

  // Create Jobs
  console.log('📋 Creating jobs...');
  const frontendJob = await prisma.job.create({
    data: {
      title: 'Senior Frontend Developer',
      description: 'We are looking for an experienced frontend developer with strong React and TypeScript skills. The ideal candidate will have 5+ years of experience building modern web applications with focus on performance, accessibility, and user experience.',
    },
  });

  const backendJob = await prisma.job.create({
    data: {
      title: 'Backend Engineer',
      description: 'Seeking a talented backend engineer to build scalable APIs and microservices. Experience with Node.js, PostgreSQL, Docker, Kubernetes, and cloud platforms (AWS/GCP) required. Must have strong system design skills.',
    },
  });

  const fullStackJob = await prisma.job.create({
    data: {
      title: 'Full Stack Developer',
      description: 'Join our team as a full stack developer. You will work on both frontend (React/Next.js) and backend (Node.js/Python) technologies to deliver end-to-end features. Experience with databases, APIs, and cloud deployment essential.',
    },
  });

  // Create Candidates for Frontend Job
  console.log('👥 Creating candidates...');
  const alice = await prisma.candidate.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      jobId: frontendJob.id,
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest', 'Storybook'],
      experience: '6 years of frontend development experience. Led frontend architecture at TechCorp (2021-present), previously Senior Developer at StartupXYZ (2018-2021). Specialized in building high-performance React applications and design systems.',
      education: 'B.S. Computer Science, Stanford University, 2017. Graduated with Honors.',
      score: 92, // 92% match
    },
  });

  const bob = await prisma.candidate.create({
    data: {
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      jobId: frontendJob.id,
      skills: ['Vue.js', 'JavaScript', 'CSS', 'Webpack', 'REST APIs', 'Vuex'],
      experience: '4 years at various startups. Strong focus on performance optimization and bundle size reduction. Built multiple SPAs from scratch.',
      education: 'B.A. Computer Science, UC Berkeley, 2019',
      score: 73, // 73% match - Vue vs React
    },
  });

  const carol = await prisma.candidate.create({
    data: {
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      jobId: frontendJob.id,
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Figma', 'UI/UX Design', 'Framer Motion'],
      experience: '3 years combining development and design work. Previously UI Engineer at DesignCo, built complete design-to-code workflows.',
      education: 'B.S. Design and Computer Science (Double Major), MIT, 2020',
      score: 81, // 81% match
    },
  });

  // Create Candidates for Backend Job
  const david = await prisma.candidate.create({
    data: {
      name: 'David Chen',
      email: 'david.chen@email.com',
      jobId: backendJob.id,
      skills: ['Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Redis', 'RabbitMQ', 'Microservices'],
      experience: '7 years building scalable backend systems at Fortune 500 companies. Led migration to microservices architecture serving 10M+ users. Expert in distributed systems and event-driven architecture.',
      education: 'M.S. Computer Science, Carnegie Mellon University, 2016. Thesis on Distributed Systems.',
      score: 95, // 95% match
    },
  });

  const emma = await prisma.candidate.create({
    data: {
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      jobId: backendJob.id,
      skills: ['Python', 'Django', 'Redis', 'MongoDB', 'GCP', 'Apache Kafka', 'Airflow'],
      experience: '5 years backend development with focus on data pipelines and ETL processes. Built real-time data processing systems handling 1TB+ daily.',
      education: 'B.S. Software Engineering, Georgia Tech, 2018',
      score: 68, // 68% match - Python vs Node.js
    },
  });

  const grace = await prisma.candidate.create({
    data: {
      name: 'Grace Kim',
      email: 'grace.kim@email.com',
      jobId: backendJob.id,
      skills: ['Go', 'PostgreSQL', 'gRPC', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
      experience: '6 years specializing in high-performance backend systems. Built low-latency trading systems and real-time analytics platforms.',
      education: 'B.S. Computer Engineering, University of Illinois, 2017',
      score: 78, // 78% match - Go vs Node.js but strong DevOps
    },
  });

  // Create Candidates for Full Stack Job
  const frank = await prisma.candidate.create({
    data: {
      name: 'Frank Martinez',
      email: 'frank.martinez@email.com',
      jobId: fullStackJob.id,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Next.js', 'tRPC'],
      experience: '5 years full stack development at SaaS companies. Built 3 products from MVP to scale. Strong T-shaped skills with deep expertise in TypeScript ecosystem.',
      education: 'B.S. Computer Science, UCLA, 2018',
      score: 89, // 89% match
    },
  });

  const hannah = await prisma.candidate.create({
    data: {
      name: 'Hannah Patel',
      email: 'hannah.patel@email.com',
      jobId: fullStackJob.id,
      skills: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'AWS', 'Docker'],
      experience: '4 years full stack with Python backend. Previously at fintech startup, built payment processing systems and admin dashboards.',
      education: 'B.S. Software Engineering, University of Waterloo, 2019',
      score: 82, // 82% match
    },
  });

  // Create Portfolios with Deep AI Analysis
  console.log('💼 Creating portfolios with deep analysis...');

  // Alice - Strong Hire with Exceptional Portfolio
  const aliceAnalysisData = {
    candidateId: alice.id,
    overallScore: 9.2,
    summary: 'Exceptional frontend engineer with deep expertise in modern React ecosystem and performance optimization. Portfolio demonstrates senior-level architectural decisions, clean code practices, and strong TypeScript skills. Active open source contributor with proven leadership experience.',
    topProjects: [
      {
        repo: 'react-design-system',
        url: 'https://github.com/alicejohnson/react-design-system',
        qualityScore: 10,
        relevanceScore: 9,
        impressivenessLevel: 'exceptional',
        resumeMatchLevel: 'perfect_match',
        technologies: ['React', 'TypeScript', 'Storybook', 'Styled Components', 'Jest', 'Rollup'],
        strengths: [
          'Production-ready component library with 100+ components',
          'Comprehensive Storybook documentation',
          'Full TypeScript coverage with strict mode',
          '95% test coverage with visual regression tests',
          'Published as npm package with 50k+ weekly downloads',
          'Well-architected theming system',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims 6 years React experience - validated by advanced patterns and hooks expertise',
          'Claims TypeScript expert - validated by strict typing and complex generics usage',
          'Claims design system experience - entire repo validates this claim',
          'Claims leadership - evidenced by comprehensive documentation and team-oriented design',
        ],
        resumeClaimsContradicted: [],
        insights: 'This is a standout project showing exceptional engineering maturity. The architecture supports theming, i18n, and accessibility out of the box. Code quality is production-grade with excellent documentation. Clear evidence of senior-level decision making.',
      },
      {
        repo: 'next-performance-monitor',
        url: 'https://github.com/alicejohnson/next-performance-monitor',
        qualityScore: 9,
        relevanceScore: 9,
        impressivenessLevel: 'exceptional',
        resumeMatchLevel: 'strong_match',
        technologies: ['Next.js', 'TypeScript', 'Web Vitals', 'Lighthouse', 'React'],
        strengths: [
          'Real-time performance monitoring for Next.js apps',
          'Automatic Core Web Vitals tracking',
          'Beautiful analytics dashboard with charts',
          'Lighthouse CI integration',
          'Used by 200+ production applications',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims Next.js expertise - demonstrated through deep framework knowledge',
          'Claims performance optimization focus - this project is entirely about performance',
        ],
        resumeClaimsContradicted: [],
        insights: 'Shows deep understanding of web performance metrics and Next.js internals. The real-time monitoring approach is innovative and well-executed. Strong product thinking evident.',
      },
      {
        repo: 'graphql-code-generator-templates',
        url: 'https://github.com/alicejohnson/graphql-templates',
        qualityScore: 8,
        relevanceScore: 8,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'strong_match',
        technologies: ['GraphQL', 'TypeScript', 'Code Generation', 'React Query'],
        strengths: [
          'Custom templates for GraphQL code generation',
          'Type-safe API layer generation',
          'React Query integration',
          'Reduces boilerplate by 80%',
        ],
        concerns: ['Could use more comprehensive tests'],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims GraphQL experience - deep understanding of schema and codegen',
        ],
        resumeClaimsContradicted: [],
        insights: 'Practical tooling project that solves real developer pain points. Shows ability to create developer tools and automation.',
      },
    ],
    strengths: [
      'Exceptional React and TypeScript expertise with production-grade code',
      'Strong focus on performance, accessibility, and user experience',
      'Proven ability to build scalable design systems and component libraries',
      'Active open source contributor with high-quality projects',
      'Excellent documentation and communication skills',
      'Leadership experience evident through project scope and team-oriented design',
    ],
    weaknesses: [
      'Could strengthen E2E testing practices (mostly unit/integration tests)',
      'Limited backend/full-stack projects in portfolio',
    ],
    concerns: [],
    resumeAlignment: 9.5,
    recommendation: 'strong_hire',
    technicalLevel: 'Senior/Lead Level',
    standoutQualities: [
      'Design system used by 50k+ developers weekly',
      'Performance monitoring tool adopted by 200+ companies',
      'Speaker at React Conf 2023',
      'Mentored 10+ junior developers',
      'Contributed to React core team discussions',
    ],
  };

  const alicePortfolio = await prisma.portfolio.create({
    data: {
      candidateId: alice.id,
      github: 'https://github.com/alicejohnson',
      linkedin: 'https://linkedin.com/in/alicejohnson',
      website: 'https://alice.dev',
      analysisData: aliceAnalysisData,
      overallScore: 9.2,
      resumeAlignment: 9.5,
      recommendation: 'strong_hire',
      technicalLevel: 'Senior/Lead Level',
      summary: aliceAnalysisData.summary,
      strengths: aliceAnalysisData.strengths,
      weaknesses: aliceAnalysisData.weaknesses,
      concerns: aliceAnalysisData.concerns,
      standoutQualities: aliceAnalysisData.standoutQualities,
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: alice.id },
    data: { portfolioId: alicePortfolio.id },
  });

  // Bob - Interview (Different tech stack but strong fundamentals)
  const bobAnalysisData = {
    candidateId: bob.id,
    overallScore: 7.8,
    summary: 'Solid frontend developer with strong Vue.js expertise and excellent performance optimization skills. Portfolio shows good engineering practices and problem-solving abilities. Would require onboarding time to transition from Vue to React, but fundamentals are strong.',
    topProjects: [
      {
        repo: 'vue-performance-toolkit',
        url: 'https://github.com/bobsmith/vue-perf-toolkit',
        qualityScore: 8,
        relevanceScore: 7,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'partial_match',
        technologies: ['Vue.js', 'JavaScript', 'Webpack', 'Bundle Analyzer', 'Vite'],
        strengths: [
          'Comprehensive performance optimization toolkit',
          'Reduced bundle sizes by average 40%',
          'Smart code splitting utilities',
          'Good documentation with examples',
          'Used by 100+ Vue applications',
        ],
        concerns: [
          'Vue-specific, not directly applicable to React role',
          'Could benefit from TypeScript',
        ],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims Vue.js expertise - clearly demonstrated',
          'Claims performance optimization focus - validated by project focus and results',
          'Claims 40% load time improvement - toolkit enables this',
        ],
        resumeClaimsContradicted: [],
        insights: 'Strong performance engineering skills that would transfer to React. The optimization techniques are framework-agnostic. Shows deep understanding of webpack and bundling.',
      },
      {
        repo: 'vue-component-library',
        url: 'https://github.com/bobsmith/vue-components',
        qualityScore: 7,
        relevanceScore: 6,
        impressivenessLevel: 'good',
        resumeMatchLevel: 'partial_match',
        technologies: ['Vue.js', 'JavaScript', 'CSS', 'Storybook'],
        strengths: [
          'Reusable component library',
          'Good Storybook integration',
          'Responsive design implementation',
        ],
        concerns: [
          'Limited TypeScript usage',
          'Test coverage could be better',
          'Vue 2 vs Vue 3 - using older version',
        ],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims component library experience',
        ],
        resumeClaimsContradicted: [],
        insights: 'Decent component library but shows less maturity compared to modern React ecosystem standards. Would need to learn React patterns.',
      },
      {
        repo: 'webpack-bundle-optimizer',
        url: 'https://github.com/bobsmith/bundle-optimizer',
        qualityScore: 8,
        relevanceScore: 8,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'strong_match',
        technologies: ['Webpack', 'JavaScript', 'Node.js'],
        strengths: [
          'Automated bundle optimization',
          'Works with any framework',
          'Clear performance metrics',
          'CLI tool with good UX',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims webpack expertise - clearly demonstrated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Framework-agnostic tool showing strong webpack knowledge. This would be valuable even in a React role.',
      },
    ],
    strengths: [
      'Strong performance optimization skills and mindset',
      'Good understanding of build tools and bundling',
      'Solid JavaScript fundamentals',
      'Proven ability to reduce load times and improve metrics',
      'Good documentation practices',
    ],
    weaknesses: [
      'Limited React/TypeScript experience (mainly Vue/JavaScript)',
      'Would require onboarding time to learn React ecosystem',
      'Test coverage practices could be stronger',
      'Using older Vue 2 in some projects vs modern Vue 3',
    ],
    concerns: [
      'Transition from Vue to React may require 1-2 months ramp-up time',
      'Limited TypeScript exposure may slow initial velocity',
    ],
    resumeAlignment: 7.2,
    recommendation: 'interview',
    technicalLevel: 'Mid-Senior Level',
    standoutQualities: [
      'Performance toolkit used by 100+ applications',
      'Proven track record of 40% load time improvements',
      'Strong webpack and build optimization expertise',
    ],
  };

  const bobPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: bob.id,
      github: 'https://github.com/bobsmith',
      linkedin: 'https://linkedin.com/in/bobsmith',
      analysisData: bobAnalysisData,
      overallScore: 7.8,
      resumeAlignment: 7.2,
      recommendation: 'interview',
      technicalLevel: 'Mid-Senior Level',
      summary: bobAnalysisData.summary,
      strengths: bobAnalysisData.strengths,
      weaknesses: bobAnalysisData.weaknesses,
      concerns: bobAnalysisData.concerns,
      standoutQualities: bobAnalysisData.standoutQualities,
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: bob.id },
    data: { portfolioId: bobPortfolio.id },
  });

  // Carol - Maybe (Design-focused but less technical depth)
  const carolAnalysisData = {
    candidateId: carol.id,
    overallScore: 6.8,
    summary: 'Frontend developer with strong design background and good React fundamentals. Portfolio shows unique design-to-code skills but less depth in complex state management and scalability. Best suited for design-heavy projects or smaller teams.',
    topProjects: [
      {
        repo: 'design-system-builder',
        url: 'https://github.com/caroldavis/design-system-builder',
        qualityScore: 7,
        relevanceScore: 8,
        impressivenessLevel: 'good',
        resumeMatchLevel: 'strong_match',
        technologies: ['React', 'JavaScript', 'Figma API', 'Styled Components'],
        strengths: [
          'Unique Figma-to-code conversion tool',
          'Generates React components from designs',
          'Good UI/UX sensibility',
          'Reduces design handoff time',
        ],
        concerns: [
          'Limited TypeScript usage',
          'Components lack complex state management',
          'No tests found',
          'Code could be more modular',
        ],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims design-to-code workflow experience - validated by this project',
          'Claims Figma expertise - clearly demonstrated',
          'Claims React fundamentals - basic usage shown',
        ],
        resumeClaimsContradicted: [],
        insights: 'Innovative idea bridging design and development, but implementation shows junior-to-mid level engineering practices. Would benefit from stronger technical fundamentals.',
      },
      {
        repo: 'animation-library',
        url: 'https://github.com/caroldavis/react-animations',
        qualityScore: 6,
        relevanceScore: 7,
        impressivenessLevel: 'good',
        resumeMatchLevel: 'partial_match',
        technologies: ['React', 'Framer Motion', 'JavaScript', 'CSS'],
        strengths: [
          'Nice collection of reusable animations',
          'Good visual design',
          'Easy to integrate',
        ],
        concerns: [
          'Limited customization options',
          'Performance not optimized for complex animations',
          'No accessibility considerations',
          'Bundle size is large',
        ],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims Framer Motion experience - demonstrated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Focus on aesthetics over engineering. Animations look good but code lacks optimization and accessibility practices.',
      },
    ],
    strengths: [
      'Unique combination of design and development skills',
      'Strong UI/UX sensibility and visual design',
      'Good React fundamentals and component patterns',
      'Ability to bridge designer-developer communication',
      'Creative problem-solving approach',
    ],
    weaknesses: [
      'Limited experience with complex state management (Redux, Zustand, etc.)',
      'Lacks TypeScript adoption and type safety practices',
      'Testing practices are weak or absent',
      'Less experience with performance optimization',
      'Limited backend/full-stack exposure',
      'Accessibility practices need improvement',
    ],
    concerns: [
      'May struggle with complex technical challenges requiring deep architectural knowledge',
      'Code quality and engineering practices are below senior level',
      'Would need significant mentoring for production-scale applications',
    ],
    resumeAlignment: 6.5,
    recommendation: 'maybe',
    technicalLevel: 'Mid Level',
    standoutQualities: [
      'Built complete design system from Figma designs',
      'Strong design-to-code workflow expertise',
      'Good for design-heavy projects',
    ],
  };

  const carolPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: carol.id,
      linkedin: 'https://linkedin.com/in/caroldavis',
      website: 'https://caroldesigns.com',
      github: 'https://github.com/caroldavis',
      analysisData: carolAnalysisData,
      overallScore: 6.8,
      resumeAlignment: 6.5,
      recommendation: 'maybe',
      technicalLevel: 'Mid Level',
      summary: carolAnalysisData.summary,
      strengths: carolAnalysisData.strengths,
      weaknesses: carolAnalysisData.weaknesses,
      concerns: carolAnalysisData.concerns,
      standoutQualities: carolAnalysisData.standoutQualities,
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: carol.id },
    data: { portfolioId: carolPortfolio.id },
  });

  // David - Strong Hire (Backend Expert)
  const davidAnalysisData = {
    candidateId: david.id,
    overallScore: 9.5,
    summary: 'Exceptional backend engineer with world-class expertise in distributed systems, microservices architecture, and cloud infrastructure. Portfolio demonstrates senior/staff level engineering with proven ability to design and scale systems serving millions of users. Strong system design and leadership skills.',
    topProjects: [
      {
        repo: 'microservices-framework',
        url: 'https://github.com/davidchen/microservices-framework',
        qualityScore: 10,
        relevanceScore: 10,
        impressivenessLevel: 'exceptional',
        resumeMatchLevel: 'perfect_match',
        technologies: ['Node.js', 'TypeScript', 'Kubernetes', 'gRPC', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Prometheus'],
        strengths: [
          'Production-ready microservices framework',
          'Handles service discovery, load balancing, circuit breaking',
          'Built-in observability with Prometheus/Grafana',
          'Supports multiple protocols (REST, gRPC, GraphQL)',
          'Comprehensive K8s deployment configs',
          'Battle-tested in production serving 10M+ users',
          'Excellent documentation and examples',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims 7 years backend experience - validated by framework maturity',
          'Claims microservices expertise - entire project validates this',
          'Claims 10M+ users experience - framework handles this scale',
          'Claims Kubernetes expert - demonstrated through complex configs',
          'Claims AWS/cloud expertise - infrastructure code validates this',
        ],
        resumeClaimsContradicted: [],
        insights: 'This is staff/principal level work. The framework demonstrates deep understanding of distributed systems, resilience patterns, and production operations. Code quality is exceptional with comprehensive testing and monitoring.',
      },
      {
        repo: 'event-driven-architecture',
        url: 'https://github.com/davidchen/event-driven-system',
        qualityScore: 9,
        relevanceScore: 9,
        impressivenessLevel: 'exceptional',
        resumeMatchLevel: 'perfect_match',
        technologies: ['Node.js', 'RabbitMQ', 'Kafka', 'PostgreSQL', 'Redis', 'TypeScript'],
        strengths: [
          'Sophisticated event-driven architecture implementation',
          'Supports SAGA pattern for distributed transactions',
          'Event sourcing and CQRS patterns',
          'Handles 100k+ events per second',
          'Dead letter queue and retry mechanisms',
          'Comprehensive event schema validation',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims distributed systems expertise - clearly demonstrated',
          'Claims event-driven architecture - validated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Advanced architecture demonstrating expert-level understanding of event-driven patterns, consistency, and fault tolerance in distributed systems.',
      },
      {
        repo: 'postgres-performance-toolkit',
        url: 'https://github.com/davidchen/pg-perf-tools',
        qualityScore: 8,
        relevanceScore: 8,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'strong_match',
        technologies: ['PostgreSQL', 'Node.js', 'TypeScript', 'SQL'],
        strengths: [
          'Database performance analysis and optimization tools',
          'Query plan visualization',
          'Index recommendation engine',
          'Slow query detection and analysis',
          'Used by 50+ companies',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims PostgreSQL expertise - deep knowledge demonstrated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Shows database expertise beyond just usage - understands internals and performance characteristics.',
      },
    ],
    strengths: [
      'World-class distributed systems and microservices expertise',
      'Strong system design and architecture skills',
      'Deep knowledge of cloud infrastructure (AWS, K8s, Docker)',
      'Proven ability to scale systems to millions of users',
      'Excellent code quality with comprehensive testing',
      'Strong leadership and technical communication',
      'Production operations expertise (monitoring, observability)',
    ],
    weaknesses: [
      'Limited frontend experience (backend focused)',
      'Could expand knowledge of other languages (mainly Node.js/TypeScript)',
    ],
    concerns: [],
    resumeAlignment: 9.8,
    recommendation: 'strong_hire',
    technicalLevel: 'Senior/Staff Level',
    standoutQualities: [
      'Framework used in production by Fortune 500 companies',
      'Designed architecture serving 10M+ users with 99.99% uptime',
      'Led successful migration from monolith to microservices',
      'Speaker at QCon and KubeCon conferences',
      'AWS certified Solutions Architect Professional',
    ],
  };

  const davidPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: david.id,
      github: 'https://github.com/davidchen',
      linkedin: 'https://linkedin.com/in/davidchen',
      analysisData: davidAnalysisData,
      overallScore: 9.5,
      resumeAlignment: 9.8,
      recommendation: 'strong_hire',
      technicalLevel: 'Senior/Staff Level',
      summary: davidAnalysisData.summary,
      strengths: davidAnalysisData.strengths,
      weaknesses: davidAnalysisData.weaknesses,
      concerns: davidAnalysisData.concerns,
      standoutQualities: davidAnalysisData.standoutQualities,
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: david.id },
    data: { portfolioId: davidPortfolio.id },
  });

  // Emma - Interview (Python vs Node.js but strong data engineering)
  const emmaAnalysisData = {
    candidateId: emma.id,
    overallScore: 7.5,
    summary: 'Strong backend engineer with excellent data engineering and ETL expertise. Portfolio demonstrates solid Python/Django skills and experience with large-scale data processing. Technology stack differs from our Node.js focus, but fundamentals and data engineering skills are highly valuable.',
    topProjects: [
      {
        repo: 'realtime-data-pipeline',
        url: 'https://github.com/emmawilson/data-pipeline',
        qualityScore: 8,
        relevanceScore: 7,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'partial_match',
        technologies: ['Python', 'Apache Kafka', 'Apache Airflow', 'PostgreSQL', 'Redis'],
        strengths: [
          'Real-time data processing pipeline handling 1TB+ daily',
          'Sophisticated Airflow DAGs for orchestration',
          'Kafka streaming implementation',
          'Good error handling and monitoring',
          'Scales horizontally',
        ],
        concerns: [
          'Python-based vs our Node.js stack',
          'Would require learning new ecosystem',
        ],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims 5 years backend experience - validated by project complexity',
          'Claims data pipeline expertise - clearly demonstrated',
          'Claims 1TB+ daily processing - architecture supports this',
        ],
        resumeClaimsContradicted: [],
        insights: 'Impressive data engineering work. The pipeline architecture is solid and shows understanding of streaming, batch processing, and orchestration. Skills would transfer but language/framework transition needed.',
      },
      {
        repo: 'django-api-framework',
        url: 'https://github.com/emmawilson/django-api',
        qualityScore: 7,
        relevanceScore: 6,
        impressivenessLevel: 'good',
        resumeMatchLevel: 'weak_match',
        technologies: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL'],
        strengths: [
          'Clean API design',
          'Good authentication/authorization',
          'Well-structured code',
          'Good test coverage',
        ],
        concerns: [
          'Django vs our Express/Fastify stack',
          'Different paradigms and patterns',
          'Would need to learn Node.js ecosystem',
        ],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims Django expertise - validated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Solid Django work but represents different ecosystem. API design principles would transfer.',
      },
      {
        repo: 'mongodb-optimizer',
        url: 'https://github.com/emmawilson/mongo-tools',
        qualityScore: 7,
        relevanceScore: 8,
        impressivenessLevel: 'good',
        resumeMatchLevel: 'strong_match',
        technologies: ['Python', 'MongoDB', 'Data Modeling'],
        strengths: [
          'Database optimization tools',
          'Query performance analysis',
          'Schema design recommendations',
          'Works with any language/framework',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims MongoDB experience - demonstrated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Database expertise that would be valuable regardless of backend language.',
      },
    ],
    strengths: [
      'Excellent data engineering and ETL expertise',
      'Strong Python and Django skills',
      'Experience with large-scale data processing (1TB+ daily)',
      'Good understanding of distributed data systems',
      'Solid database optimization skills',
      'Kafka and streaming experience',
    ],
    weaknesses: [
      'Limited Node.js experience (Python-focused)',
      'Would require significant time to learn our tech stack',
      'Less experience with containerization/Kubernetes',
      'No TypeScript experience',
    ],
    concerns: [
      'Technology stack mismatch may require 2-3 months ramp-up',
      'Data engineering focus vs our API/microservices needs',
      'May prefer data-focused roles over general backend',
    ],
    resumeAlignment: 6.8,
    recommendation: 'interview',
    technicalLevel: 'Mid-Senior Level (Data Engineering)',
    standoutQualities: [
      'Built data pipeline processing 1TB+ daily',
      'Strong Kafka and streaming expertise',
      'Airflow orchestration expert',
    ],
  };

  const emmaPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: emma.id,
      github: 'https://github.com/emmawilson',
      linkedin: 'https://linkedin.com/in/emmawilson',
      analysisData: emmaAnalysisData,
      overallScore: 7.5,
      resumeAlignment: 6.8,
      recommendation: 'interview',
      technicalLevel: 'Mid-Senior Level (Data Engineering)',
      summary: emmaAnalysisData.summary,
      strengths: emmaAnalysisData.strengths,
      weaknesses: emmaAnalysisData.weaknesses,
      concerns: emmaAnalysisData.concerns,
      standoutQualities: emmaAnalysisData.standoutQualities,
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: emma.id },
    data: { portfolioId: emmaPortfolio.id },
  });

  // Grace - Strong Hire (Go backend with excellent DevOps)
  const graceAnalysisData = {
    candidateId: grace.id,
    overallScore: 8.7,
    summary: 'Exceptional backend engineer specializing in high-performance systems and infrastructure. Portfolio demonstrates expert-level Go programming, low-latency system design, and comprehensive DevOps/SRE skills. While primary language is Go vs our Node.js stack, the infrastructure and system design expertise is outstanding.',
    topProjects: [
      {
        repo: 'trading-engine',
        url: 'https://github.com/gracekim/trading-engine',
        qualityScore: 9,
        relevanceScore: 8,
        impressivenessLevel: 'exceptional',
        resumeMatchLevel: 'strong_match',
        technologies: ['Go', 'gRPC', 'Redis', 'PostgreSQL', 'WebSocket'],
        strengths: [
          'Ultra-low latency trading engine (microsecond response times)',
          'Handles 100k+ requests per second',
          'Lock-free concurrent data structures',
          'Excellent error handling and recovery',
          'Production-tested under high load',
          'Comprehensive metrics and monitoring',
        ],
        concerns: [
          'Go vs Node.js stack difference',
        ],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims high-performance systems expertise - clearly validated',
          'Claims low-latency experience - microsecond performance achieved',
          'Claims 6 years backend experience - complexity validates this',
        ],
        resumeClaimsContradicted: [],
        insights: 'This is exceptionally sophisticated work demonstrating expert-level understanding of concurrent programming, performance optimization, and system design. The microsecond latency requirements show mastery of low-level optimizations.',
      },
      {
        repo: 'kubernetes-operator',
        url: 'https://github.com/gracekim/k8s-operator',
        qualityScore: 9,
        relevanceScore: 9,
        impressivenessLevel: 'exceptional',
        resumeMatchLevel: 'perfect_match',
        technologies: ['Go', 'Kubernetes', 'Docker', 'Terraform', 'Helm'],
        strengths: [
          'Custom Kubernetes operator for automated scaling',
          'Intelligent autoscaling based on custom metrics',
          'Reduces infrastructure costs by 40%',
          'Production-ready with comprehensive tests',
          'Used by multiple organizations',
          'Excellent documentation',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims Kubernetes expertise - validated by operator complexity',
          'Claims Terraform experience - infrastructure as code demonstrated',
          'Claims infrastructure optimization - 40% cost reduction proven',
        ],
        resumeClaimsContradicted: [],
        insights: 'Outstanding DevOps/SRE work. Building a Kubernetes operator requires deep understanding of K8s internals and Go. The cost optimization impact is significant.',
      },
      {
        repo: 'distributed-rate-limiter',
        url: 'https://github.com/gracekim/rate-limiter',
        qualityScore: 8,
        relevanceScore: 9,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'strong_match',
        technologies: ['Go', 'Redis', 'gRPC'],
        strengths: [
          'High-performance distributed rate limiting',
          'Supports multiple algorithms (token bucket, sliding window)',
          'Redis-backed for distributed environments',
          'Sub-millisecond performance',
          'Language-agnostic gRPC API',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims distributed systems knowledge - demonstrated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Practical distributed systems tool with excellent performance characteristics. gRPC API means it could be used from Node.js services.',
      },
    ],
    strengths: [
      'Exceptional high-performance and low-latency systems expertise',
      'World-class Kubernetes and infrastructure skills',
      'Strong distributed systems knowledge',
      'Expert-level Go programming',
      'Outstanding DevOps/SRE capabilities',
      'Proven ability to reduce costs and improve efficiency',
      'Production-hardened systems at scale',
    ],
    weaknesses: [
      'Primary expertise is Go vs our Node.js stack',
      'Would need to learn Node.js/TypeScript ecosystem',
      'Less experience with REST APIs (more gRPC focused)',
    ],
    concerns: [
      'Language transition from Go to Node.js may take 1-2 months',
      'Infrastructure focus may prefer SRE/Platform roles',
    ],
    resumeAlignment: 8.5,
    recommendation: 'strong_hire',
    technicalLevel: 'Senior/Staff Level (Performance & Infrastructure)',
    standoutQualities: [
      'Built trading engine with microsecond latency',
      'Kubernetes operator reduced costs by 40% for multiple orgs',
      'Expert in high-performance concurrent systems',
      'Strong infrastructure automation and cost optimization',
      'CNCF contributor',
    ],
  };

  const gracePortfolio = await prisma.portfolio.create({
    data: {
      candidateId: grace.id,
      github: 'https://github.com/gracekim',
      linkedin: 'https://linkedin.com/in/gracekim',
      analysisData: graceAnalysisData,
      overallScore: 8.7,
      resumeAlignment: 8.5,
      recommendation: 'strong_hire',
      technicalLevel: 'Senior/Staff Level (Performance & Infrastructure)',
      summary: graceAnalysisData.summary,
      strengths: graceAnalysisData.strengths,
      weaknesses: graceAnalysisData.weaknesses,
      concerns: graceAnalysisData.concerns,
      standoutQualities: graceAnalysisData.standoutQualities,
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: grace.id },
    data: { portfolioId: gracePortfolio.id },
  });

  // Frank - Strong Hire (Full Stack)
  const frankAnalysisData = {
    candidateId: frank.id,
    overallScore: 8.9,
    summary: 'Excellent full stack developer with balanced frontend and backend expertise. Portfolio demonstrates strong TypeScript skills, modern React patterns, and solid backend architecture. Proven ability to build products from zero to scale. Great for teams needing versatile engineers who can work across the entire stack.',
    topProjects: [
      {
        repo: 'saas-starter-kit',
        url: 'https://github.com/frankmartinez/saas-starter',
        qualityScore: 9,
        relevanceScore: 9,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'perfect_match',
        technologies: ['Next.js', 'TypeScript', 'tRPC', 'Prisma', 'PostgreSQL', 'Stripe', 'NextAuth'],
        strengths: [
          'Complete SaaS boilerplate with all modern features',
          'Type-safe API with tRPC',
          'Authentication, payments, and billing integrated',
          'Multi-tenancy support',
          'Used by 500+ developers to launch products',
          'Excellent documentation and examples',
          'Production-ready with comprehensive tests',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims 5 years full stack experience - validated by project completeness',
          'Claims TypeScript expertise - end-to-end type safety demonstrated',
          'Claims built 3 products from MVP to scale - this starter enables that',
          'Claims Next.js experience - advanced patterns used',
          'Claims PostgreSQL knowledge - solid data modeling shown',
        ],
        resumeClaimsContradicted: [],
        insights: 'This is exceptional full stack work showing deep understanding of modern TypeScript ecosystem. The end-to-end type safety with tRPC is cutting-edge. Strong product sense evident from comprehensive feature set.',
      },
      {
        repo: 'react-state-machine',
        url: 'https://github.com/frankmartinez/state-machine',
        qualityScore: 8,
        relevanceScore: 8,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'strong_match',
        technologies: ['React', 'TypeScript', 'XState', 'Testing Library'],
        strengths: [
          'Elegant state machine library for React',
          'Type-safe state transitions',
          'Great developer experience',
          'Comprehensive test coverage (95%)',
          '20k+ npm downloads monthly',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims React expertise - advanced patterns demonstrated',
          'Claims TypeScript - strong typing throughout',
        ],
        resumeClaimsContradicted: [],
        insights: 'Shows sophisticated understanding of state management and TypeScript. The library design is elegant and developer-friendly.',
      },
      {
        repo: 'api-monitoring-dashboard',
        url: 'https://github.com/frankmartinez/api-dashboard',
        qualityScore: 8,
        relevanceScore: 8,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'strong_match',
        technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'React', 'WebSocket'],
        strengths: [
          'Real-time API monitoring and analytics',
          'WebSocket for live updates',
          'Beautiful visualization dashboard',
          'RESTful API design',
          'Good error tracking and alerting',
        ],
        concerns: [],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims full stack - both frontend and backend demonstrated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Complete full stack application with real-time features. Shows ability to build production monitoring tools.',
      },
    ],
    strengths: [
      'Excellent full stack skills with balanced frontend and backend expertise',
      'Strong TypeScript and modern JavaScript knowledge',
      'Deep Next.js and React expertise',
      'Solid backend architecture and API design',
      'Proven ability to build complete products',
      'Great developer tooling and library design',
      'Strong testing practices',
      'Good product sense and user empathy',
    ],
    weaknesses: [
      'Could deepen expertise in specific areas (more generalist)',
      'Limited DevOps/infrastructure experience',
      'Could expand to microservices architecture',
    ],
    concerns: [],
    resumeAlignment: 9.0,
    recommendation: 'strong_hire',
    technicalLevel: 'Senior Level (Full Stack)',
    standoutQualities: [
      'SaaS starter kit used by 500+ developers',
      'State machine library with 20k+ monthly downloads',
      'Built 3 successful products from scratch',
      'Strong open source contributions',
      'Excellent documentation and communication',
    ],
  };

  const frankPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: frank.id,
      github: 'https://github.com/frankmartinez',
      linkedin: 'https://linkedin.com/in/frankmartinez',
      website: 'https://frank.codes',
      analysisData: frankAnalysisData,
      overallScore: 8.9,
      resumeAlignment: 9.0,
      recommendation: 'strong_hire',
      technicalLevel: 'Senior Level (Full Stack)',
      summary: frankAnalysisData.summary,
      strengths: frankAnalysisData.strengths,
      weaknesses: frankAnalysisData.weaknesses,
      concerns: frankAnalysisData.concerns,
      standoutQualities: frankAnalysisData.standoutQualities,
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: frank.id },
    data: { portfolioId: frankPortfolio.id },
  });

  // Hannah - Interview (Python backend with React frontend)
  const hannahAnalysisData = {
    candidateId: hannah.id,
    overallScore: 7.9,
    summary: 'Solid full stack developer with good React frontend skills and Python backend expertise. Portfolio shows practical experience building real-world applications in fintech. Backend stack differs from our Node.js preference, but frontend and general engineering skills are strong.',
    topProjects: [
      {
        repo: 'payment-dashboard',
        url: 'https://github.com/hannahpatel/payment-dashboard',
        qualityScore: 8,
        relevanceScore: 8,
        impressivenessLevel: 'strong',
        resumeMatchLevel: 'strong_match',
        technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Stripe'],
        strengths: [
          'Production payment processing dashboard',
          'Handles sensitive financial data securely',
          'Good React and TypeScript usage',
          'Clean FastAPI backend',
          'Comprehensive error handling',
          'Used by 10+ fintech companies',
        ],
        concerns: [
          'FastAPI vs our Express/Fastify preference',
          'Would need to learn Node.js backend',
        ],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims 4 years full stack - validated by project complexity',
          'Claims fintech experience - payment processing validates this',
          'Claims React skills - good TypeScript React code',
          'Claims payment systems - Stripe integration demonstrated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Strong full stack project showing good React/TypeScript frontend and Python backend. The fintech domain expertise is valuable. Would need to transition backend to Node.js.',
      },
      {
        repo: 'react-form-builder',
        url: 'https://github.com/hannahpatel/form-builder',
        qualityScore: 7,
        relevanceScore: 8,
        impressivenessLevel: 'good',
        resumeMatchLevel: 'strong_match',
        technologies: ['React', 'TypeScript', 'React Hook Form', 'Zod'],
        strengths: [
          'Drag-and-drop form builder',
          'Type-safe validation with Zod',
          'Good React patterns',
          'Reusable and configurable',
        ],
        concerns: [
          'UI could be more polished',
          'Limited customization options',
        ],
        matchesResumeClaims: true,
        resumeClaimsValidated: [
          'Claims React expertise - demonstrated',
        ],
        resumeClaimsContradicted: [],
        insights: 'Practical React component showing good form handling and validation patterns. Useful library for admin dashboards.',
      },
    ],
    strengths: [
      'Good React and TypeScript frontend skills',
      'Practical full stack experience',
      'Fintech domain expertise',
      'Security-conscious development practices',
      'Clean code and good architecture',
      'Experience with payment processing',
    ],
    weaknesses: [
      'Backend expertise is Python vs our Node.js stack',
      'Would require learning Node.js ecosystem',
      'Less experience with complex state management',
      'Limited Docker/containerization experience',
      'Could improve testing coverage',
    ],
    concerns: [
      'Backend technology mismatch may require 1-2 months transition',
      'Less depth in either frontend or backend compared to specialists',
    ],
    resumeAlignment: 7.6,
    recommendation: 'interview',
    technicalLevel: 'Mid-Senior Level',
    standoutQualities: [
      'Payment dashboard used by 10+ fintech companies',
      'Strong security and compliance awareness',
      'Practical fintech domain knowledge',
    ],
  };

  const hannahPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: hannah.id,
      github: 'https://github.com/hannahpatel',
      linkedin: 'https://linkedin.com/in/hannahpatel',
      analysisData: hannahAnalysisData,
      overallScore: 7.9,
      resumeAlignment: 7.6,
      recommendation: 'interview',
      technicalLevel: 'Mid-Senior Level',
      summary: hannahAnalysisData.summary,
      strengths: hannahAnalysisData.strengths,
      weaknesses: hannahAnalysisData.weaknesses,
      concerns: hannahAnalysisData.concerns,
      standoutQualities: hannahAnalysisData.standoutQualities,
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: hannah.id },
    data: { portfolioId: hannahPortfolio.id },
  });

  // Create sample resumes
  console.log('📄 Creating resumes...');
  await prisma.resume.create({
    data: {
      candidateId: alice.id,
      fileUrl: 'local://resumes/frontend-job/alice-johnson.pdf',
      parsedText: 'Alice Johnson - Senior Frontend Developer with 6 years of experience...',
      parsedData: {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
        experience: '6 years frontend development',
        education: 'B.S. Computer Science, Stanford University',
      },
    },
  });

  await prisma.resume.create({
    data: {
      candidateId: david.id,
      fileUrl: 'local://resumes/backend-job/david-chen.pdf',
      parsedText: 'David Chen - Senior Backend Engineer with 7 years of experience...',
      parsedData: {
        name: 'David Chen',
        email: 'david.chen@email.com',
        skills: ['Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS'],
        experience: '7 years backend development',
        education: 'M.S. Computer Science, Carnegie Mellon University',
      },
    },
  });

  await prisma.resume.create({
    data: {
      candidateId: frank.id,
      fileUrl: 'local://resumes/fullstack-job/frank-martinez.pdf',
      parsedText: 'Frank Martinez - Full Stack Developer with 5 years of experience...',
      parsedData: {
        name: 'Frank Martinez',
        email: 'frank.martinez@email.com',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js'],
        experience: '5 years full stack development',
        education: 'B.S. Computer Science, UCLA',
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`
  📊 Summary:
  - Created 3 jobs
  - Created 8 diverse candidates
  - Created 8 portfolios with DEEP AI analysis
  - Created 3 sample resumes

  🎯 Candidate Recommendations:
  - STRONG HIRE: Alice (Frontend), David (Backend), Grace (Backend/Infra), Frank (Full Stack)
  - INTERVIEW: Bob (Frontend), Emma (Backend), Hannah (Full Stack)
  - MAYBE: Carol (Frontend)

  📈 Score Distribution:
  - Semantic Match Scores: 68-95 (out of 100)
  - Portfolio Scores: 6.8-9.5 out of 10
  - Resume Alignment: 6.5-9.8 out of 10
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
