MASTER PROMPT — BUILD NEXASTUDY END-TO-END

You are acting as a Senior Full-Stack Engineer, Software Architect, UI/UX Engineer, Database Engineer, Security Engineer, QA Engineer, and technical mentor.

I am a junior developer. Your job is to build the complete project for me inside the current Cursor workspace.

PROJECT

Name: NexaStudy
Tagline: Your Complete Student Workspace

NexaStudy is a modern all-in-one student productivity and academic workspace.

The final application should combine:

Student dashboard
Digital library
Notes
Documents
Tasks
Calendar
Study planner
Academic management
Attendance tracker
GPA/CGPA tools
Calculators
Unit converters
File/PDF tools
Weather
Study productivity tools
Analytics
Profile/settings
Authentication
Backend API
Database
File storage
Optional AI study assistant

The final result must feel like a real production-grade SaaS/student operating system, not a tutorial project.

IMPORTANT AUTONOMOUS DEVELOPMENT RULE

Do NOT stop after creating a basic frontend.

Do NOT only create placeholder pages.

Do NOT ask me to manually implement every feature.

You must progressively implement the entire project.

However:

Never destroy existing working code unnecessarily.
First inspect the existing project.
Reuse good existing code.
If architecture is poor, refactor carefully.
Keep the application runnable after every major phase.
Do not create fake backend functionality when real functionality is required.
Do not claim a feature works if it is only mocked.
Use clearly marked development fallbacks only when an external API/key is unavailable.
Never hard-code secrets.
Never expose API keys in client-side code.
Never use fake data as the final implementation for important functionality.
If credentials are required, create .env.example and document exactly what is required.
Make reasonable engineering decisions without repeatedly asking me for confirmation.
EXISTING ENVIRONMENT

Assume:

Ubuntu 26.04 LTS
Node.js 22+
npm
Cursor IDE
TypeScript
Next.js
React
Tailwind CSS

If the project is not already initialized, initialize the appropriate Next.js application.

Use:

TypeScript
Next.js App Router
Tailwind CSS
ESLint
strict TypeScript
src/ directory
@/* import alias
STEP 1 — INSPECT PROJECT

Before changing anything:

Inspect the complete project structure.
Inspect package.json.
Inspect existing source files.
Inspect configuration files.
Identify installed dependencies.
Identify broken imports/build issues.
Identify existing features.
Preserve useful existing work.

Then create a short internal implementation plan.

Do not wait for my approval.

Proceed automatically.

STEP 2 — PROJECT ARCHITECTURE

Create a scalable architecture similar to:

src/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── library/
│   ├── notes/
│   ├── documents/
│   ├── tasks/
│   ├── calendar/
│   ├── study/
│   ├── subjects/
│   ├── assignments/
│   ├── exams/
│   ├── attendance/
│   ├── gpa/
│   ├── calculators/
│   ├── converters/
│   ├── file-tools/
│   ├── weather/
│   ├── analytics/
│   ├── favorites/
│   ├── recent/
│   ├── settings/
│   ├── profile/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── library/
│   ├── notes/
│   ├── documents/
│   ├── tasks/
│   ├── calendar/
│   ├── study/
│   ├── academic/
│   ├── calculators/
│   ├── converters/
│   ├── file-tools/
│   ├── weather/
│   └── shared/
│
├── hooks/
├── lib/
├── services/
├── stores/
├── types/
├── constants/
├── utils/
├── data/
└── styles/

Adapt the structure if a better production architecture is appropriate.

STEP 3 — DESIGN SYSTEM

Create a polished modern student SaaS design.

Design goals:

clean
modern
minimal
professional
responsive
accessible
fast
visually consistent

Implement:

typography system
spacing system
cards
buttons
inputs
selects
dialogs
dropdowns
tabs
tables
badges
tooltips
alerts
progress bars
skeleton loaders
empty states
error states
toast notifications
confirmation dialogs
responsive layouts

Use Lucide icons.

Avoid excessive gradients.

Avoid excessive animations.

Use subtle transitions.

Support:

Light theme
Dark theme
System theme
STEP 4 — APPLICATION SHELL

Build:

Sidebar

Navigation groups:

WORKSPACE
Dashboard
Library
Notes
Documents
PRODUCTIVITY
Tasks
Calendar
Study Planner
Pomodoro
Sticky Notes
ACADEMIC
Subjects
Assignments
Exams
Attendance
GPA / CGPA
TOOLS
Calculators
Converters
File Tools
Weather
INSIGHTS
Analytics
Favorites
Recent Activity
SYSTEM
Settings
Profile

Requirements:

desktop sidebar
collapsible sidebar
mobile drawer
active route
keyboard accessibility
tooltips
icons
responsive navigation

Create centralized navigation configuration.

STEP 5 — DASHBOARD

Create a complete dashboard.

Include:

greeting
current date
study streak
today's tasks
upcoming deadlines
upcoming exams
study hours
weekly study progress
library statistics
recent files
recent notes
upcoming calendar events
subject progress
attendance summary
quick actions
weather
Pomodoro status
storage usage
productivity summary

Dashboard must be responsive.

Allow widgets to be reorganized if practical.

STEP 6 — AUTHENTICATION

Implement real authentication architecture.

Support:

signup
login
logout
protected routes
session handling
password validation
password reset architecture
email verification architecture
user profile

Use a secure authentication solution.

Do NOT store plain-text passwords.

Create proper authorization.

Users must only access their own:

files
notes
tasks
calendar events
academic information
study history
settings

Create .env.example.

Document authentication setup.

STEP 7 — DATABASE

Use PostgreSQL.

Use a production-quality ORM such as Prisma or SQLAlchemy depending on architecture.

Recommended frontend/backend architecture:

Next.js
   ↓
API
   ↓
FastAPI
   ↓
PostgreSQL

If implementing the backend separately, create:

backend/
├── app/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── core/
│   ├── middleware/
│   └── utils/
├── tests/
├── requirements.txt
├── .env.example
└── README.md

Database entities should include at minimum:

User
Profile
Subject
Task
Subtask
Note
Document
Folder
File
CalendarEvent
Assignment
Exam
Attendance
StudySession
StudyGoal
PomodoroSession
FlashcardDeck
Flashcard
Favorite
RecentActivity
Notification
UserSettings

Use:

primary keys
foreign keys
indexes
timestamps
ownership checks
cascading rules where appropriate
STEP 8 — DIGITAL LIBRARY

Build a complete digital library.

Features:

upload
drag/drop
multiple upload
folders
rename
move
delete
restore
permanent delete
download
search
filter
sorting
tags
favorites
recent files
trash
storage usage

Supported files:

PDF
DOCX
PPTX
XLSX
TXT
Markdown
JPG
JPEG
PNG
WEBP

Create file preview where practical.

Display:

file name
type
size
upload date
modified date
folder
favorite status
STEP 9 — NOTES

Create a complete notes system.

Features:

create
edit
delete
autosave
search
tags
subject
favorite
archive
restore
word count
character count
timestamps

Use a proper editor such as TipTap if appropriate.

Support:

headings
bold
italic
underline
lists
links
code blocks
quotes
tables where practical
STEP 10 — DOCUMENT EDITOR

Build document workspace.

Features:

rich editor
title
subject
tags
autosave
word count
version history
duplicate
export
print

Export formats:

PDF
DOCX
Markdown
TXT
STEP 11 — TASK MANAGER

Implement real task management.

Features:

create
edit
delete
complete
reopen
priority
due date
due time
subject
tags
subtasks
recurring tasks
reminders
search
filters
sorting

Views:

Today
Upcoming
Overdue
Completed
Priority

Also create Kanban:

Backlog
To Do
In Progress
Review
Completed
STEP 12 — CALENDAR

Create:

month view
week view
day view
agenda view

Event types:

class
exam
assignment
study
personal
reminder
holiday

Features:

create
edit
delete
recurring events
reminders
color/category
linked subject
linked task
STEP 13 — STUDY PLANNER

Implement:

study goals
daily study plan
weekly study plan
subject goals
study sessions
study history
study streak
progress tracking
exam countdown
revision planner
STEP 14 — POMODORO

Build a real Pomodoro timer.

Default:

25 min work
5 min short break
15 min long break

Features:

start
pause
resume
reset
skip
custom durations
session history
completed sessions
study subject
daily statistics

Do not rely only on frontend state if authenticated history is required.

STEP 15 — STICKY NOTES

Create draggable/resizable sticky notes if practical.

Features:

create
edit
color/theme
pin
archive
delete
search

Persist authenticated notes.

STEP 16 — SUBJECT MANAGEMENT

Create subject management.

Each subject can contain:

subject name
code
teacher
credits
semester
color
notes
tasks
assignments
exams
study sessions
attendance
STEP 17 — ASSIGNMENTS

Features:

create
edit
delete
status
subject
deadline
priority
description
attachment
completion percentage

Statuses:

Not Started
In Progress
Submitted
Completed
Overdue
STEP 18 — EXAMS

Features:

exam schedule
subject
date
time
venue
preparation progress
countdown
linked study plan
STEP 19 — ATTENDANCE

Implement:

subject
total classes
attended
absent
percentage
target percentage
required classes
warning status
projection

Clearly label calculations as estimates when based on assumptions.

Formula:

Attendance % =
(attended / total) × 100

Handle division-by-zero safely.

STEP 20 — GPA / CGPA

Create configurable GPA/CGPA calculator.

Features:

subjects
credits
grades
grade points
semester GPA
cumulative CGPA
add/remove subjects
reset
save calculation

Do NOT assume one universal percentage-to-CGPA formula.

Allow configurable grading systems.

STEP 21 — CALCULATOR HUB

Implement:

Basic Calculator
Scientific Calculator
Percentage Calculator
GPA Calculator
CGPA Calculator
Attendance Calculator
Marks Calculator
Grade Calculator
Age Calculator
Date Difference
BMI Calculator
Discount Calculator
Simple Interest
Compound Interest
Fraction Calculator
Ratio Calculator

Use correct formulas.

Add validation.

Prevent invalid mathematical operations.

STEP 22 — CONVERTER HUB

Implement:

Temperature
Celsius
Fahrenheit
Kelvin
Length
meter
kilometer
centimeter
millimeter
inch
foot
yard
mile
Weight
kilogram
gram
milligram
pound
ounce
Area
square meter
square kilometer
square foot
acre
hectare
Volume
liter
milliliter
cubic meter
gallon
Speed
m/s
km/h
mph
Time
seconds
minutes
hours
days
Data
bit
byte
KB
MB
GB
TB
Number systems
binary
decimal
octal
hexadecimal
Currency

Use a real exchange-rate API.

Never hard-code live exchange rates.

Keep API keys server-side.

STEP 23 — FILE TOOLS

Create a complete file utilities interface.

PDF tools:

images → PDF
PDF → images
merge PDF
split PDF
compress PDF
rotate PDF
reorder PDF pages
delete pages
extract pages
PDF → text
text → PDF
PDF → DOCX
DOCX → PDF
PPTX → PDF
XLSX → PDF
watermark
metadata viewer

Image tools:

compressor
resize
crop
JPG → PNG
PNG → JPG
WebP conversion
image metadata

Use appropriate real libraries.

Possible backend libraries:

pypdf
PyMuPDF
Pillow
python-docx
LibreOffice CLI where appropriate

Security requirements:

file size validation
extension validation
MIME validation
sanitized filenames
temporary file cleanup
isolated processing
no execution of uploaded files
private storage
rate limiting
safe error messages
no server filesystem paths exposed
STEP 24 — WEATHER

Implement weather dashboard.

Features:

search city
current temperature
feels like
humidity
wind
visibility
pressure
hourly forecast
daily forecast
sunrise
sunset
units
favorite cities
recent cities

Use a real weather API.

API key must never be exposed to frontend JavaScript.

Create graceful:

loading
error
empty
API unavailable

states.

STEP 25 — ANALYTICS

Create student productivity analytics.

Track:

study hours
completed tasks
overdue tasks
Pomodoro sessions
subject study distribution
attendance
assignment completion
weekly productivity
monthly productivity
study streak

Charts must be readable and responsive.

Do not create misleading analytics.

STEP 26 — FAVORITES

Allow users to favorite:

files
notes
documents
subjects
tools
weather locations

Create unified favorites page.

STEP 27 — RECENT ACTIVITY

Track:

file uploaded
note created
task completed
document edited
study session completed
assignment updated
exam added
favorite added

Create recent activity page.

STEP 28 — PROFILE

Profile fields:

name
email
avatar
university
department
semester
academic year
bio

Allow editing.

STEP 29 — SETTINGS

Create:

Appearance
light
dark
system
Notifications
task reminders
assignment reminders
exam reminders
study reminders
Preferences
language
date format
time format
default units
Privacy
data export
account deletion
session management
Storage
usage
files
trash
STEP 30 — GUEST MODE

Some features should work without authentication:

basic calculator
converters
timers
basic text utilities
basic file utilities where appropriate

Authenticated features:

cloud library
notes
tasks
calendar
academic records
study history
favorites
analytics
cloud storage

Clearly distinguish guest and authenticated state.

STEP 31 — AI MODULE

Create AI architecture but keep it modular.

Feature name:

NexaStudy AI Study Assistant

Potential features:

explain topic
summarize notes
generate flashcards
generate quiz
generate revision plan
document Q&A
extract key points
generate practice questions

Important:

AI is optional.
Do not make the whole application dependent on AI.
Never expose AI API keys.
Add backend AI service.
Add provider abstraction.
Add loading/error states.
Label generated content as AI-generated.
Do not present uncertain AI output as verified fact.
Never automatically send private documents to an AI provider without explicit user action.

Create a modular interface so providers can later be changed.

STEP 32 — SECURITY

Implement security throughout the application.

Requirements:

authentication
authorization
ownership checks
secure password handling
input validation
schema validation
rate limiting
safe file upload
sanitized filenames
CSRF protection where applicable
secure cookies
no secrets in Git
environment variables
safe error messages
API validation
database constraints
audit logging where appropriate

Never trust frontend validation alone.

STEP 33 — ACCESSIBILITY

Target strong accessibility.

Implement:

semantic HTML
keyboard navigation
focus states
accessible labels
ARIA only when necessary
accessible dialogs
accessible dropdowns
accessible tables
sufficient contrast
reduced motion support
screen-reader friendly navigation
STEP 34 — RESPONSIVE DESIGN

Test layouts for:

320px
375px
414px
768px
1024px
1280px
1440px

No horizontal overflow.

Mobile should not simply be a scaled desktop layout.

Create proper mobile navigation.

STEP 35 — PERFORMANCE

Optimize:

lazy loading
dynamic imports
code splitting
image optimization
pagination
debounced search
caching
database indexes
efficient API calls
background processing for heavy files
PDF viewer lazy loading
unnecessary rerender prevention
STEP 36 — ERROR STATES

Every major feature must include:

loading
empty
success
validation error
network error
unauthorized
forbidden
not found
server error
unsupported file
file too large
conversion failure
API unavailable

Do not leave blank screens.

STEP 37 — SEED DATA

Create development seed data.

Use realistic but obviously fictional student data.

Seed:

subjects
tasks
notes
assignments
exams
calendar events
attendance
study sessions

Do not use real personal data.

STEP 38 — TESTING

Create tests for important logic.

Test:

calculators
converters
attendance
GPA
task logic
date logic
authentication
authorization
file validation
API validation

Test important UI flows where practical.

STEP 39 — DOCUMENTATION

Create:

README.md
ARCHITECTURE.md
API.md
SECURITY.md
DATABASE.md
FILE_PROCESSING.md
DEPLOYMENT.md
TROUBLESHOOTING.md
CONTRIBUTING.md
.env.example

README must include:

project overview
features
screenshots section placeholder
architecture
tech stack
installation
environment variables
database setup
backend setup
frontend setup
development
testing
production build
deployment
security
future roadmap
STEP 40 — ENVIRONMENT VARIABLES

Create .env.example.

Never put actual secrets inside source code.

Example categories:

DATABASE_URL=
AUTH_SECRET=
WEATHER_API_KEY=
CURRENCY_API_KEY=
AI_API_KEY=
STORAGE_URL=
STORAGE_KEY=

Only include variables actually used by the implementation.

STEP 41 — UI QUALITY

The UI must not look like a generic generated dashboard.

Pay attention to:

spacing
typography
hierarchy
card density
empty states
responsive behavior
icon consistency
navigation
forms
dialogs
table readability
mobile UX

Avoid:

giant unnecessary gradients
excessive glassmorphism
random colors
huge headings
excessive rounded cards
unnecessary animations
fake statistics
STEP 42 — CODE QUALITY

Use:

strict TypeScript
reusable components
reusable hooks
typed API responses
schema validation
clean naming
modular services
separation of concerns
no giant components
no duplicated logic
no any unless absolutely unavoidable
comments only when useful

Do not silence TypeScript errors.

Do not disable ESLint simply to make the build pass.

STEP 43 — DEPENDENCY MANAGEMENT

Only install dependencies when needed.

Before adding a package:

Check whether the existing project already provides equivalent functionality.
Avoid unnecessary dependencies.
Prefer stable and maintained libraries.
Keep the dependency tree reasonable.

After dependency changes:

npm install
npm run lint
npm run build

Fix issues properly.

STEP 44 — BUILD VALIDATION

At every major milestone run:

npm run lint
npm run build

If tests exist:

npm test

If backend exists, run its test suite as well.

Do not stop at the first error.

Investigate and fix the root cause.

STEP 45 — FINAL QA

Before considering the project complete, inspect:

all routes
navigation
mobile layout
desktop layout
dark mode
forms
dialogs
loading states
error states
empty states
authentication
authorization
database queries
API validation
file processing
calculator formulas
converter formulas
responsive behavior
TypeScript
ESLint
build

Find and fix obvious issues.

STEP 46 — NO FAKE IMPLEMENTATIONS

This rule is extremely important.

Do not implement something like:

"File uploaded successfully"

when no file was actually uploaded.

Do not implement:

"Weather: 28°C"

using a hard-coded value and pretend it is live weather.

Do not create fake API responses for production functionality.

If an external service cannot be configured yet:

build the integration correctly,
create environment variable placeholders,
show a clear configuration error,
provide a development fallback only if useful,
clearly label the fallback.
STEP 47 — DEVELOPMENT PHASES

Work through these phases automatically:

PHASE 0
Inspect + repair project

PHASE 1
Architecture + design system

PHASE 2
Application shell

PHASE 3
Dashboard

PHASE 4
Tasks + sticky notes

PHASE 5
Notes + documents

PHASE 6
Library

PHASE 7
File tools

PHASE 8
Calendar + academic planner

PHASE 9
Study tools + Pomodoro

PHASE 10
Calculators + converters

PHASE 11
Weather + external APIs

PHASE 12
Backend + API

PHASE 13
Database + authentication + storage

PHASE 14
Analytics

PHASE 15
AI module

PHASE 16
Security

PHASE 17
Testing

PHASE 18
Documentation

PHASE 19
Final QA + production preparation

Do not stop after Phase 1.

Continue until the project is implemented as completely as reasonably possible.

STEP 48 — GIT

If Git is already configured:

Create meaningful commits after major phases.

Examples:

feat: establish nexastudy architecture
feat: add application shell
feat: build dashboard
feat: add task management
feat: add notes workspace
feat: add digital library
feat: add file tools
feat: add academic planner
feat: add study tools
feat: add calculators and converters
feat: add backend api
feat: add authentication
feat: add database
feat: add analytics
feat: add ai study assistant
test: add core application tests
docs: complete project documentation
fix: resolve final qa issues

Do not push to GitHub automatically unless explicitly requested.

STEP 49 — FINAL REPORT

When the implementation is complete, provide me with:

1. What was built

Short feature summary.

2. Architecture

Explain:

Frontend
Backend
Database
Storage
External APIs
AI
Authentication
3. Important files

Show the important project files.

4. Commands

Give exact commands to run:

npm install
npm run dev
npm run build

and backend commands if applicable.

5. Environment variables

Tell me exactly which .env values I still need to configure.

6. Remaining limitations

Only list genuine limitations.

7. Testing status

Report:

lint
build
tests
known issues

Do not claim tests passed unless they actually passed.

MOST IMPORTANT EXECUTION RULE

You are not merely generating a specification.

You are the implementation agent.

Actually create and modify the files in the current workspace.

Do not respond with a giant tutorial instead of implementing.

Do not stop after generating a plan.

Do not repeatedly ask:

"Should I continue?"

Continue automatically.

If a decision is required and there is a reasonable industry-standard choice, make that choice yourself.

Only stop and ask me if you genuinely require something that cannot be inferred or generated, such as:

API secret
production database credentials
OAuth credentials
cloud storage credentials
domain ownership
a decision that fundamentally changes the product

When blocked by credentials, implement everything around the integration first and clearly tell me exactly what credential is required.

FINAL SUCCESS CRITERIA

The final NexaStudy application should feel like a real product.

A user should be able to:

Open NexaStudy.
Register/login.
See a useful dashboard.
Create tasks.
Manage notes.
Upload and organize files.
Create calendar events.
Manage subjects.
Track assignments.
Track exams.
Track attendance.
Calculate GPA/CGPA.
Use calculators.
Convert units.
Use file/PDF tools.
Use Pomodoro.
Track study sessions.
Check weather.
View analytics.
Manage profile/settings.
Use favorites/recent activity.
Optionally use AI study assistance.
Use the application on mobile and desktop.

The application must be:

functional + responsive + accessible + secure + maintainable + documented + production-oriented.

Start by inspecting the current workspace and then begin implementation immediately.