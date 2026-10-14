import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlackRule, CharacterStats, Scenario } from '../types';
import { INITIAL_STATS, MOCK_RULES, MOCK_SCENARIOS } from './mockData';

interface CurriculumProgress {
  id: string;
  title: string;
  subtitle: string;
  progressPercent: number;
}

interface UserStoreState {
  // User Profile & Subscription
  userId: string;
  isPro: boolean;
  streakCount: number;
  xp: number;
  level: number;
  stats: CharacterStats;
  isChallengeCompleted: boolean;

  // Content Data
  rules: BlackRule[];
  scenarios: Scenario[];
  completedRuleIds: string[];
  bookmarkedRuleIds: string[];
  masteredRuleIds: string[];
  completedScenarioIds: string[];
  curriculums: CurriculumProgress[];

  // Search & Filter
  archiveSearch: string;

  // Actions
  setPro: (isPro: boolean) => void;
  toggleChallenge: () => void;
  incrementStreak: () => void;
  toggleBookmark: (ruleId: string) => void;
  toggleMastered: (ruleId: string) => void;
  markRuleComplete: (ruleId: string) => void;
  applyStatDelta: (deltas: Partial<Record<keyof CharacterStats, number>>, xpEarned: number) => void;
  recordScenarioCompletion: (scenarioId: string) => void;
  setArchiveSearch: (search: string) => void;
  resetProgress: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      userId: 'usr_black_rules_shadow',
      isPro: false,
      streakCount: 14,
      xp: 3450,
      level: 3,
      stats: INITIAL_STATS,
      isChallengeCompleted: false,

      rules: MOCK_RULES,
      scenarios: MOCK_SCENARIOS,
      completedRuleIds: ['rule-01'],
      bookmarkedRuleIds: ['rule-02'],
      masteredRuleIds: [],
      completedScenarioIds: [],

      curriculums: [
        {
          id: 'curr-1',
          title: 'Office Politics',
          subtitle: 'Level 4: Hierarchy Deflection',
          progressPercent: 72,
        },
        {
          id: 'curr-2',
          title: 'Emotional Control',
          subtitle: 'Level 2: The Poker Stance',
          progressPercent: 45,
        },
      ],

      archiveSearch: '',

      setPro: (isPro) => set({ isPro }),

      toggleChallenge: () =>
        set((state) => ({ isChallengeCompleted: !state.isChallengeCompleted })),

      incrementStreak: () =>
        set((state) => ({ streakCount: state.streakCount + 1 })),

      toggleBookmark: (ruleId) =>
        set((state) => {
          const exists = state.bookmarkedRuleIds.includes(ruleId);
          return {
            bookmarkedRuleIds: exists
              ? state.bookmarkedRuleIds.filter((id) => id !== ruleId)
              : [...state.bookmarkedRuleIds, ruleId],
          };
        }),

      toggleMastered: (ruleId) =>
        set((state) => {
          const exists = state.masteredRuleIds.includes(ruleId);
          return {
            masteredRuleIds: exists
              ? state.masteredRuleIds.filter((id) => id !== ruleId)
              : [...state.masteredRuleIds, ruleId],
          };
        }),

      markRuleComplete: (ruleId) =>
        set((state) => {
          if (state.completedRuleIds.includes(ruleId)) return state;
          const newXp = state.xp + 40;
          const newLevel = Math.floor(newXp / 1000) + 1;
          return {
            completedRuleIds: [...state.completedRuleIds, ruleId],
            xp: newXp,
            level: newLevel,
          };
        }),

      applyStatDelta: (deltas, xpEarned) =>
        set((state) => {
          const updatedStats = { ...state.stats };
          (Object.keys(deltas) as Array<keyof CharacterStats>).forEach((key) => {
            const delta = deltas[key] ?? 0;
            updatedStats[key] = Math.max(0, Math.min(100, updatedStats[key] + delta));
          });
          const newXp = state.xp + xpEarned;
          const newLevel = Math.floor(newXp / 1000) + 1;
          return {
            stats: updatedStats,
            xp: newXp,
            level: newLevel,
          };
        }),

      recordScenarioCompletion: (scenarioId) =>
        set((state) => {
          if (state.completedScenarioIds.includes(scenarioId)) return state;
          return {
            completedScenarioIds: [...state.completedScenarioIds, scenarioId],
          };
        }),

      setArchiveSearch: (search) => set({ archiveSearch: search }),

      resetProgress: () =>
        set({
          stats: INITIAL_STATS,
          xp: 3450,
          level: 3,
          streakCount: 14,
          isChallengeCompleted: false,
          completedRuleIds: ['rule-01'],
          bookmarkedRuleIds: ['rule-02'],
          masteredRuleIds: [],
          completedScenarioIds: [],
          archiveSearch: '',
        }),
    }),
    {
      name: 'black-rules-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isPro: state.isPro,
        streakCount: state.streakCount,
        xp: state.xp,
        level: state.level,
        stats: state.stats,
        isChallengeCompleted: state.isChallengeCompleted,
        completedRuleIds: state.completedRuleIds,
        bookmarkedRuleIds: state.bookmarkedRuleIds,
        masteredRuleIds: state.masteredRuleIds,
        completedScenarioIds: state.completedScenarioIds,
      }),
    }
  )
);
