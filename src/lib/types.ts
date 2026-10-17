export type EducationTier = "tier1" | "tier2" | "tier3";

// Tier 1: Class 10 (Stream Selection)
export interface Tier1Marks {
  mathematics: number;
  science: number; // Physics/Chem/Bio composite
  english: number;
  socialScience: number;
  computerScience: number;
}

export interface Tier1Interests {
  problemSolving: number; // 0-100 (Quantitative & Logic)
  spatialHandsOn: number; // 0-100 (Building, spatial, mechanics)
  biologyNature: number; // 0-100 (Living systems, medicine, anatomy)
  businessFinance: number; // 0-100 (Markets, commerce, numbers)
  creativeLinguistic: number; // 0-100 (Writing, arts, communication)
  socialPublicPolicy: number; // 0-100 (Law, governance, societal issues)
}

export interface Tier1Input {
  marks: Tier1Marks;
  interests: Tier1Interests;
  extracurricularNotes?: string;
}

// Tier 2: Class 12 (Entrance & Degree Routing)
export type Stream12 = "Science PCM" | "Science PCB" | "Commerce" | "Humanities/Arts";

export interface Tier2Marks {
  subject1: { name: string; score: number };
  subject2: { name: string; score: number };
  subject3: { name: string; score: number };
  subject4: { name: string; score: number };
  aggregate: number;
}

export interface CompetitiveExams {
  jeeMainRank?: number;
  jeeMainPercentile?: number;
  jeeAdvancedRank?: number;
  neetScore?: number;
  neetPercentile?: number;
  cuetPercentile?: number;
  clatRank?: number;
  bitsatScore?: number;
  ipmatScore?: number;
}

export interface Tier2Input {
  stream: Stream12;
  marks: Tier2Marks;
  competitiveExams: CompetitiveExams;
  preferredDegrees?: string[];
}

// Tier 3: Graduation & Higher Ed (Domain & Job Readiness)
export type DomainCategory =
  | "Software & Full-Stack"
  | "Cloud Architecture & DevOps"
  | "AI & Machine Learning"
  | "Fintech & Quantitative Finance"
  | "Product Management & UI/UX"
  | "Corporate Law & Compliance";

export interface GitHubArtifactAnalysis {
  repoUrl: string;
  detectedTechStack: string[];
  totalCommits: number;
  codeQualityScore: number; // 0-100
  testCoverageEstimate: number; // 0-100
  documentationRating: "Exceptional" | "Good" | "Needs Improvement";
  architectureComplexity: "Production-Grade" | "Intermediate" | "Basic Script";
  verifiedStrengths: string[];
  flaggedGaps: string[];
}

export interface Tier3Input {
  domain: DomainCategory;
  degreeMajor: string;
  cgpa: number;
  githubRepoUrl: string;
  caseStudyOrPortfolioUrl?: string;
  selfAssessedSkills: Array<{ name: string; level: number }>;
}

// Probabilistic Career Match
export interface SkillGapItem {
  name: string;
  currentLevel: number; // 0-100
  requiredLevel: number; // 0-100
  priority: "critical" | "medium" | "low";
  category: string;
  estimatedHours: number;
}

export interface CareerMatch {
  id: string;
  title: string;
  category: string;
  probability: number; // 0-100, normalized probability
  rawFitScore: number; // 0-100
  marketDemand: "Extremely High" | "High" | "Stable" | "Emerging";
  salaryRange: string;
  matchTier: "High Match" | "Moderate Match" | "Exploratory";
  keyStrengths: string[];
  skillGaps: SkillGapItem[];
  rationale: string;
  degreeOrRoleRoutes: string[];
  cutoffStatus?: "Safe Cutoff" | "Target Range" | "Ambitious Reach";
}

// Micro-Course & Remediation
export interface RemediationResource {
  type: "video" | "interactive_doc" | "project_challenge";
  title: string;
  source: string;
  duration: string;
  url: string;
  badge?: string;
}

export interface RemediationModule {
  id: string | number;
  phase: number;
  title: string;
  description: string;
  hours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  priority: "critical" | "medium" | "low";
  skillsCovered: string[];
  resources: RemediationResource[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

export interface RemediationPath {
  careerId: string;
  careerTitle: string;
  overallTargetHours: number;
  phases: Array<{
    phaseNumber: number;
    title: string;
    description: string;
    modules: RemediationModule[];
  }>;
}

// Assessment Framework Types
export type AssessmentLevel = "cat" | "formative" | "mock" | "artifact";

export interface CatQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: number; // 0.1 to 1.0 (IRT difficulty b)
  domain: string;
  explanation: string;
}

export interface FormativeItem {
  id: string;
  concept: string;
  question: string;
  hints: string[];
  options: string[];
  correct: number;
  explanation: string;
}

export interface MockExamQuestion {
  id: string;
  section: string;
  question: string;
  options: string[];
  correct: number;
  marksPositive: number;
  marksNegative: number;
}

export interface ArtifactScoringRubric {
  architectureScore: number; // /30
  codeQualityScore: number; // /25
  documentationScore: number; // /20
  complexityScore: number; // /25
  compositeScore: number; // /100
  feedback: string[];
  recommendations: string[];
}
