import { z } from 'zod';

/**
 * 5 Core Character Defense Traits
 */
export const CharacterStatsSchema = z.object({
  stoicism: z.number().min(0).max(100),
  persuasion: z.number().min(0).max(100),
  assertiveness: z.number().min(0).max(100),
  awareness: z.number().min(0).max(100),
  negotiation: z.number().min(0).max(100),
});

export type CharacterStats = z.infer<typeof CharacterStatsSchema>;

/**
 * Black Rule Codex Structure
 */
export interface BlackRule {
  id: string;
  number: number;
  lawCode: string; // e.g. "LAW #01"
  title: string;
  category: 'Defense' | 'Influence' | 'Power' | 'Deception' | 'Mastery';
  quote: string;
  premise: string;
  psychologicalTrap: string;
  executionTactic: string;
  reversal: string;
  isPro: boolean;
}

/**
 * Interactive Arena Scenario Node & Choices
 */
export interface ScenarioChoice {
  id: string;
  label: string;
  description: string;
  consequence: string;
  statImpacts: Partial<Record<keyof CharacterStats, number>>;
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
  code: string; // e.g. "SIM-01"
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
  completedScenarioIds: string[];
}
