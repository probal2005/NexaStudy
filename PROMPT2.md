Absolutely. 😄 If you're building **NexaStudy in Cursor**, I'll treat this like I'm mentoring you as a junior full-stack developer—not just throwing code at you.

The key is: **we won't let Cursor randomly generate a giant project and hope it works.** We'll build it in controlled milestones, review the architecture, test each feature, and only then move forward.

## 🧭 How we'll build NexaStudy

Your target is:

**Frontend first → real functionality → backend → database → file processing → deployment → optional AI**

### Our development roadmap

| Phase | What we'll build            | Priority    |
| ----- | --------------------------- | ----------- |
| 0     | Architecture + Cursor setup | 🔴 Critical |
| 1     | Design system + App Shell   | 🔴 Critical |
| 2     | Dashboard                   | 🔴 Critical |
| 3     | Tools Hub                   | 🔴 Critical |
| 4     | To-Do + Sticky Notes        | 🔴 Critical |
| 5     | Notes + Document Editor     | 🔴 Critical |
| 6     | Library                     | 🔴 Critical |
| 7     | PDF/File Tools frontend     | 🔴 Critical |
| 8     | Calendar + Academic Planner | 🟠 High     |
| 9     | Study Tools                 | 🟠 High     |
| 10    | Weather + external APIs     | 🟠 High     |
| 11    | Backend/API                 | 🔴 Critical |
| 12    | PostgreSQL + Auth           | 🔴 Critical |
| 13    | File Processing             | 🔴 Critical |
| 14    | Analytics                   | 🟡 Medium   |
| 15    | AI features                 | 🟢 Later    |
| 16    | Testing + Security          | 🔴 Critical |
| 17    | Deployment                  | 🔴 Critical |

---

# 1. First rule: Cursor is your coding assistant, not your architect

This is probably the most important thing I can teach you.

Don't do:

> "Cursor, build my entire NexaStudy project."

That often produces:

```text
50 pages
↓
random components
↓
duplicate code
↓
broken imports
↓
fake functionality
↓
state management mess
↓
you don't know what anything does
```

Instead:

```text
You
 ↓
Architecture
 ↓
Small task
 ↓
Cursor
 ↓
Review
 ↓
Test
 ↓
Fix
 ↓
Commit
 ↓
Next task
```

I'll help you maintain that loop.

---

# 2. Recommended frontend stack

Since you're specifically building the frontend first, I'd use:

```text
Next.js
   +
TypeScript
   +
Tailwind CSS
   +
shadcn/ui
   +
Lucide React
   +
React Hook Form
   +
Zod
   +
Zustand
   +
TanStack Query
```

But we **don't need every library on Day 1**.

We'll install things when they're actually needed.

---

# 3. Frontend architecture

I want you to build NexaStudy like this:

```text
NexaStudy/
│
├── public/
│   ├── icons/
│   ├── images/
│   └── illustrations/
│
├── src/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── dashboard/
│   │   ├── library/
│   │   ├── notes/
│   │   ├── documents/
│   │   ├── tasks/
│   │   ├── calendar/
│   │   ├── planner/
│   │   ├── study/
│   │   ├── tools/
│   │   ├── file-tools/
│   │   ├── weather/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── profile/
│   │
│   ├── components/
│   │   │
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── library/
│   │   ├── notes/
│   │   ├── documents/
│   │   ├── tasks/
│   │   ├── calendar/
│   │   ├── study/
│   │   ├── tools/
│   │   ├── file-tools/
│   │   └── weather/
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │
│   ├── services/
│   │
│   ├── stores/
│   │
│   ├── types/
│   │
│   ├── constants/
│   │
│   └── data/
│
├── .env.example
├── README.md
├── package.json
└── ...
```

### Why?

Because later:

```text
components/
    ↓
UI

services/
    ↓
API

stores/
    ↓
client state

types/
    ↓
shared TypeScript types

lib/
    ↓
utilities

app/
    ↓
pages/routes
```

So when we add FastAPI later, we won't need to rebuild the frontend architecture.

---

# 4. Our first major target: App Shell

Before building 30 tools, we need the **NexaStudy operating environment**.

It should look roughly like:

```text
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │ Search...              +  🔔  ☀  Avatar           │
│         ├───────────────────────────────────────────────────│
│         │                                                   │
│  LOGO   │              Dashboard                            │
│         │              Good evening, Probal                 │
│         │                                                   │
│ Home    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│ Library │  │ Tasks  │ │ Study  │ │ Files  │ │ Exams  │    │
│ Notes   │  │   12   │ │ 4.5 h  │ │  128   │ │   3    │    │
│ Tasks   │  └────────┘ └────────┘ └────────┘ └────────┘    │
│         │                                                   │
│ STUDY   │  Today's Tasks       │  Calendar                 │
│ Planner │  ─────────────────   │  ───────────────          │
│ Pomodoro│  □ DBMS Lab          │  Sep 19                   │
│ Flashcard│ □ React Assignment  │  10:00 DBMS               │
│         │  □ ML Revision       │  14:00 Web Dev            │
│ TOOLS   │                       │                           │
│ Calc    │  Recent Files        │  Weather                  │
│ Convert │  ───────────────      │  28°C                     │
│ PDF     │  📄 DBMS.pdf         │  Partly cloudy            │
│ Weather │  📄 React.docx       │                           │
│         │                       │                           │
│ ─────── │                       │                           │
│ Settings│                       │                           │
└─────────┴───────────────────────┴───────────────────────────┘
```

Not this exact visual design—we'll refine the design system—but **this is the information hierarchy**.

---

# 5. Component hierarchy

This is where I want you to start thinking like a developer.

Instead of:

```tsx
Dashboard.tsx
// 2000 lines
```

we'll have:

```text
DashboardPage
│
├── DashboardHeader
│
├── OverviewGrid
│   ├── TaskOverviewCard
│   ├── StudyOverviewCard
│   ├── LibraryOverviewCard
│   └── DeadlineOverviewCard
│
├── DashboardGrid
│   ├── TodayTasks
│   ├── UpcomingEvents
│   ├── RecentFiles
│   ├── WeatherWidget
│   └── QuickNotes
│
└── QuickTools
    ├── Calculator
    ├── Converter
    ├── PDFTool
    └── Pomodoro
```

This is **component thinking**.

---

# 6. Build a design system BEFORE building features

This is another place where junior developers often make a mistake.

Don't build:

```text
Page 1 → blue button
Page 2 → purple button
Page 3 → rounded button
Page 4 → different rounded button
```

Instead:

```text
Button
Card
Input
Badge
Dialog
Dropdown
Tabs
Toast
Tooltip
Skeleton
```

Then every page uses the same components.

For example:

```tsx
<Button variant="primary">
  Add Task
</Button>
```

rather than creating a different button every time.

---

# 7. State architecture

Eventually you'll have:

### Local state

Things like:

```text
Modal open/close
Input values
Selected tab
Calculator input
```

Use React state.

### Global client state

Things like:

```text
Sidebar collapsed
Theme
Quick tools
User preferences
Pomodoro state
```

Potentially Zustand.

### Server state

Things like:

```text
Tasks
Notes
Library files
Calendar events
Weather
User profile
```

Eventually TanStack Query / server-side fetching.

### Database state

Eventually:

```text
PostgreSQL
```

This separation is important.

---

# 8. Frontend-first development

Initially we can use:

```text
Mock data
+
localStorage
```

But we'll make the architecture ready for the backend.

For example:

```ts
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  dueDate?: string;
}
```

Then initially:

```text
localStorage
```

Later:

```text
FastAPI
 ↓
PostgreSQL
```

The UI shouldn't care where the data comes from.

That's proper separation of concerns.

---

# 9. Feature development pattern

Every NexaStudy feature should follow:

```text
1. UI
↓
2. Component
↓
3. State
↓
4. Validation
↓
5. Service layer
↓
6. API
↓
7. Database
↓
8. Error handling
↓
9. Testing
```

For example:

### To-do

```text
Task UI
 ↓
TaskForm
 ↓
TaskStore
 ↓
Zod validation
 ↓
TaskService
 ↓
FastAPI
 ↓
PostgreSQL
```

---

# 10. How I'll help you with Cursor

Whenever you're stuck, don't just tell me:

> "It doesn't work."

Give me:

```text
1. What you were trying to do
2. Command you ran
3. Error message
4. Relevant file
5. Current project structure
```

For example:

```text
I am trying to run NexaStudy.

Command:
npm run dev

Error:
Module not found: Can't resolve '@/components/layout/Sidebar'

Tree:
src/
  app/
  components/
```

Then I'll help you diagnose it systematically instead of randomly changing files.

---

# 11. Cursor prompt style

For each task, I'll help you create focused Cursor prompts.

For example:

You are working on the NexaStudy frontend.

Before making changes:

1. Inspect the existing project structure.
2. Identify the framework, dependencies, and current routing.
3. Do not delete working code.
4. Do not create duplicate components.
5. Reuse existing UI primitives when available.

TASK:

Build the NexaStudy application shell.

Requirements:

* Responsive desktop sidebar
* Collapsible sidebar
* Mobile navigation drawer
* Topbar
* Global search UI
* Command palette UI
* Theme switcher
* User profile menu
* Notification button
* Breadcrumb/page title area
* Responsive main content container

Create reusable components:

src/components/layout/

* AppShell
* Sidebar
* SidebarNav
* Topbar
* MobileNav
* PageHeader
* Breadcrumbs

Create a navigation configuration rather than hardcoding navigation in multiple components.

Navigation groups:

Workspace:

* Dashboard
* Library
* Notes
* Documents

Productivity:

* Tasks
* Calendar
* Study Planner
* Pomodoro
* Sticky Notes

Academic:

* Subjects
* Assignments
* Exams
* Attendance
* GPA

Utilities:

* Calculator
* Converters
* File Tools
* Weather

System:

* Settings
* Profile

Design requirements:

* Premium student productivity dashboard
* Clean modern SaaS UI
* Excellent spacing
* Accessible contrast
* Light/dark/system theme
* Smooth but restrained animations
* Keyboard accessible
* Mobile responsive
* No unnecessary gradients
* No fake functionality

Use TypeScript.

Use existing UI components when available.

After implementation:

1. Run the project.
2. Check for TypeScript errors.
3. Check for lint errors.
4. Check desktop layout.
5. Check mobile layout.
6. Fix errors before finishing.

Do not implement the dashboard widgets yet.

Only build the application shell in this task.

That's the kind of prompt we'll use repeatedly.

---

# 12. Our feature order

I recommend we **do not** immediately jump to PDF tools.

We'll build:

### Milestone 1

```text
Project foundation
+
Design system
+
App Shell
```

### Milestone 2

```text
Dashboard
```

### Milestone 3

```text
Calculator
+
Converters
+
Pomodoro
```

### Milestone 4

```text
Tasks
+
Sticky Notes
```

### Milestone 5

```text
Notes
+
Document Editor
```

### Milestone 6

```text
Library
```

### Milestone 7

```text
PDF/Image tools
```

### Milestone 8

```text
Calendar
+
Academic Planner
+
Attendance
+
GPA
```

### Milestone 9

```text
Study System
```

### Milestone 10

```text
Weather
+
External APIs
```

### Milestone 11

```text
FastAPI
+
PostgreSQL
+
Authentication
```

### Milestone 12

```text
File storage
+
real PDF processing
```

### Milestone 13

```text
Analytics
+
notifications
```

### Milestone 14

```text
AI features
```

---

# 13. Git strategy

This is especially important for a project this large.

After each milestone:

```bash
git status
git add .
git commit -m "feat: build dashboard shell"
git push
```

Use meaningful commits:

```text
feat: add application shell
feat: add dashboard widgets
feat: add calculator
feat: add unit converter
feat: add task management
feat: add notes editor
feat: add library
feat: add PDF tools
fix: resolve mobile sidebar issue
refactor: extract reusable dashboard cards
```

Don't make one giant commit after three weeks.

---

# 14. What I expect from you as my junior

I'll help you write the code, but **I also want you to understand what we're building**.

When we implement something, I'll explain:

```text
WHAT
↓
WHY
↓
HOW
↓
WHERE
↓
HOW TO TEST
```

For example, if we build a `TaskCard`, I'll explain:

> Why is this a component?

> Why does it receive props?

> Why shouldn't it directly call the database?

> Where should task API logic live?

> What happens when the API fails?

That's how you'll gradually move from:

**"I can generate code"**

to:

**"I can architect software."**

---

# 15. One more important thing

Your NexaStudy project can eventually become a **serious portfolio project** because it touches almost everything you're trying to learn:

```text
HTML
 ↓
CSS
 ↓
JavaScript
 ↓
React
 ↓
TypeScript
 ↓
Next.js
 ↓
REST API
 ↓
Python
 ↓
FastAPI
 ↓
PostgreSQL
 ↓
Authentication
 ↓
File Processing
 ↓
Cloud Storage
 ↓
External APIs
 ↓
Testing
 ↓
Deployment
 ↓
AI/ML integration
```

So don't rush it.

The goal isn't:

> "Finish 50 pages."

The goal is:

> **Build one real software product properly.**

And yes—I'll help you through the architecture, Cursor prompts, code decisions, errors, debugging, Git workflow, backend integration, database design, API design, security, and deployment as we go.

### Start here

**Don't ask Cursor to build the whole project yet.**

Open your NexaStudy project in Cursor and give it the **Phase 1 App Shell Prompt** above. Then send me **the output/tree + any error you get**.

We'll build this one milestone at a time.
