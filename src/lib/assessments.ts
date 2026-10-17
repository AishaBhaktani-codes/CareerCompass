import { CatQuestion, FormativeItem, MockExamQuestion, ArtifactScoringRubric } from "./types";

// ========================================================
// LEVEL 1: DIAGNOSTIC BASELINE CAT (Computerized Adaptive Testing)
// ========================================================

export const CAT_QUESTION_BANK: CatQuestion[] = [
  {
    id: "cat-1",
    question: "If f(x) = x³ - 3x + 2, at what values of x does the function attain local extrema?",
    options: ["x = -1 and x = 1", "x = 0 and x = 2", "x = -2 and x = 1", "x = 3 and x = -3"],
    correct: 0,
    difficulty: 0.4, // Baseline introductory-intermediate
    domain: "Calculus & Optimization",
    explanation: "Differentiating: f'(x) = 3x² - 3 = 3(x² - 1) = 0 => x = ±1. Checking second derivative confirms extrema at x = ±1.",
  },
  {
    id: "cat-2",
    question: "What is the tightest time complexity to find the median of two sorted arrays of sizes m and n?",
    options: ["O(log(min(m, n)))", "O(m + n)", "O(m * n)", "O(log m * log n)"],
    correct: 0,
    difficulty: 0.8, // High difficulty (IRT b = 0.8)
    domain: "Algorithmic Complexity",
    explanation: "Using binary search partitioning across the smaller array allows finding the combined median in O(log(min(m, n))) time.",
  },
  {
    id: "cat-3",
    question: "Which data structure is fundamentally required to implement Dijkstra's algorithm with O((V + E) log V) complexity?",
    options: ["Min-Heap / Priority Queue", "Circular Linked List", "Disjoint Set Union (DSU)", "Breadth-First Queue"],
    correct: 0,
    difficulty: 0.6, // Medium difficulty (IRT b = 0.6)
    domain: "Graph Theory",
    explanation: "A Min-Heap or Fibonacci Heap enables O(log V) extract-min operations, yielding O((V + E) log V) overall complexity.",
  },
  {
    id: "cat-4",
    question: "In relational database ACID properties, which component guarantees transactions survive sudden power loss?",
    options: ["Durability (via Write-Ahead Logging)", "Atomicity (via undo logs)", "Isolation (via MVCC / 2PL)", "Consistency (via foreign keys)"],
    correct: 0,
    difficulty: 0.5,
    domain: "Database Systems",
    explanation: "Durability guarantees that committed state is persisted to non-volatile storage, typically using Write-Ahead Logging (WAL).",
  },
  {
    id: "cat-5",
    question: "According to the CAP Theorem, in the event of an unavoidable network partition (P), a distributed system MUST choose between:",
    options: ["Consistency and Availability", "Throughput and Latency", "Durability and Atomicity", "Security and Scalability"],
    correct: 0,
    difficulty: 0.7,
    domain: "Distributed Systems",
    explanation: "When network partition P occurs, the system can either provide accurate consistent data (CP) or remain available to all nodes (AP).",
  },
  {
    id: "cat-6",
    question: "What is the primary role of a reverse proxy in modern microservice architectures?",
    options: ["Load balancing, SSL termination, and routing client traffic", "Compiling TypeScript into WebAssembly", "Managing database schema migrations", "Encrypting memory caches"],
    correct: 0,
    difficulty: 0.3, // Lower baseline
    domain: "System Architecture",
    explanation: "A reverse proxy acts as an intermediary gateway, handling client TLS termination, load distribution, and security filtering.",
  },
];

export function calculateUpdatedTheta(currentTheta: number, difficulty: number, isCorrect: boolean): number {
  // Logistic IRT update
  const pCorrect = 1 / (1 + Math.exp(-(currentTheta - difficulty * 2)));
  const learningRate = 0.45;
  const delta = isCorrect ? learningRate * (1 - pCorrect) : -learningRate * pCorrect;
  const newTheta = Math.max(-2, Math.min(2, currentTheta + delta));
  return Number(newTheta.toFixed(2));
}

// ========================================================
// LEVEL 2: FORMATIVE PRACTICE WITH SCAFFOLDED HINTS
// ========================================================

export const FORMATIVE_PRACTICE_ITEMS: FormativeItem[] = [
  {
    id: "form-1",
    concept: "Distributed Cache-Aside Pattern",
    question: "You need to reduce database read load by 80% on a hot user profile endpoint. What is the standard flow of Cache-Aside?",
    hints: [
      "Hint 1: Think about whether the application talks to the cache first or the database.",
      "Hint 2: On a cache miss, who is responsible for querying the database and repopulating the cache?",
      "Hint 3: In Cache-Aside (Lazy Loading), the application checks cache -> on miss, reads DB -> writes to cache -> returns data.",
    ],
    options: [
      "App reads cache; on miss, reads DB, writes result to cache, and returns",
      "DB automatically writes to cache before saving to disk",
      "Client browser polls the cache server directly via WebSocket",
      "App writes exclusively to cache and lets cache flush to DB once a week",
    ],
    correct: 0,
    explanation: "In Cache-Aside (Lazy Loading), the application orchestrates checking cache first. On miss, it fetches from the DB and writes back to cache with a designated TTL.",
  },
  {
    id: "form-2",
    concept: "Database Indexing & B-Trees",
    question: "Why does a composite index on (tenant_id, created_at) NOT accelerate a query that filters ONLY by created_at?",
    hints: [
      "Hint 1: Recall the 'Leftmost Prefix' rule in B-Tree indexes.",
      "Hint 2: An encyclopedia sorted by (Author, Title) cannot be efficiently scanned by Title alone.",
      "Hint 3: B-Trees sort first by the leading column. Skipping the first column forces a full index or table scan.",
    ],
    options: [
      "The B-tree index is sorted primarily by tenant_id (Leftmost Prefix Rule)",
      "Created_at timestamps are encrypted in storage",
      "Composite indexes can only hold text strings",
      "PostgreSQL disables indexes on queries with date filters",
    ],
    correct: 0,
    explanation: "B-Tree composite indexes require the leftmost column(s) to traverse the tree hierarchy. Filtering on a subsequent column violates the prefix requirement.",
  },
];

// ========================================================
// LEVEL 3: SUMMATIVE COMPETITIVE MOCK EXAM
// ========================================================

export const SUMMATIVE_MOCK_QUESTIONS: MockExamQuestion[] = [
  {
    id: "mock-1",
    section: "Quantitative Reasoning & Math",
    question: "A fair 6-sided die is rolled 4 times. What is the probability of obtaining at least one 6?",
    options: ["1 - (5/6)⁴ ≈ 51.8%", "(1/6)⁴ ≈ 0.08%", "4 * (1/6) ≈ 66.7%", "1/2 = 50.0%"],
    correct: 0,
    marksPositive: 4,
    marksNegative: 1,
  },
  {
    id: "mock-2",
    section: "Physical Sciences / Engineering Aptitude",
    question: "In an RLC series circuit at resonance frequency, which statement regarding impedance is correct?",
    options: ["Impedance is strictly minimum and purely resistive (Z = R)", "Impedance is infinite", "Inductive reactance exceeds capacitive reactance", "Phase angle between voltage and current is 90°"],
    correct: 0,
    marksPositive: 4,
    marksNegative: 1,
  },
  {
    id: "mock-3",
    section: "Systems & Computational Logic",
    question: "Which synchronization primitive prevents race conditions by allowing only one thread into a critical section?",
    options: ["Mutex (Mutual Exclusion Lock)", "Spin Barrier", "Counting Semaphore set to 10", "Thread Pool"],
    correct: 0,
    marksPositive: 4,
    marksNegative: 1,
  },
];

// ========================================================
// LEVEL 4: AUTHENTIC ARTIFACT SCORING RUBRIC
// ========================================================

export function scoreAuthenticArtifact(
  repoUrl: string,
  hasDocker: boolean,
  hasTests: boolean,
  hasReadme: boolean,
  commitCount: number
): ArtifactScoringRubric {
  const architectureScore = hasDocker ? 28 : 18; // /30
  const codeQualityScore = hasTests ? 23 : 15; // /25
  const documentationScore = hasReadme ? 19 : 10; // /20
  const complexityScore = commitCount > 40 ? 24 : 16; // /25

  const compositeScore = architectureScore + codeQualityScore + documentationScore + complexityScore;

  const feedback: string[] = [];
  const recommendations: string[] = [];

  if (hasDocker) {
    feedback.push("Containerized Environment: Dockerfile & compose manifests promote reproducible builds.");
  } else {
    recommendations.push("Add a multi-stage Dockerfile to containerize your application for production deployment.");
  }

  if (hasTests) {
    feedback.push("Automated Testing Suite: Unit and integration tests verify core business logic.");
  } else {
    recommendations.push("Implement automated test coverage (aim for ≥ 75%) with Vitest / Jest to validate critical API contracts.");
  }

  if (hasReadme) {
    feedback.push("Clear Technical Documentation: Includes architecture diagram, setup steps, and environment flags.");
  } else {
    recommendations.push("Enrich README with architecture diagrams, API request/response samples, and benchmark metrics.");
  }

  if (commitCount > 40) {
    feedback.push("Consistent Delivery Cadence: Healthy commit frequency showing iterative problem-solving.");
  } else {
    recommendations.push("Demonstrate continuous atomic commits following Conventional Commits (feat:, fix:, chore:).");
  }

  return {
    architectureScore,
    codeQualityScore,
    documentationScore,
    complexityScore,
    compositeScore,
    feedback,
    recommendations,
  };
}
