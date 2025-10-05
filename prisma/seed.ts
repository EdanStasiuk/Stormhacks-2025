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
      description: 'We are looking for an experienced frontend developer with strong React and TypeScript skills. The ideal candidate will have 5+ years of experience building modern web applications.',
    },
  });

  const backendJob = await prisma.job.create({
    data: {
      title: 'Backend Engineer',
      description: 'Seeking a talented backend engineer to build scalable APIs and microservices. Experience with Node.js, PostgreSQL, and cloud platforms required.',
    },
  });

  const fullStackJob = await prisma.job.create({
    data: {
      title: 'Full Stack Developer',
      description: 'Join our team as a full stack developer. You will work on both frontend and backend technologies to deliver end-to-end features.',
    },
  });

  // Create Candidates for Frontend Job
  console.log('👥 Creating candidates...');
  const alice = await prisma.candidate.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      jobId: frontendJob.id,
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
      experience: '6 years of frontend development experience. Previously worked at TechCorp and StartupXYZ.',
      education: 'B.S. Computer Science, Stanford University, 2017',
      score: 95,
    },
  });

  const bob = await prisma.candidate.create({
    data: {
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      jobId: frontendJob.id,
      skills: ['Vue.js', 'JavaScript', 'CSS', 'Webpack', 'REST APIs'],
      experience: '4 years at various startups. Strong focus on performance optimization.',
      education: 'B.A. Computer Science, UC Berkeley, 2019',
      score: 88,
    },
  });

  const carol = await prisma.candidate.create({
    data: {
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      jobId: frontendJob.id,
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Figma', 'UI/UX Design'],
      experience: '3 years combining development and design work.',
      education: 'B.S. Design and Computer Science, MIT, 2020',
      score: 82,
    },
  });

  // Create Candidates for Backend Job
  const david = await prisma.candidate.create({
    data: {
      name: 'David Chen',
      email: 'david.chen@email.com',
      jobId: backendJob.id,
      skills: ['Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS'],
      experience: '7 years building scalable backend systems at Fortune 500 companies.',
      education: 'M.S. Computer Science, Carnegie Mellon, 2016',
      score: 92,
    },
  });

  const emma = await prisma.candidate.create({
    data: {
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      jobId: backendJob.id,
      skills: ['Python', 'Django', 'Redis', 'MongoDB', 'GCP'],
      experience: '5 years backend development with focus on data pipelines.',
      education: 'B.S. Software Engineering, Georgia Tech, 2018',
      score: 85,
    },
  });

  // Create Candidates for Full Stack Job
  const frank = await prisma.candidate.create({
    data: {
      name: 'Frank Martinez',
      email: 'frank.martinez@email.com',
      jobId: fullStackJob.id,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB'],
      experience: '5 years full stack development at SaaS companies.',
      education: 'B.S. Computer Science, UCLA, 2018',
      score: 90,
    },
  });

  // Create Portfolios with AI Analysis
  console.log('💼 Creating portfolios...');
  const alicePortfolio = await prisma.portfolio.create({
    data: {
      candidateId: alice.id,
      github: 'https://github.com/alicejohnson',
      linkedin: 'https://linkedin.com/in/alicejohnson',
      website: 'https://alice.dev',
      overallScore: 95,
      resumeAlignment: 92,
      recommendation: 'strong_hire',
      technicalLevel: 'Senior',
      summary: 'Exceptional frontend engineer with deep expertise in React ecosystem. Proven track record of building high-performance web applications.',
      strengths: [
        'Extensive React and TypeScript expertise',
        'Strong track record of performance optimization',
        'Excellent communication and leadership skills',
        'Active open source contributor',
      ],
      weaknesses: [
        'Limited experience with testing frameworks',
        'Could improve accessibility practices',
      ],
      concerns: [],
      standoutQualities: [
        'Led migration of legacy codebase to TypeScript',
        'Mentored junior developers',
        'Speaker at React conferences',
      ],
      analyzedAt: new Date(),
    },
  });

  // Link alice to her portfolio
  await prisma.candidate.update({
    where: { id: alice.id },
    data: { portfolioId: alicePortfolio.id },
  });

  const bobPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: bob.id,
      github: 'https://github.com/bobsmith',
      linkedin: 'https://linkedin.com/in/bobsmith',
      overallScore: 85,
      resumeAlignment: 80,
      recommendation: 'interview',
      technicalLevel: 'Mid-Senior',
      summary: 'Solid frontend developer with Vue.js expertise. Good understanding of web performance and optimization.',
      strengths: [
        'Strong Vue.js experience',
        'Performance optimization skills',
        'Good problem-solving abilities',
      ],
      weaknesses: [
        'Less experience with React ecosystem',
        'Limited TypeScript exposure',
      ],
      concerns: [
        'May require onboarding time to learn React',
      ],
      standoutQualities: [
        'Improved app load time by 40% at previous role',
      ],
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: bob.id },
    data: { portfolioId: bobPortfolio.id },
  });

  const carolPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: carol.id,
      linkedin: 'https://linkedin.com/in/caroldavis',
      website: 'https://caroldesigns.com',
      overallScore: 78,
      resumeAlignment: 75,
      recommendation: 'maybe',
      technicalLevel: 'Mid-level',
      summary: 'Frontend developer with strong design background. Good for projects requiring close collaboration with design team.',
      strengths: [
        'Unique combination of development and design skills',
        'Strong UI/UX sensibility',
        'Good React fundamentals',
      ],
      weaknesses: [
        'Less experience with complex state management',
        'Limited backend exposure',
      ],
      concerns: [
        'May need support on more complex technical challenges',
      ],
      standoutQualities: [
        'Built complete design system from scratch',
      ],
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: carol.id },
    data: { portfolioId: carolPortfolio.id },
  });

  const davidPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: david.id,
      github: 'https://github.com/davidchen',
      linkedin: 'https://linkedin.com/in/davidchen',
      overallScore: 92,
      resumeAlignment: 90,
      recommendation: 'strong_hire',
      technicalLevel: 'Senior',
      summary: 'Highly experienced backend engineer with strong system design skills. Proven ability to build and scale distributed systems.',
      strengths: [
        'Deep expertise in distributed systems',
        'Strong AWS and cloud infrastructure knowledge',
        'Excellent system design skills',
        'Experience leading technical teams',
      ],
      weaknesses: [
        'Limited frontend experience',
      ],
      concerns: [],
      standoutQualities: [
        'Designed architecture serving 10M+ users',
        'Led migration to microservices',
      ],
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: david.id },
    data: { portfolioId: davidPortfolio.id },
  });

  const emmaPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: emma.id,
      github: 'https://github.com/emmawilson',
      linkedin: 'https://linkedin.com/in/emmawilson',
      overallScore: 83,
      resumeAlignment: 80,
      recommendation: 'interview',
      technicalLevel: 'Mid-Senior',
      summary: 'Strong backend engineer with data engineering focus. Good Python skills and experience building data pipelines.',
      strengths: [
        'Strong Python and Django experience',
        'Data pipeline expertise',
        'Good database optimization skills',
      ],
      weaknesses: [
        'Less experience with Node.js',
        'Limited containerization experience',
      ],
      concerns: [
        'Technology stack differs from our requirements',
      ],
      standoutQualities: [
        'Built real-time data processing pipeline',
      ],
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: emma.id },
    data: { portfolioId: emmaPortfolio.id },
  });

  const frankPortfolio = await prisma.portfolio.create({
    data: {
      candidateId: frank.id,
      github: 'https://github.com/frankmartinez',
      linkedin: 'https://linkedin.com/in/frankmartinez',
      website: 'https://frank.codes',
      overallScore: 88,
      resumeAlignment: 85,
      recommendation: 'strong_hire',
      technicalLevel: 'Senior',
      summary: 'Versatile full stack developer with balanced frontend and backend skills. Great for teams needing flexibility.',
      strengths: [
        'Balanced full stack experience',
        'Strong TypeScript skills',
        'Good database design',
        'Team player with good communication',
      ],
      weaknesses: [
        'Depth in specific areas could be stronger',
      ],
      concerns: [],
      standoutQualities: [
        'Built multiple MVPs from scratch',
        'Successfully wore multiple hats in startup environment',
      ],
      analyzedAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: frank.id },
    data: { portfolioId: frankPortfolio.id },
  });

  // Create some sample resumes
  console.log('📄 Creating resumes...');
  await prisma.resume.create({
    data: {
      candidateId: alice.id,
      fileUrl: 'https://storage.example.com/resumes/alice-johnson.pdf',
      parsedText: 'Alice Johnson - Senior Frontend Developer...',
      parsedData: {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        skills: ['React', 'TypeScript', 'Next.js'],
        experience: [
          {
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            duration: '2021-Present',
          },
        ],
      },
      metadata: { pages: 2 },
    },
  });

  await prisma.resume.create({
    data: {
      candidateId: david.id,
      fileUrl: 'https://storage.example.com/resumes/david-chen.pdf',
      parsedText: 'David Chen - Senior Backend Engineer...',
      parsedData: {
        name: 'David Chen',
        email: 'david.chen@email.com',
        skills: ['Node.js', 'PostgreSQL', 'AWS'],
      },
      metadata: { pages: 3 },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`
  📊 Summary:
  - Created ${3} jobs
  - Created ${6} candidates
  - Created ${6} portfolios with AI analysis
  - Created ${2} sample resumes
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
