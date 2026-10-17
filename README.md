# CareerCompass 🧭
### AI-Powered Adaptive Learning & Career Pathway Intelligence Platform

CareerCompass is an end-to-end adaptive career diagnostic and personalized learning engine designed to analyze student competencies, detect critical knowledge and skill gaps, and dynamically generate high-precision career trajectories and micro-learning roadmaps.

---

## 🌟 Key Platform Capabilities

### 1. Intelligent Skill Diagnostics & Gap Analysis
- **Resume & Profile Extraction**: Extracts and scores candidate competencies across both technical and domain frameworks.
- **Dynamic Skill Level Mapping**: Evaluates current proficiency against industry benchmarks and target role expectations.
- **Priority-Weighted Gap Detection**: Classifies gaps into `Critical`, `Medium`, and `Optional` priority tiers with estimated remediation hours.

### 2. Adaptive Learning Roadmaps & Remediation
- **Multi-Phase Structured Curriculum**: Generates personalized learning paths with phase-by-phase milestones.
- **Dynamic Module Decomposition**: Provides focused lessons, key topics, and practical applied projects.
- **Curated Video & Resource Recommendations**: Integrates targeted external tutorials and reference material.

### 3. Comprehensive Analytics & Reporting
- **Competency Radar**: Multi-axis radar visualization comparing current skill level against industry target requirements.
- **Skill Coverage Breakdown**: Visual doughnut charts reflecting overall role readiness percentage.
- **Readiness Probability Gauge**: Real-time calculated hiring readiness index.

---

## 🏗️ Architecture & Technology Stack

### Frontend Client (`Frontend/gapgraph`)
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS, Manrope & DM Mono Typography, Dark Theme
- **Data Visualization**: Chart.js & React-Chartjs-2
- **Animations**: Framer Motion

### Backend Engine (`backend`)
- **Runtime**: Node.js + Fastify (High-performance async server)
- **Database & ORM**: PostgreSQL with Prisma ORM
- **AI & LLM Services**:
  - Groq AI (Llama 3 inference engine for high-speed diagnostic synthesis)
  - LangChain Core & OpenSSL-compliant secure agents
  - Diagnostic, Planner, Critic, and Verification micro-services
- **Containerization**: Docker Compose for PostgreSQL database orchestration

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ or v20+)
- **npm** or **pnpm**
- **Docker** (optional, for local PostgreSQL container)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your GROQ_API_KEY and DATABASE_URL

# Generate Prisma Client & push schema (if DB is running)
npm run prisma:generate
npm run prisma:push

# Run the backend dev server
npm run dev
```
The backend API starts on **http://localhost:3001**.

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd Frontend/gapgraph

# Install dependencies
npm install

# Setup local environment
cp .env.example .env.local

# Run the frontend dev server
npm run dev
```
Open **http://localhost:3000** in your browser to launch CareerCompass.

---

## 📁 Repository Structure

```
CareerCompass/
├── Frontend/
│   ├── App Designs/          # UI mockups, Obsidian design specs, & screenshots
│   └── gapgraph/             # Next.js 16 frontend application
│       ├── public/           # Static assets & icons
│       └── src/
│           ├── app/          # App router pages (dashboard, roadmap, profile, etc.)
│           ├── components/   # UI components (Navbar, Footer, Toast, etc.)
│           └── lib/          # State context, sample datasets, and roadmap generators
├── backend/                  # Fastify + Prisma AI backend engine
│   ├── prisma/               # Database schema & seeders
│   └── src/
│       ├── data/             # SOC taxonomy, catalog, and benchmark datasets
│       ├── services/         # AI diagnostic, planner, critic, and verification services
│       └── server.ts         # Fastify API entry point
├── docker-compose.yml        # PostgreSQL container configuration
├── env.example               # Root environment variables reference
└── README.md                 # Project documentation
```

---

## 📄 License
MIT License. © CareerCompass AI. Precision in Growth.