"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import {
  EducationTier,
  Tier1Input,
  Tier2Input,
  Tier3Input,
  CareerMatch,
  RemediationPath,
} from "./types";
import {
  computeTier1Matches,
  computeTier2Matches,
  computeTier3Matches,
  generateAdaptiveRemediationPlan,
  DEMO_PRESETS,
} from "./careerEngine";

interface AppContextType {
  // Legacy / Base fields
  completedModules: Set<number | string>;
  toggleModule: (id: number | string) => void;
  overallProgress: number;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  uploadedFiles: { resume: File | null; jd: File | null };
  setUploadedFiles: (files: { resume: File | null; jd: File | null }) => void;
  isLoggedIn: boolean;
  userProfile: { name: string; email: string; role: string; id?: string } | null;
  login: (profile: { name: string; email: string; role: string; id?: string }) => void;
  logout: () => void;
  analysisResult: any;
  setAnalysisResult: (result: any) => void;

  // New Multi-Tier Lifecycle & Intelligence Features
  currentTier: EducationTier;
  setCurrentTier: (tier: EducationTier) => void;
  tier1Data: Tier1Input;
  setTier1Data: React.Dispatch<React.SetStateAction<Tier1Input>>;
  tier2Data: Tier2Input;
  setTier2Data: React.Dispatch<React.SetStateAction<Tier2Input>>;
  tier3Data: Tier3Input;
  setTier3Data: React.Dispatch<React.SetStateAction<Tier3Input>>;

  // Career Probability Engine Outputs
  careerMatches: CareerMatch[];
  selectedCareerMatch: CareerMatch | null;
  setSelectedCareerMatch: (career: CareerMatch | null) => void;
  remediationPlan: RemediationPath | null;
  generateRemediationForCareer: (career: CareerMatch) => void;
  recalculatePathway: () => void;

  // Demo Preset Loader
  loadPreset: (presetKey: keyof typeof DEMO_PRESETS) => void;
  activePresetName: string | null;

  // Assessment State
  assessmentProgress: {
    catAbilityTheta: number; // IRT theta
    catQuestionsCompleted: number;
    formativeCompleted: number;
    mockExamScore: number;
    artifactScore: number;
  };
  updateAssessmentProgress: (key: string, value: number) => void;
}

const defaultTier1: Tier1Input = DEMO_PRESETS.tier1_stem.data;
const defaultTier2: Tier2Input = DEMO_PRESETS.tier2_jee.data;
const defaultTier3: Tier3Input = DEMO_PRESETS.tier3_dev.data;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [completedModules, setCompletedModules] = useState<Set<number | string>>(new Set());
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [uploadedFiles, setUploadedFiles] = useState<{ resume: File | null; jd: File | null }>({
    resume: null,
    jd: null,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default logged in for hackathon MVP ease of use
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role: string; id?: string } | null>({
    name: "Aarav Sharma",
    email: "aarav.sharma@edtech.io",
    role: "Student (Class 10 STEM Aspirant)",
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Lifecycle Tier & Student Profile Data
  const [currentTier, setCurrentTierState] = useState<EducationTier>("tier1");
  const [tier1Data, setTier1Data] = useState<Tier1Input>(defaultTier1);
  const [tier2Data, setTier2Data] = useState<Tier2Input>(defaultTier2);
  const [tier3Data, setTier3Data] = useState<Tier3Input>(defaultTier3);
  const [activePresetName, setActivePresetName] = useState<string | null>("Aarav Sharma (Class 10 STEM)");

  // Career Probability Matches
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);
  const [selectedCareerMatch, setSelectedCareerMatch] = useState<CareerMatch | null>(null);
  const [remediationPlan, setRemediationPlan] = useState<RemediationPath | null>(null);

  // Assessment Progress State
  const [assessmentProgress, setAssessmentProgress] = useState({
    catAbilityTheta: 0.85,
    catQuestionsCompleted: 3,
    formativeCompleted: 2,
    mockExamScore: 168,
    artifactScore: 84,
  });

  const updateAssessmentProgress = (key: string, value: number) => {
    setAssessmentProgress((prev) => ({ ...prev, [key]: value }));
  };

  // Recalculate Career Matches based on active tier
  const recalculatePathway = useCallback(() => {
    let matches: CareerMatch[] = [];
    if (currentTier === "tier1") {
      matches = computeTier1Matches(tier1Data);
    } else if (currentTier === "tier2") {
      matches = computeTier2Matches(tier2Data);
    } else {
      matches = computeTier3Matches(tier3Data);
    }
    setCareerMatches(matches);
    if (matches.length > 0) {
      setSelectedCareerMatch(matches[0]);
      const initialPlan = generateAdaptiveRemediationPlan(matches[0]);
      setRemediationPlan(initialPlan);
    }
  }, [currentTier, tier1Data, tier2Data, tier3Data]);

  const setCurrentTier = (tier: EducationTier) => {
    setCurrentTierState(tier);
    if (tier === "tier1") {
      setUserProfile((prev) => ({
        name: prev?.name || "Aarav Sharma",
        email: prev?.email || "aarav@edtech.io",
        role: "Class 10 Student (Stream Selection)",
      }));
    } else if (tier === "tier2") {
      setUserProfile((prev) => ({
        name: prev?.name || "Diya Patel",
        email: prev?.email || "diya@edtech.io",
        role: "Class 12 Student (Entrance & Degree Routing)",
      }));
    } else {
      setUserProfile((prev) => ({
        name: prev?.name || "Vikram Malhotra",
        email: prev?.email || "vikram@edtech.io",
        role: "Higher Ed Student (Job Readiness & Artifacts)",
      }));
    }
  };

  // Preset Switcher
  const loadPreset = (presetKey: keyof typeof DEMO_PRESETS) => {
    const preset = DEMO_PRESETS[presetKey];
    if (!preset) return;

    setCurrentTierState(preset.tier);
    setActivePresetName(preset.name);
    setUserProfile({
      name: preset.name.split("—")[0].trim(),
      email: `${preset.tier}@careercompass.io`,
      role: preset.description,
    });

    if (preset.tier === "tier1") {
      setTier1Data(preset.data as Tier1Input);
      const matches = computeTier1Matches(preset.data as Tier1Input);
      setCareerMatches(matches);
      if (matches[0]) {
        setSelectedCareerMatch(matches[0]);
        setRemediationPlan(generateAdaptiveRemediationPlan(matches[0]));
      }
    } else if (preset.tier === "tier2") {
      setTier2Data(preset.data as Tier2Input);
      const matches = computeTier2Matches(preset.data as Tier2Input);
      setCareerMatches(matches);
      if (matches[0]) {
        setSelectedCareerMatch(matches[0]);
        setRemediationPlan(generateAdaptiveRemediationPlan(matches[0]));
      }
    } else {
      setTier3Data(preset.data as Tier3Input);
      const matches = computeTier3Matches(preset.data as Tier3Input);
      setCareerMatches(matches);
      if (matches[0]) {
        setSelectedCareerMatch(matches[0]);
        setRemediationPlan(generateAdaptiveRemediationPlan(matches[0]));
      }
    }
  };

  // Generate Remediation for a specific chosen career
  const generateRemediationForCareer = (career: CareerMatch) => {
    setSelectedCareerMatch(career);
    const plan = generateAdaptiveRemediationPlan(career);
    setRemediationPlan(plan);
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedLogin = localStorage.getItem("gg_isLoggedIn");
      if (storedLogin) setIsLoggedIn(JSON.parse(storedLogin));

      const storedProfile = localStorage.getItem("gg_userProfile");
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));

      const storedTier = localStorage.getItem("gg_currentTier") as EducationTier;
      if (storedTier) setCurrentTierState(storedTier);

      const storedModules = localStorage.getItem("gg_completedModules");
      if (storedModules) setCompletedModules(new Set(JSON.parse(storedModules)));
    } catch (e) {
      console.error("Error loading state from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  // Compute initial pathway on mount or tier change
  useEffect(() => {
    recalculatePathway();
  }, [recalculatePathway]);

  // Save state to localStorage on changes
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("gg_isLoggedIn", JSON.stringify(isLoggedIn));
    localStorage.setItem("gg_currentTier", currentTier);
    if (userProfile) {
      localStorage.setItem("gg_userProfile", JSON.stringify(userProfile));
    }
    localStorage.setItem("gg_completedModules", JSON.stringify(Array.from(completedModules)));
  }, [isLoggedIn, userProfile, currentTier, completedModules, isInitialized]);

  const totalModules = remediationPlan
    ? remediationPlan.phases.reduce((sum, p) => sum + p.modules.length, 0)
    : 4;
  const overallProgress = Math.round(
    (completedModules.size / Math.max(1, totalModules)) * 100
  );

  const toggleModule = useCallback((id: number | string) => {
    setCompletedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const login = (profile: { name: string; email: string; role: string; id?: string }) => {
    setIsLoggedIn(true);
    setUserProfile(profile);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setCompletedModules(new Set());
    setAnalysisResult(null);
  };

  return (
    <AppContext.Provider
      value={{
        completedModules,
        toggleModule,
        overallProgress,
        selectedRole,
        setSelectedRole,
        uploadedFiles,
        setUploadedFiles,
        isLoggedIn,
        userProfile,
        login,
        logout,
        analysisResult,
        setAnalysisResult,
        currentTier,
        setCurrentTier,
        tier1Data,
        setTier1Data,
        tier2Data,
        setTier2Data,
        tier3Data,
        setTier3Data,
        careerMatches,
        selectedCareerMatch,
        setSelectedCareerMatch,
        remediationPlan,
        generateRemediationForCareer,
        recalculatePathway,
        loadPreset,
        activePresetName,
        assessmentProgress,
        updateAssessmentProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
