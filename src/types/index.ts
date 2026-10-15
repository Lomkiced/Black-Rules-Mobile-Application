import { z } from 'zod';

/**
 * 5 Core Character Defense Traits
 */
export type TraitKey = 'stoicism' | 'persuasion' | 'assertiveness' | 'awareness' | 'negotiation';

export const CharacterStatsSchema = z.object({
  stoicism: z.number().min(0).max(100),
  persuasion: z.number().min(0).max(100),
  assertiveness: z.number().min(0).max(100),
  awareness: z.number().min(0).max(100),
  negotiation: z.number().min(0).max(100),
});

export type CharacterStats = Record<TraitKey, number>;

/**
 * Black Rule Codex Structure (Sprint 2 Specification)
 */
export interface BlackRule {
  id: string;
  number: string;
  category: string;
  subtitle: string;
  title: string;
  summary: string;
  impactScore: string;
  studyTime: string;
  isPro: boolean;
  lawBullets: string[];
  psychBullets: string[];
  defenseBullets: string[];
  scenarioTag: string;
  quote: string;
  author: string;
  audioDuration: string;
  imageUrl: string;
}

/**
 * Arena Tactical Options & Scenario Structure
 */
export interface ArenaOption {
  id: 'A' | 'B' | 'C';
  label: string;
  riskTag: string;
  isRecommended?: boolean;
  ruleTag?: string;
  quote: string;
  tacticalEffect: string;
  forecast: string;
  expReward: number;
  traitDeltas: Partial<Record<TraitKey, number>>;
}

export interface ArenaScenario {
  id: string;
  roomNumber: string;
  title: string;
  difficulty: string;
  stars: number;
  contextTag: string;
  narrative: string;
  question: string;
  stakeholders: string;
  isPro?: boolean;
  options: ArenaOption[];
}

/**
 * Curriculum / Bento Category Structure
 */
export interface Curriculum {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  icon: string;
  totalRules: number;
  defaultRuleId: string;
  isPro: boolean;
}

/**
 * Legacy Scenario Node Support (Backwards Compatibility)
 */
export interface ScenarioChoice {
  id: string;
  label: string;
  description: string;
  consequence: string;
  statImpacts: Partial<Record<TraitKey, number>>;
  xpReward: number;
  isOptimal: boolean;
  nextNodeId?: string;
}

export interface ScenarioNode {
  id: string;
  title: string;
  character: string;
  dialogue: string;
  context: string;
  trapWarning?: string;
  choices: ScenarioChoice[];
}

export interface Scenario {
  id: string;
  code: string;
  title: string;
  category: string;
  difficulty: 'Novice' | 'Calculated' | 'Ruthless';
  initialNodeId: string;
  nodes: Record<string, ScenarioNode>;
  isPro: boolean;
}

/**
 * User State & Subscription
 */
export interface UserState {
  userId: string;
  isPro: boolean;
  streakCount: number;
  lastActiveDate: string;
  xp: number;
  level: number;
  stats: CharacterStats;
  completedRuleIds: string[];
  bookmarkedRuleIds: string[];
  masteredRuleIds: string[];
  completedScenarioIds: string[];
  freeAdvisorUsesLeft: number;
}
