# CareerCompass 🧭
### Adaptive Student Strength Analysis and Career Pathway Intelligence Platform

> Evolved and architected from open-source repository **`GapGraph`** (AI-Powered Adaptive Learning), transforming single-stream skill gap analysis into an end-to-end multi-tier educational lifecycle and career intelligence engine.

---

## 🌟 Key Platform Capabilities

### 1. Multi-Tier Educational Lifecycle Architecture
The platform dynamically recalibrates its analysis across three distinct developmental tiers:

- **Tier 1: Class 10 (Stream Selection Engine)**
  - Ingests subject marks: Mathematics, Science (Physics/Chemistry/Biology), English, Social Sciences, Computer/IT.
  - Aptitude & Curiosity Vector Survey (0–100): Abstract Logic, Spatial Reasoning, Biology & Nature, Commerce & Finance, Creative Expression, Social & Public Policy.
  - Recommends optimal streams: **Science PCM**, **Science PCB**, **Commerce & Applied Economics**, and **Arts & Humanities** with fit confidence indices and career horizons.

- **Tier 2: Class 12 (Entrance & Degree Routing)**
  - Ingests academic board transcripts and competitive mock percentiles / ranks:
    - **JEE Main & Advanced** (Engineering / Deep Tech)
    - **NEET UG** (Clinical Medicine & Surgery)
    - **CUET UG** (Central Universities — SRCC, Hindu, BA LLB, Economics)
    - **CLAT** (National Law Universities)
    - **BITSAT & IPMAT**
  - Evaluates admission cutoff bands (**Safe Cutoff**, **Target Range**, **Ambitious Reach**) across premier institutions.

- **Tier 3: Graduation & Higher Ed (Domain & Job Readiness)**
  - Domain specializations: Software & Full-Stack, Cloud & DevOps, AI & Machine Learning, Fintech, Product Management, Corporate Law.
  - **Authentic Artifact Scoring & Public GitHub Repository AST Inspector**:
    - Evaluates code architecture, multi-stage Docker containerization, automated testing coverage (≥ 75%), documentation rigor, and commit cadence.
    - Yields calibrated Job Readiness Index against industry hiring rubrics.

---

### 2. Probabilistic Career Match Engine $P(\text{Career}_i)$
Career matches are computed through a calibrated, temperature-scaled softmax normalization:

$$P(\text{Career}_i) = \frac{\exp(S_i / \tau)}{\sum_j \exp(S_j / \tau)} \times 100$$

Where composite fitness score $S_i$ synthesizes:
- Academic transcript strength ($w_{\text{acad}} = 0.35$)
- Competitive mock exam percentile ($w_{\text{exam}} = 0.25$)
- Applied skills & artifact rubric ($w_{\text{skills}} = 0.20$)
- Aptitude survey cosine similarity ($w_{\text{interest}} = 0.20$)

Ensuring a clean, explainable percentage distribution across candidate career trajectories where $\sum P(\text{Career}_i) = 100\%$.

---

### 3. Responsive Recharts Horizontal Bar Chart
- Renders match probabilities using Recharts `<BarChart layout="vertical">`.
- **Dynamic Cell Coloring**:
  - High Match ($\ge 40\%$): Vibrant Emerald (`#10B981`)
  - Moderate Match ($25-39\%$): Violet (`#8B5CF6`)
  - Exploratory Path ($< 25\%$): Amber (`#F59E0B`)
  - Selected Target: Active Cyan (`#06B6D4`)
- Interactive tooltips display category, market demand, salary benchmarks, cutoff viability, and top profile strengths.
- Clickable bars allow instant switching of the active target career for real-time gap inspection.

---

### 4. 4-Level Cognitive Assessment Framework
Simulates and tracks multi-level evaluations:
- **Level 1 (Diagnostic Baseline CAT):** Computerized Adaptive Testing using Item Response Theory (IRT). Dynamically updates student latent ability $\theta$ after each response and presents calibrated difficulty items.
- **Level 2 (Formative Practice):** Targeted micro-drills on flagged weak topics with graduated cognitive hints (Hint 1 $\rightarrow$ Hint 2 $\rightarrow$ Conceptual Explanation).
- **Level 3 (Summative Competitive Mock):** Timed mock exam simulation with countdown timer, sectional palette, and $+4 / -1$ negative marking penalty.
- **Level 4 (Authentic Artifact Scoring):** Weighted rubric evaluating Architecture (30%), Code Rigor (25%), Documentation (20%), and Problem Complexity (25%).

---

### 5. Adaptive AI Remediation & Micro-Course Generator
- Flagged prerequisite knowledge gaps for any selected career path display:
  - Current Mastery vs. Industry Required Level
  - Severity Badges (`critical`, `medium`, `low`)
  - Estimated hours to bridge
- One-click **"Generate Adaptive AI Remediation Path"** opens a structured 3-phase micro-course outline:
  - **Phase 1: Foundational Bridge & Critical Diagnostics**
  - **Phase 2: Core Engineering & Industry Competencies**
  - **Phase 3: Applied Capstone & Portfolio Artifact**
- Integrated interactive checkpoint challenges and curated video resources with completion progress tracking.

---

## ⚡ Instant Demo Personas
Hackathon evaluators can instantly test any tier with 1 click:
- 👨‍🎓 **Aarav Sharma (Class 10 STEM):** Math 94, Science 92 $\rightarrow$ Science PCM Engineering (38.5% probability).
- 👩‍🎓 **Diya Patel (Class 12 JEE):** JEE 96.4%ile, BITSAT 310 $\rightarrow$ B.Tech CSE & AI (41.2% probability).
- 👨‍💻 **Vikram Malhotra (College Dev):** B.Tech CSE, GitHub microservices repo $\rightarrow$ Full-Stack SDE-1 (42.8% probability).

---

## 🚀 Getting Started

### Prerequisites
- Node.js $\ge 18$ (Tested on Node v24)
- npm or pnpm

### Running Locally
```bash
# Navigate to project directory
cd CareerCompass
# or cd GapGraph/Frontend/gapgraph

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the platform.

### Production Build
```bash
npm run build
npm start
```
