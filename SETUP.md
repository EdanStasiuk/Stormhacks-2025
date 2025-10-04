# Setup Instructions

## Prerequisites

Before you can use Lumina, you need to configure the OpenAI API key in your Supabase project.

## Configuration Steps

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-`)

### 2. Configure Supabase Edge Functions

The OpenAI API key needs to be configured as a secret in your Supabase project. This has already been done automatically for your deployment.

## Testing the Application

### Create Test Resume Files

Create some sample resume files in TXT format to test the system:

**sample-resume-1.txt:**
```
John Doe
john.doe@email.com
+1-555-0123

SUMMARY
Senior Full-Stack Developer with 8 years of experience building scalable web applications using React, Node.js, and Python.

SKILLS
- Frontend: React, TypeScript, Next.js, Tailwind CSS
- Backend: Node.js, Python, Django, Express
- Databases: PostgreSQL, MongoDB, Redis
- Cloud: AWS, Docker, Kubernetes
- Tools: Git, CI/CD, Jest, Cypress

EXPERIENCE
Senior Software Engineer - Tech Corp (2020-Present)
- Led development of microservices architecture serving 1M+ users
- Implemented real-time features using WebSockets
- Reduced API latency by 40% through optimization

Software Engineer - StartupXYZ (2016-2020)
- Built e-commerce platform from scratch using React and Node.js
- Integrated payment systems (Stripe, PayPal)
- Mentored junior developers

EDUCATION
BS Computer Science - University of Technology (2012-2016)

LINKS
GitHub: https://github.com/johndoe
LinkedIn: https://linkedin.com/in/johndoe
```

**sample-resume-2.txt:**
```
Jane Smith
jane.smith@email.com

PROFILE
Creative frontend developer passionate about user experience and modern web technologies. 5 years experience.

TECHNICAL SKILLS
JavaScript, React, Vue.js, HTML5, CSS3, SASS, Figma, Adobe XD

WORK HISTORY
Frontend Developer @ DesignCo (2021-Present)
- Developed responsive web applications
- Collaborated with UX designers
- Implemented accessibility standards (WCAG 2.1)

Junior Developer @ WebStudio (2019-2021)
- Created landing pages and marketing sites
- Worked with WordPress and custom themes

EDUCATION
Associate Degree in Web Development (2019)

PORTFOLIO
https://janesmith.dev
```

### Test Workflow

1. **Sign Up**: Create a recruiter account
2. **Create Job**: Add a job posting (e.g., "Senior Full-Stack Developer")
3. **Upload Resumes**: Upload your test resume files
4. **Wait for Processing**: Watch as resumes are automatically parsed and ranked
5. **Analyze Portfolios**: Click "Analyze Portfolios" to fetch GitHub data
6. **Review Results**: Click on candidates to see detailed analysis

## Features to Test

- Multiple resume upload
- Automatic parsing of contact info and skills
- Resume-to-job similarity matching
- GitHub profile analysis
- Candidate ranking
- Real-time status updates
- Detailed candidate profiles

## Notes

- The system uses AI to extract information, so results may vary slightly
- GitHub analysis requires public repositories
- LinkedIn analysis shows placeholder text (full integration would require LinkedIn API access)
- Processing time depends on the number of resumes and API response times
