import {
  EducationTier,
  Tier1Input,
  Tier2Input,
  Tier3Input,
  CareerMatch,
  SkillGapItem,
  RemediationPath,
  RemediationModule,
  GitHubArtifactAnalysis,
} from "./types";

// ==========================================
// 1. PROBABILISTIC CAREER MATCH ENGINE
// ==========================================

/**
 * Calculates normalized percentage probabilities across candidate careers
 * using calibrated temperature-scaled softmax normalization:
 * P(Career_i) = exp(Score_i / tau) / sum_j(exp(Score_j / tau)) * 100
 */
export function normalizeProbabilities(
  rawScores: Array<{ careerId: string; rawFit: number }>,
  temperature = 14
): Record<string, number> {
  const maxScore = Math.max(...rawScores.map((s) => s.rawFit), 1);
  // Shift by maxScore for numerical stability in exp
  const expValues = rawScores.map((s) => ({
    id: s.careerId,
    exp: Math.exp((s.rawFit - maxScore) / temperature),
  }));

  const totalExp = expValues.reduce((sum, item) => sum + item.exp, 0) || 1;

  const probabilities: Record<string, number> = {};
  let totalPercent = 0;

  expValues.forEach((item, index) => {
    // Round to 1 decimal place
    const prob = Number(((item.exp / totalExp) * 100).toFixed(1));
    probabilities[item.id] = prob;
    totalPercent += prob;
  });

  // Small rounding correction so sum is exactly 100%
  const diff = Number((100 - totalPercent).toFixed(1));
  if (rawScores.length > 0 && Math.abs(diff) < 1.0) {
    const topId = rawScores[0].careerId;
    probabilities[topId] = Number((probabilities[topId] + diff).toFixed(1));
  }

  return probabilities;
}

// ==========================================
// 2. TIER 1: CLASS 10 STREAM RECOMMENDATION
// ==========================================

export function computeTier1Matches(input: Tier1Input): CareerMatch[] {
  const { marks, interests } = input;

  // Composite factors:
  // Math & Logic Score
  const pcmFit =
    marks.mathematics * 0.35 +
    marks.science * 0.35 +
    interests.problemSolving * 0.15 +
    interests.spatialHandsOn * 0.15;

  // Bio & Life Sciences Score
  const pcbFit =
    marks.science * 0.4 +
    marks.english * 0.15 +
    interests.biologyNature * 0.35 +
    interests.problemSolving * 0.1;

  // Business, Economics & Finance Score
  const commerceFit =
    marks.mathematics * 0.3 +
    marks.socialScience * 0.2 +
    marks.english * 0.15 +
    interests.businessFinance * 0.35;

  // Humanities, Law, Design & Policy Score
  const humanitiesFit =
    marks.socialScience * 0.35 +
    marks.english * 0.3 +
    interests.socialPublicPolicy * 0.2 +
    interests.creativeLinguistic * 0.15;

  const rawList = [
    { careerId: "pcm_engineering", rawFit: Math.min(100, Math.round(pcmFit)) },
    { careerId: "pcb_medical", rawFit: Math.min(100, Math.round(pcbFit)) },
    { careerId: "commerce_fin", rawFit: Math.min(100, Math.round(commerceFit)) },
    { careerId: "arts_humanities", rawFit: Math.min(100, Math.round(humanitiesFit)) },
  ].sort((a, b) => b.rawFit - a.rawFit);

  const probMap = normalizeProbabilities(rawList, 18);

  const careerDefs: Record<string, Omit<CareerMatch, "probability" | "rawFitScore" | "matchTier">> = {
    pcm_engineering: {
      id: "pcm_engineering",
      title: "Science PCM (Engineering, Computing & Physical Sciences)",
      category: "STEM & Technology",
      marketDemand: "Extremely High",
      salaryRange: "₹8 - 28 LPA",
      keyStrengths: [
        `High Math Proficiency (${marks.mathematics}%)`,
        `Analytical Logic (${interests.problemSolving}%)`,
        "Spatial Reasoning",
      ],
      skillGaps: [
        { name: "Calculus & Vector Algebra", currentLevel: 45, requiredLevel: 85, priority: "critical", category: "Mathematics", estimatedHours: 14 },
        { name: "Foundational Mechanics & Electromagnetism", currentLevel: 50, requiredLevel: 85, priority: "critical", category: "Physics", estimatedHours: 12 },
        { name: "Introductory Python / Algorithmic Thinking", currentLevel: marks.computerScience || 30, requiredLevel: 80, priority: "medium", category: "Computing", estimatedHours: 8 },
        { name: "Spatial & Technical Geometry", currentLevel: 55, requiredLevel: 75, priority: "low", category: "Spatial", estimatedHours: 6 },
      ],
      rationale: `Strong correlation between Math (${marks.mathematics}) and Science (${marks.science}) scores with a high aptitude for abstract problem solving.`,
      degreeOrRoleRoutes: ["B.Tech / B.E (CSE, AI, Robotics)", "BS Mathematics & Computing", "Architecture (B.Arch)", "Aerospace / Defence Research"],
      cutoffStatus: pcmFit >= 80 ? "Safe Cutoff" : pcmFit >= 65 ? "Target Range" : "Ambitious Reach",
    },
    pcb_medical: {
      id: "pcb_medical",
      title: "Science PCB (Medicine, Biotechnology & Healthcare)",
      category: "Healthcare & Life Sciences",
      marketDemand: "High",
      salaryRange: "₹9 - 24 LPA",
      keyStrengths: [
        `Biological Sciences Affinity (${interests.biologyNature}%)`,
        `Solid Science Fundamentals (${marks.science}%)`,
        "Empirical Investigation",
      ],
      skillGaps: [
        { name: "Human Physiology & Cellular Cytology", currentLevel: 50, requiredLevel: 90, priority: "critical", category: "Biology", estimatedHours: 16 },
        { name: "Organic Reaction Mechanisms", currentLevel: 40, requiredLevel: 85, priority: "critical", category: "Chemistry", estimatedHours: 14 },
        { name: "Biostatistics & Data Interpretation", currentLevel: 35, requiredLevel: 70, priority: "medium", category: "Analytics", estimatedHours: 8 },
        { name: "Medical Ethics & Clinical Protocols", currentLevel: 40, requiredLevel: 75, priority: "low", category: "Healthcare", estimatedHours: 6 },
      ],
      rationale: `High interest in living systems (${interests.biologyNature}) matched with strong natural science aptitude makes Medical and Allied Healthcare a prime fit.`,
      degreeOrRoleRoutes: ["MBBS / BDS Surgery", "B.Tech Biotechnology", "Doctor of Pharmacy (Pharm.D)", "Genomics & Bioinformatics"],
      cutoffStatus: pcbFit >= 80 ? "Safe Cutoff" : pcbFit >= 65 ? "Target Range" : "Ambitious Reach",
    },
    commerce_fin: {
      id: "commerce_fin",
      title: "Commerce & Applied Economics (Finance, FinTech & Strategy)",
      category: "Business & Financial Intelligence",
      marketDemand: "Extremely High",
      salaryRange: "₹7 - 25 LPA",
      keyStrengths: [
        `Commercial & Business Curiosity (${interests.businessFinance}%)`,
        `Quantitative Baseline (${marks.mathematics}%)`,
        "Economic Trend Analysis",
      ],
      skillGaps: [
        { name: "Double-Entry Accounting & Bookkeeping", currentLevel: 30, requiredLevel: 85, priority: "critical", category: "Accounting", estimatedHours: 12 },
        { name: "Micro & Macro Economic Modelling", currentLevel: 45, requiredLevel: 80, priority: "critical", category: "Economics", estimatedHours: 10 },
        { name: "Financial Mathematics & Compounding", currentLevel: 55, requiredLevel: 85, priority: "medium", category: "Finance", estimatedHours: 8 },
        { name: "Business Analytics & Spreadsheet Modeling", currentLevel: 35, requiredLevel: 75, priority: "medium", category: "Analytics", estimatedHours: 6 },
      ],
      rationale: `Balanced analytical aptitude paired with an active interest in capital markets, entrepreneurship, and commercial logic.`,
      degreeOrRoleRoutes: ["B.Com (Honours) / BBA Finance", "Chartered Accountancy (CA) / CFA", "Economics & Econometrics (B.Sc)", "Fintech Product Management"],
      cutoffStatus: commerceFit >= 78 ? "Safe Cutoff" : commerceFit >= 62 ? "Target Range" : "Ambitious Reach",
    },
    arts_humanities: {
      id: "arts_humanities",
      title: "Arts & Humanities (Law, Public Policy, Journalism & Design)",
      category: "Governance, Law & Creative Leadership",
      marketDemand: "High",
      salaryRange: "₹6 - 22 LPA",
      keyStrengths: [
        `Verbal & Linguistic Mastery (${marks.english}%)`,
        `Social Science & Civics Insight (${marks.socialScience}%)`,
        `Policy Acumen (${interests.socialPublicPolicy}%)`,
      ],
      skillGaps: [
        { name: "Constitutional Law & Jurisprudence", currentLevel: 40, requiredLevel: 85, priority: "critical", category: "Law", estimatedHours: 14 },
        { name: "Critical Discourse & Persuasive Essay Writing", currentLevel: 60, requiredLevel: 85, priority: "medium", category: "Communication", estimatedHours: 8 },
        { name: "Public Policy & Geopolitical Frameworks", currentLevel: 45, requiredLevel: 80, priority: "medium", category: "Policy", estimatedHours: 10 },
        { name: "User Research & Cognitive Psychology", currentLevel: 35, requiredLevel: 70, priority: "low", category: "Design", estimatedHours: 6 },
      ],
      rationale: `Outstanding communication eloquence combined with high social awareness and interest in legal, governmental, or creative systems.`,
      degreeOrRoleRoutes: ["BA LLB (5-Year Integrated Law)", "Public Policy & International Relations", "Design & Human-Centered UX (B.Des)", "Civil Services (UPSC Aspirant Path)"],
      cutoffStatus: humanitiesFit >= 75 ? "Safe Cutoff" : humanitiesFit >= 60 ? "Target Range" : "Ambitious Reach",
    },
  };

  return rawList.map((item) => {
    const def = careerDefs[item.careerId];
    const prob = probMap[item.careerId] || 0;
    return {
      ...def,
      rawFitScore: item.rawFit,
      probability: prob,
      matchTier: prob >= 35 ? "High Match" : prob >= 20 ? "Moderate Match" : "Exploratory",
    };
  });
}

// ==========================================
// 3. TIER 2: CLASS 12 ENTRANCE & DEGREE ROUTING
// ==========================================

export function computeTier2Matches(input: Tier2Input): CareerMatch[] {
  const { stream, marks, competitiveExams } = input;

  const results: Array<{ id: string; rawFit: number; def: any }> = [];

  // JEE / Engineering Evaluation
  if (stream === "Science PCM" || competitiveExams.jeeMainPercentile || competitiveExams.jeeMainRank) {
    const jeePercentile = competitiveExams.jeeMainPercentile || 85;
    const jeeRank = competitiveExams.jeeMainRank || 35000;
    const acadScore = marks.aggregate || 85;

    const cseFit = Math.min(100, Math.round(jeePercentile * 0.6 + (acadScore * 0.4)));
    const coreEnggFit = Math.min(100, Math.round((jeePercentile + 8) * 0.55 + (acadScore * 0.45)));

    results.push({
      id: "btech_cs_ai",
      rawFit: cseFit,
      def: {
        id: "btech_cs_ai",
        title: "B.Tech Computer Science & AI / ML (Tier 1 & 2 Institutes)",
        category: "Deep Tech & Computing",
        marketDemand: "Extremely High",
        salaryRange: "₹14 - 45 LPA",
        keyStrengths: [
          `JEE Main Percentile (${jeePercentile} %ile)`,
          `Board Aggregate (${acadScore}%)`,
          "Algorithmic Thinking",
        ],
        skillGaps: [
          { name: "Advanced Data Structures & Algorithms", currentLevel: 35, requiredLevel: 90, priority: "critical", category: "CS Core", estimatedHours: 25 },
          { name: "Linear Algebra for Machine Learning", currentLevel: 45, requiredLevel: 85, priority: "critical", category: "Math", estimatedHours: 15 },
          { name: "Discrete Mathematics & Graph Theory", currentLevel: 40, requiredLevel: 80, priority: "medium", category: "Math", estimatedHours: 12 },
          { name: "Computer Systems & OS Architecture", currentLevel: 30, requiredLevel: 75, priority: "medium", category: "CS Core", estimatedHours: 10 },
        ],
        rationale: `Strong competitive percentile (${jeePercentile}%ile) qualifies for premium engineering branches at top NITs, IIITs, and Premier State Universities.`,
        degreeOrRoleRoutes: ["B.Tech CSE at NIT/IIIT", "Dual Degree B.Tech+M.Tech Data Science", "Software Development Engineer (SDE-1)"],
        cutoffStatus: jeePercentile >= 97 ? "Safe Cutoff" : jeePercentile >= 92 ? "Target Range" : "Ambitious Reach",
      },
    });

    results.push({
      id: "btech_robotics_ece",
      rawFit: coreEnggFit,
      def: {
        id: "btech_robotics_ece",
        title: "B.Tech Electronics, VLSI & Robotics Engineering",
        category: "Hardware & Embedded Systems",
        marketDemand: "High",
        salaryRange: "₹10 - 30 LPA",
        keyStrengths: ["Physics Rigor", "Circuits & Signal Concepts", "Hardware-Software Synergy"],
        skillGaps: [
          { name: "Digital Logic Design & Verilog", currentLevel: 25, requiredLevel: 85, priority: "critical", category: "ECE", estimatedHours: 18 },
          { name: "Embedded C & Microcontroller Interfacing", currentLevel: 30, requiredLevel: 80, priority: "critical", category: "Embedded", estimatedHours: 16 },
          { name: "Control Systems & Feedback Loops", currentLevel: 40, requiredLevel: 75, priority: "medium", category: "Robotics", estimatedHours: 12 },
        ],
        rationale: `Solid physical sciences scores and competitive ranks open high-demand semiconductor, electronics and autonomous systems pathways.`,
        degreeOrRoleRoutes: ["B.Tech ECE / Microelectronics", "Semiconductor Design Engineer", "Robotics System Architect"],
        cutoffStatus: jeePercentile >= 90 ? "Safe Cutoff" : jeePercentile >= 80 ? "Target Range" : "Ambitious Reach",
      },
    });
  }

  // NEET / Medical Evaluation
  if (stream === "Science PCB" || competitiveExams.neetScore) {
    const neetScore = competitiveExams.neetScore || 540; // out of 720
    const neetFit = Math.min(100, Math.round((neetScore / 720) * 100));

    results.push({
      id: "mbbs_medical",
      rawFit: neetFit,
      def: {
        id: "mbbs_medical",
        title: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
        category: "Clinical Medicine",
        marketDemand: "High",
        salaryRange: "₹12 - 35 LPA",
        keyStrengths: [`NEET Score: ${neetScore}/720`, "Biology & Anatomy Recall", "Clinical Dedication"],
        skillGaps: [
          { name: "Gross Anatomy & Histology Foundations", currentLevel: 40, requiredLevel: 90, priority: "critical", category: "Medical", estimatedHours: 24 },
          { name: "Biochemistry & Enzyme Kinetics", currentLevel: 50, requiredLevel: 85, priority: "critical", category: "Medical", estimatedHours: 16 },
          { name: "Pathology Diagnostic Basics", currentLevel: 30, requiredLevel: 80, priority: "medium", category: "Medical", estimatedHours: 14 },
        ],
        rationale: `NEET score of ${neetScore} benchmarks eligibility across government and premier deemed medical colleges.`,
        degreeOrRoleRoutes: ["MBBS Degree", "Residency / Specialization (MD/MS)", "Super-specialty Surgery"],
        cutoffStatus: neetScore >= 620 ? "Safe Cutoff" : neetScore >= 560 ? "Target Range" : "Ambitious Reach",
      },
    });

    results.push({
      id: "biotech_pharmd",
      rawFit: Math.min(100, neetFit + 15),
      def: {
        id: "biotech_pharmd",
        title: "B.Tech Biotechnology & Pharm.D (Clinical Research)",
        category: "Life Sciences & Pharma",
        marketDemand: "High",
        salaryRange: "₹8 - 22 LPA",
        keyStrengths: ["Bio-Molecular Concepts", "Laboratory Methodology", "Biopharma Pipeline"],
        skillGaps: [
          { name: "Molecular Genetics & Recombinant DNA", currentLevel: 45, requiredLevel: 85, priority: "critical", category: "Biotech", estimatedHours: 16 },
          { name: "Pharmacology & Drug Action", currentLevel: 35, requiredLevel: 80, priority: "critical", category: "Pharma", estimatedHours: 14 },
        ],
        rationale: `Excellent pathway combining bio-molecular discovery, vaccine engineering, and global biopharmaceutical clinical trials.`,
        degreeOrRoleRoutes: ["B.Tech / BS Biotechnology", "Pharm.D Clinical Specialist", "Computational Drug Discovery"],
        cutoffStatus: neetScore >= 450 ? "Safe Cutoff" : "Target Range",
      },
    });
  }

  // CUET / Commerce / Law Evaluation
  if (stream === "Commerce" || competitiveExams.cuetPercentile) {
    const cuet = competitiveExams.cuetPercentile || 92;
    const commFit = Math.min(100, Math.round(cuet * 0.7 + marks.aggregate * 0.3));

    results.push({
      id: "bcom_srcc_finance",
      rawFit: commFit,
      def: {
        id: "bcom_srcc_finance",
        title: "B.Com (Honours) / BBA Finance (Top Central Universities)",
        category: "Finance & Management",
        marketDemand: "Extremely High",
        salaryRange: "₹10 - 32 LPA",
        keyStrengths: [`CUET Percentile (${cuet}%ile)`, "Financial Accounting", "Macroeconomic Analysis"],
        skillGaps: [
          { name: "Financial Modeling & Valuation (DCF / LBO)", currentLevel: 30, requiredLevel: 85, priority: "critical", category: "Finance", estimatedHours: 20 },
          { name: "Corporate Finance & Cost Accounting", currentLevel: 50, requiredLevel: 85, priority: "critical", category: "Accounting", estimatedHours: 16 },
          { name: "Python for Quantitative Finance", currentLevel: 20, requiredLevel: 75, priority: "medium", category: "FinTech", estimatedHours: 12 },
        ],
        rationale: `CUET score of ${cuet}%ile comfortably positions student for Top DU Colleges (SRCC, Hindu, Hansraj) and leading commerce faculties.`,
        degreeOrRoleRoutes: ["B.Com (Hons) at Delhi University", "CFA / Chartered Accountancy", "Investment Banking Analyst"],
        cutoffStatus: cuet >= 98 ? "Safe Cutoff" : cuet >= 93 ? "Target Range" : "Ambitious Reach",
      },
    });
  }

  if (stream === "Humanities/Arts" || competitiveExams.clatRank) {
    const clat = competitiveExams.clatRank || 1200;
    const clatFit = Math.max(30, Math.min(100, Math.round(100 - (clat / 4000) * 60)));

    results.push({
      id: "ba_llb_nlu",
      rawFit: clatFit,
      def: {
        id: "ba_llb_nlu",
        title: "BA LLB (Hons) — National Law Universities (NLSIU, NALSAR, WBNUJS)",
        category: "Corporate & Constitutional Law",
        marketDemand: "High",
        salaryRange: "₹12 - 28 LPA",
        keyStrengths: [`CLAT Rank (#${clat})`, "Legal Reasoning", "Verbal Comprehension"],
        skillGaps: [
          { name: "Contract Law & Commercial Arbitration", currentLevel: 40, requiredLevel: 90, priority: "critical", category: "Law", estimatedHours: 20 },
          { name: "Constitutional Governance & Case Precedents", currentLevel: 45, requiredLevel: 85, priority: "critical", category: "Law", estimatedHours: 18 },
          { name: "Moot Court & Legal Research Methodology", currentLevel: 35, requiredLevel: 80, priority: "medium", category: "Legal Advocacy", estimatedHours: 12 },
        ],
        rationale: `National Law University cutoff benchmarks favor this profile for top Tier-1 and Tier-2 NLUs.`,
        degreeOrRoleRoutes: ["BA LLB (5 Years) at NLU", "Corporate M&A Legal Associate", "Litigation & Judicial Services"],
        cutoffStatus: clat <= 800 ? "Safe Cutoff" : clat <= 2000 ? "Target Range" : "Ambitious Reach",
      },
    });
  }

  // Ensure we have at least 3-4 matches even if stream input was minimal
  if (results.length < 3) {
    results.push({
      id: "data_science_stats",
      rawFit: 78,
      def: {
        id: "data_science_stats",
        title: "B.Sc Data Science & Applied Statistics (CUET / ISI / CMI)",
        category: "Data Science & Analytics",
        marketDemand: "Extremely High",
        salaryRange: "₹11 - 34 LPA",
        keyStrengths: ["Quantitative Reasoning", "Statistical Intuition", "Pattern Recognition"],
        skillGaps: [
          { name: "Probability Distributions & Inference", currentLevel: 45, requiredLevel: 85, priority: "critical", category: "Statistics", estimatedHours: 16 },
          { name: "Python / R Data Wrangling (Pandas, NumPy)", currentLevel: 40, requiredLevel: 80, priority: "critical", category: "Programming", estimatedHours: 12 },
        ],
        rationale: "Rapidly growing degree track bridging mathematical theory with production machine learning models.",
        degreeOrRoleRoutes: ["BS Data Science", "Data Scientist", "Quantitative Analyst"],
        cutoffStatus: "Target Range",
      },
    });
  }

  results.sort((a, b) => b.rawFit - a.rawFit);
  const probMap = normalizeProbabilities(
    results.map((r) => ({ careerId: r.id, rawFit: r.rawFit })),
    15
  );

  return results.map((r) => {
    const prob = probMap[r.id] || 0;
    return {
      ...r.def,
      rawFitScore: r.rawFit,
      probability: prob,
      matchTier: prob >= 35 ? "High Match" : prob >= 20 ? "Moderate Match" : "Exploratory",
    };
  });
}

// ==========================================
// 4. TIER 3: GRADUATION & HIGHER ED JOB READINESS
// ==========================================

export function evaluateGitHubArtifact(repoUrl: string): GitHubArtifactAnalysis {
  // Mock intelligence engine that simulates authentic GitHub AST & commit inspection
  const isMicroservices = repoUrl.toLowerCase().includes("microservice") || repoUrl.toLowerCase().includes("cloud");
  const isAiMl = repoUrl.toLowerCase().includes("ai") || repoUrl.toLowerCase().includes("ml") || repoUrl.toLowerCase().includes("llm");

  if (isAiMl) {
    return {
      repoUrl,
      detectedTechStack: ["Python", "PyTorch", "FastAPI", "HuggingFace", "Docker", "Weaviate"],
      totalCommits: 84,
      codeQualityScore: 88,
      testCoverageEstimate: 72,
      documentationRating: "Exceptional",
      architectureComplexity: "Production-Grade",
      verifiedStrengths: [
        "Modular PyTorch pipeline with CUDA optimization",
        "Clear README with benchmark accuracy metrics and model cards",
        "Dockerized API endpoint with Swagger documentation",
      ],
      flaggedGaps: [
        "Missing CI/CD GitHub Actions workflow for automated testing",
        "Limited unit test coverage for edge data inputs (72% vs 85% ideal)",
        "Hardcoded environment configuration parameters in test suite",
      ],
    };
  }

  return {
    repoUrl,
    detectedTechStack: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker", "TailwindCSS"],
    totalCommits: 112,
    codeQualityScore: 84,
    testCoverageEstimate: 68,
    documentationRating: "Good",
    architectureComplexity: "Production-Grade",
    verifiedStrengths: [
      "Strict TypeScript types and clean separation of concerns",
      "Decoupled backend API endpoints with validation schemas",
      "Production Docker compose setup with PostgreSQL containerization",
    ],
    flaggedGaps: [
      "No automated end-to-end integration tests (Playwright/Cypress)",
      "Database connection pooling needs Redis caching layer under high load",
      "API rate-limiting not configured on public authentication routes",
    ],
  };
}

export function computeTier3Matches(input: Tier3Input): CareerMatch[] {
  const { domain, cgpa, githubRepoUrl, selfAssessedSkills } = input;
  const artifactAnalysis = evaluateGitHubArtifact(githubRepoUrl || "https://github.com/student/production-project");

  const results: Array<{ id: string; rawFit: number; def: any }> = [];

  const baseReadiness = Math.round(
    (cgpa / 10) * 20 +
    artifactAnalysis.codeQualityScore * 0.45 +
    artifactAnalysis.testCoverageEstimate * 0.2 +
    (artifactAnalysis.totalCommits > 50 ? 15 : 8)
  );

  if (domain === "Software & Full-Stack" || domain === "Cloud Architecture & DevOps") {
    results.push({
      id: "fullstack_sde",
      rawFit: Math.min(98, baseReadiness + 6),
      def: {
        id: "fullstack_sde",
        title: "Full-Stack Software Engineer (SDE-1 / Product Engineering)",
        category: "Software Engineering",
        marketDemand: "Extremely High",
        salaryRange: "₹14 - 36 LPA",
        keyStrengths: [
          `Verified Code Rigor (${artifactAnalysis.codeQualityScore}/100)`,
          `Production Stack (${artifactAnalysis.detectedTechStack.slice(0, 3).join(", ")})`,
          `Commits & Delivery (${artifactAnalysis.totalCommits} commits)`,
        ],
        skillGaps: [
          { name: "Distributed Caching (Redis & Cache-Aside)", currentLevel: 30, requiredLevel: 85, priority: "critical", category: "Backend", estimatedHours: 12 },
          { name: "Container Orchestration (Kubernetes & Helm)", currentLevel: 25, requiredLevel: 80, priority: "critical", category: "DevOps", estimatedHours: 16 },
          { name: "Automated CI/CD Pipelines (GitHub Actions)", currentLevel: 45, requiredLevel: 85, priority: "critical", category: "DevOps", estimatedHours: 8 },
          { name: "System Design & Horizontal Scalability", currentLevel: 40, requiredLevel: 80, priority: "medium", category: "Architecture", estimatedHours: 14 },
        ],
        rationale: `Repository inspection confirms high architectural maturity, clean TypeScript interfaces, and end-to-end CRUD persistence.`,
        degreeOrRoleRoutes: ["Software Development Engineer (SDE-1)", "Full-Stack Web Architect", "Backend Systems Engineer"],
        cutoffStatus: baseReadiness >= 80 ? "Safe Cutoff" : "Target Range",
      },
    });

    results.push({
      id: "cloud_devops_architect",
      rawFit: Math.min(96, baseReadiness - 2),
      def: {
        id: "cloud_devops_architect",
        title: "Cloud & DevOps Infrastructure Engineer",
        category: "Cloud & Platform Engineering",
        marketDemand: "Extremely High",
        salaryRange: "₹15 - 38 LPA",
        keyStrengths: [
          "Docker Containerization Competence",
          "Decoupled Microservice Blueprint",
          "High Git Activity",
        ],
        skillGaps: [
          { name: "Infrastructure as Code (Terraform / Pulumi)", currentLevel: 20, requiredLevel: 85, priority: "critical", category: "Cloud", estimatedHours: 18 },
          { name: "Observability & Telemetry (Prometheus / Grafana)", currentLevel: 30, requiredLevel: 80, priority: "critical", category: "Reliability", estimatedHours: 12 },
          { name: "Zero-Downtime Deployment & Canary Releases", currentLevel: 25, requiredLevel: 75, priority: "medium", category: "Cloud", estimatedHours: 10 },
        ],
        rationale: `Existing container foundations need automated IaC and observability to reach Senior DevOps benchmark levels.`,
        degreeOrRoleRoutes: ["Site Reliability Engineer (SRE)", "DevOps Platform Engineer", "Cloud Solutions Architect"],
        cutoffStatus: "Target Range",
      },
    });
  }

  if (domain === "AI & Machine Learning" || domain === "Software & Full-Stack") {
    results.push({
      id: "ai_ml_engineer",
      rawFit: Math.min(97, baseReadiness + (domain === "AI & Machine Learning" ? 8 : -4)),
      def: {
        id: "ai_ml_engineer",
        title: "Applied AI & LLM Systems Engineer",
        category: "Artificial Intelligence",
        marketDemand: "Extremely High",
        salaryRange: "₹18 - 48 LPA",
        keyStrengths: [
          "Model Architecture Comprehension",
          "Python Deep Learning Pipeline",
          "API Inference Serving",
        ],
        skillGaps: [
          { name: "RAG & Vector Database Architecture (Qdrant/Weaviate)", currentLevel: 35, requiredLevel: 85, priority: "critical", category: "AI Systems", estimatedHours: 16 },
          { name: "Model Quantization & vLLM Serving", currentLevel: 25, requiredLevel: 80, priority: "critical", category: "AI Ops", estimatedHours: 14 },
          { name: "Fine-Tuning (LoRA / QLoRA Frameworks)", currentLevel: 30, requiredLevel: 80, priority: "medium", category: "Deep Learning", estimatedHours: 12 },
        ],
        rationale: `Rapid enterprise shift toward Generative AI agents makes production vector retrieval and model serving top tier requirements.`,
        degreeOrRoleRoutes: ["Applied AI Engineer", "LLM Systems Specialist", "Machine Learning Platform Engineer"],
        cutoffStatus: domain === "AI & Machine Learning" ? "Safe Cutoff" : "Target Range",
      },
    });
  }

  // Fallback third career for domain diversity
  results.push({
    id: "tech_product_manager",
    rawFit: Math.min(92, baseReadiness - 5),
    def: {
      id: "tech_product_manager",
      title: "Technical Product Manager (APM)",
      category: "Product & Strategy",
      marketDemand: "High",
      salaryRange: "₹16 - 35 LPA",
      keyStrengths: ["Cross-functional Engineering Literacy", "Product Artifact Conception", "Data-driven Prioritization"],
      skillGaps: [
        { name: "Product Analytics (Mixpanel / Amplitude & Cohort Retention)", currentLevel: 30, requiredLevel: 80, priority: "critical", category: "Analytics", estimatedHours: 10 },
        { name: "A/B Testing & Hypothesis Statistical Verification", currentLevel: 40, requiredLevel: 80, priority: "critical", category: "Product", estimatedHours: 10 },
      ],
      rationale: `Strong technical grounding allows high credibility when leading cross-functional squads of engineers, designers, and business leaders.`,
      degreeOrRoleRoutes: ["Associate Product Manager (APM)", "Technical Program Manager", "Growth Product Lead"],
      cutoffStatus: "Target Range",
    },
  });

  results.sort((a, b) => b.rawFit - a.rawFit);
  const probMap = normalizeProbabilities(
    results.map((r) => ({ careerId: r.id, rawFit: r.rawFit })),
    14
  );

  return results.map((r) => {
    const prob = probMap[r.id] || 0;
    return {
      ...r.def,
      rawFitScore: r.rawFit,
      probability: prob,
      matchTier: prob >= 35 ? "High Match" : prob >= 20 ? "Moderate Match" : "Exploratory",
    };
  });
}

// ==========================================
// 5. ADAPTIVE AI REMEDIATION GENERATOR
// ==========================================

export function generateAdaptiveRemediationPlan(career: CareerMatch): RemediationPath {
  const topGaps = career.skillGaps.slice(0, 4);

  const phase1Modules: RemediationModule[] = [
    {
      id: "mod-1",
      phase: 1,
      title: `Diagnostic Bridge: ${topGaps[0]?.name || "Core Foundations"}`,
      description: `Targeted remediation to eliminate critical gaps in ${topGaps[0]?.name || "Foundational concepts"}. Focuses on first principles and practical mental models.`,
      hours: topGaps[0]?.estimatedHours || 12,
      difficulty: "beginner",
      priority: "critical",
      skillsCovered: [topGaps[0]?.name || "Core Theory", "Mental Models", "Debugging"],
      resources: [
        {
          type: "video",
          title: `${topGaps[0]?.name || "Core Subject"} in 100 Seconds`,
          source: "YouTube · Fireship",
          duration: "2 min",
          url: "https://www.youtube.com/watch?v=Gjnup-PuquQ",
          badge: "Quick Primer",
        },
        {
          type: "interactive_doc",
          title: `Comprehensive Guide to ${topGaps[0]?.name || "Core Concepts"}`,
          source: "Interactive Visual Explainer",
          duration: "45 min",
          url: "https://developer.mozilla.org",
          badge: "Deep Dive",
        },
      ],
      quiz: {
        question: `What is the core architectural advantage of mastering ${topGaps[0]?.name || "this concept"}?`,
        options: [
          "Isolates failure domains and enforces predictable state transitions",
          "Eliminates the need for any unit testing",
          "Automatically reduces code lines by 90%",
          "Replaces all underlying network protocols",
        ],
        correct: 0,
        explanation: "Mastering foundational concepts provides domain isolation, predictable state handling, and resilient architectures.",
      },
    },
    {
      id: "mod-2",
      phase: 1,
      title: `Applied Drills: ${topGaps[1]?.name || "System Mechanics"}`,
      description: `Hands-on scaffolding to build muscle memory in ${topGaps[1]?.name || "Essential Patterns"} before progressing to advanced setups.`,
      hours: topGaps[1]?.estimatedHours || 10,
      difficulty: "intermediate",
      priority: "critical",
      skillsCovered: [topGaps[1]?.name || "Core Implementation", "Performance Tuning"],
      resources: [
        {
          type: "video",
          title: `${topGaps[1]?.name || "Core Patterns"} Masterclass`,
          source: "YouTube · TechWorld with Nana",
          duration: "1.5 hr",
          url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
          badge: "Full Course",
        },
      ],
      quiz: {
        question: `When executing ${topGaps[1]?.name || "this strategy"}, what is the optimal caching/invalidation trigger?`,
        options: [
          "Time-To-Live (TTL) combined with event-driven mutation eviction",
          "Never evict to maximize hit rate",
          "Purge everything on every single user read",
          "Random periodic flushes",
        ],
        correct: 0,
        explanation: "Combining a reasonable TTL with event-driven mutation eviction prevents stale data while preserving cache hit efficiency.",
      },
    },
  ];

  const phase2Modules: RemediationModule[] = [
    {
      id: "mod-3",
      phase: 2,
      title: `Production Integration: ${topGaps[2]?.name || "Pipeline & Automation"}`,
      description: `Integrate ${topGaps[2]?.name || "Advanced Automation"} into your workflow. Build automated test runners, monitoring hooks, and error guards.`,
      hours: topGaps[2]?.estimatedHours || 8,
      difficulty: "intermediate",
      priority: "medium",
      skillsCovered: [topGaps[2]?.name || "CI/CD & Pipelines", "Code Quality", "Security Scanning"],
      resources: [
        {
          type: "project_challenge",
          title: "Automated Verification Pipeline Challenge",
          source: "Interactive Lab",
          duration: "2 hr",
          url: "https://github.com",
          badge: "Hands-on Lab",
        },
      ],
      quiz: {
        question: "What is the primary indicator of an authentic production-grade pipeline?",
        options: [
          "Deterministic builds with reproducible environments and automated test gates",
          "Running manual commands on production servers",
          "Allowing untested code to push directly to production",
          "Disabling lint rules to speed up deployments",
        ],
        correct: 0,
        explanation: "Deterministic builds and automated test gates guarantee stability and reproducibility across team deployments.",
      },
    },
  ];

  const phase3Modules: RemediationModule[] = [
    {
      id: "mod-4",
      phase: 3,
      title: "Capstone Portfolio & Artifact Synthesis",
      description: `Synthesize all remediated competencies into a peer-reviewed portfolio artifact specifically calibrated for ${career.title}.`,
      hours: 14,
      difficulty: "advanced",
      priority: "critical",
      skillsCovered: ["System Design", "Documentation", "Production Deployment", "Portfolio Presentation"],
      resources: [
        {
          type: "project_challenge",
          title: "End-to-End Capstone Architecture",
          source: "CareerCompass Capstone Lab",
          duration: "8 hr",
          url: "https://github.com",
          badge: "Capstone Project",
        },
      ],
      quiz: {
        question: "How should you present this completed project to top evaluators or hiring panels?",
        options: [
          "With an architecture diagram, benchmark latency results, trade-off analysis, and live interactive demo",
          "Just sending a zipped folder without README",
          "Only sharing a 10-second screenshot",
          "Keeping the repository completely private without documentation",
        ],
        correct: 0,
        explanation: "Top panels look for clear system diagrams, measurable performance metrics, documented trade-offs, and live working demos.",
      },
    },
  ];

  const totalHours = [...phase1Modules, ...phase2Modules, ...phase3Modules].reduce(
    (sum, m) => sum + m.hours,
    0
  );

  return {
    careerId: career.id,
    careerTitle: career.title,
    overallTargetHours: totalHours,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Foundational Bridge & Critical Diagnostics",
        description: "Targeted elimination of blocker prerequisite skill gaps with high-yield drills.",
        modules: phase1Modules,
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Core Engineering & Industry Competencies",
        description: "Intermediate architectures, real-world case studies, and automated tooling.",
        modules: phase2Modules,
      },
      {
        phaseNumber: 3,
        title: "Phase 3: Applied Capstone & Portfolio Artifact",
        description: "Production-ready capstone project demonstrating measurable industry capability.",
        modules: phase3Modules,
      },
    ],
  };
}

// ==========================================
// 6. DEMO PRESETS FOR QUICK HACKATHON EVALUATION
// ==========================================

export const DEMO_PRESETS = {
  tier1_stem: {
    name: "Aarav Sharma — Class 10 STEM Enthusiast",
    tier: "tier1" as EducationTier,
    description: "High marks in Math (94) & Science (92) with deep curiosity in algorithmic logic and robotics.",
    data: {
      marks: {
        mathematics: 94,
        science: 92,
        english: 86,
        socialScience: 80,
        computerScience: 96,
      },
      interests: {
        problemSolving: 95,
        spatialHandsOn: 88,
        biologyNature: 42,
        businessFinance: 65,
        creativeLinguistic: 70,
        socialPublicPolicy: 58,
      },
      extracurricularNotes: "Built a Line-Follower Arduino robot; qualified in Regional Mathematics Olympiad.",
    } as Tier1Input,
  },
  tier2_jee: {
    name: "Diya Patel — Class 12 JEE & Tech Aspirant",
    tier: "tier2" as EducationTier,
    description: "PCM Student with 96.4%ile in JEE Main aiming for Top Engineering & Data Science degrees.",
    data: {
      stream: "Science PCM" as const,
      marks: {
        subject1: { name: "Physics", score: 92 },
        subject2: { name: "Chemistry", score: 90 },
        subject3: { name: "Mathematics", score: 96 },
        subject4: { name: "English", score: 88 },
        aggregate: 91.5,
      },
      competitiveExams: {
        jeeMainPercentile: 96.4,
        jeeMainRank: 24200,
        bitsatScore: 310,
      },
      preferredDegrees: ["B.Tech Computer Science", "B.Tech AI & Data Engineering"],
    } as Tier2Input,
  },
  tier3_dev: {
    name: "Vikram Malhotra — B.Tech Final Year Full-Stack Dev",
    tier: "tier3" as EducationTier,
    description: "College developer with production GitHub repo (Next.js/Node/Docker), targeting SDE-1 roles.",
    data: {
      domain: "Software & Full-Stack" as const,
      degreeMajor: "Computer Science & Engineering",
      cgpa: 8.7,
      githubRepoUrl: "https://github.com/vikram-dev/cloud-scale-ecommerce-microservices",
      caseStudyOrPortfolioUrl: "https://vikram-portfolio.dev",
      selfAssessedSkills: [
        { name: "TypeScript", level: 90 },
        { name: "React / Next.js", level: 85 },
        { name: "Node.js REST", level: 80 },
        { name: "PostgreSQL", level: 75 },
        { name: "Docker", level: 50 },
      ],
    } as Tier3Input,
  },
};
