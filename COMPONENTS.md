# Lumina Components Guide

## Component Overview

### 📋 UploadForm (`src/components/UploadForm.tsx`)

**Purpose:** Allow recruiters to upload multiple resumes and job descriptions

**Features:**
- Drag-and-drop file upload
- Multi-file selection (PDF/DOCX only)
- File validation (type and size <10MB)
- Job description textarea
- Upload progress indicator
- Error handling and display
- Remove uploaded files before submission

**Usage:**
```tsx
import UploadForm from '@/components/UploadForm'

<UploadForm />
```

---

### 🏠 Dashboard (`src/app/dashboard/page.tsx`)

**Purpose:** Main recruiter dashboard showing all jobs and stats

**Features:**
- Stats cards (Active Jobs, Total Candidates, Recent Activity)
- List of recent jobs with metadata
- Status badges (active/completed)
- Navigation to job detail pages
- "New Job" button

**Route:** `/dashboard`

---

### 💼 Job Detail Page (`src/app/jobs/[id]/page.tsx`)

**Purpose:** Display all candidates for a specific job with ranking

**Features:**
- Job information header
- Sort candidates by overall score, skills, or experience
- Toggle between table and card views
- Candidate ranking table with scores
- Link to individual candidate profiles
- Portfolio links for candidates
- Score color coding (90+ green, 80+ blue, <80 gray)

**Route:** `/jobs/[id]`

**Mock Data:** Currently uses `mockJob` and `mockCandidates` - replace with API calls

---

### 👤 Candidate Card (`src/components/CandidateCard.tsx`)

**Purpose:** Compact card view of candidate information

**Features:**
- Rank badge
- Overall score badge with color coding
- Name and email display
- Score breakdown (Skills, Experience, Education)
- AI insights preview
- Link to full profile
- Portfolio link button

**Props:**
```typescript
{
  candidate: Candidate;
  rank: number;
}
```

**Usage:**
```tsx
<CandidateCard candidate={candidate} rank={1} />
```

---

### 📊 Candidate Detail Page (`src/app/candidates/[id]/page.tsx`)

**Purpose:** Full candidate profile with comprehensive information

**Features:**
- Contact information with links
- Skills match with progress bars
- Work experience timeline
- Education history
- Detailed AI analysis:
  - Strengths (green bullets)
  - Areas to explore (amber bullets)
  - Recommendation
- Action buttons:
  - Schedule Interview
  - Download Resume
  - Send Email

**Route:** `/candidates/[id]`

---

### 🔍 Candidate Detail Modal (`src/components/CandidateDetail.tsx`)

**Purpose:** Quick candidate overview in a modal dialog

**Features:**
- Modal dialog overlay
- Score breakdown
- AI insights
- Portfolio links
- Quick actions
- Link to full profile

**Props:**
```typescript
{
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Usage:**
```tsx
const [selectedCandidate, setSelectedCandidate] = useState(null)
const [isOpen, setIsOpen] = useState(false)

<CandidateDetailModal
  candidate={selectedCandidate}
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

---

### ⏳ Loading Spinner (`src/components/LoadingSpinner.tsx`)

**Purpose:** Reusable loading state indicator

**Props:**
```typescript
{
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}
```

**Usage:**
```tsx
<LoadingSpinner size="md" text="Loading candidates..." />
```

---

## Type Definitions (`src/types/index.ts`)

### Candidate
```typescript
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  portfolio: string | null;
  linkedin?: string;
  github?: string;
  resumeUrl: string;
  insights: string;
}
```

### Job
```typescript
interface Job {
  id: string;
  title: string;
  description: string;
  candidateCount: number;
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
}
```

---

## Routing Structure

```
/                           → Home/Upload page
/dashboard                  → Dashboard with all jobs
/jobs/[id]                 → Job detail with candidates
/candidates/[id]           → Full candidate profile
```

---

## Color Coding

### Score Badges
- **90-100:** Primary (default) - Top candidates
- **80-89:** Secondary - Good candidates
- **<80:** Outline - Potential candidates

### AI Analysis
- **Strengths:** Green bullets (text-green-600)
- **Concerns:** Amber bullets (text-amber-600)

---

## shadcn/ui Components Used

- Button
- Card (CardContent, CardDescription, CardHeader, CardTitle)
- Input
- Textarea
- Label
- Badge
- Progress
- Table (TableBody, TableCell, TableHead, TableHeader, TableRow)
- Dialog (DialogContent, DialogDescription, DialogHeader, DialogTitle)
- Select (SelectContent, SelectItem, SelectTrigger, SelectValue)
- Dropdown Menu
- Separator

All components are fully styled, responsive, and accessible.

---

## Next Steps for Backend Integration

1. **Replace Mock Data:**
   - Remove `mockCandidates`, `mockJobs`, etc.
   - Add API fetching functions

2. **Create API Routes:**
   ```
   POST /api/upload        → Upload resumes and job description
   GET  /api/jobs          → Get all jobs
   GET  /api/jobs/[id]     → Get job with candidates
   GET  /api/candidates/[id] → Get candidate details
   ```

3. **Add Loading States:**
   - Use `LoadingSpinner` component
   - Add Suspense boundaries

4. **Real-time Updates:**
   - Polling every X seconds
   - Server-Sent Events (SSE)
   - WebSockets for live updates

5. **Error Handling:**
   - Toast notifications
   - Error boundaries
   - Retry logic
