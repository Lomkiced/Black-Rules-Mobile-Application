import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlackRule, CharacterStats, ArenaScenario, Curriculum, TraitKey } from '../types';
import { INITIAL_STATS, BLACK_RULES, ARENA_SCENARIOS, CURRICULUMS } from './mockData';

interface UserStoreState {
  // User Profile & Metrics
  userId: string;
  isPro: boolean;
  streak: number;
  streakCount: number; // alias
  xp: number;
  levelTier: string;
  scenariosWon: number;
  stats: CharacterStats;
  isChallengeCompleted: boolean;
  freeAdvisorUsesLeft: number;

  // Content Data
  rules: BlackRule[];
  scenarios: ArenaScenario[];
  curriculums: Curriculum[];
  completedRuleIds: string[];
  bookmarkedRuleIds: string[];
  masteredRuleIds: string[];
  completedScenarioIds: string[];

  // Search & Filter
  archiveSearch: string;

  // Onboarding & Auth Lifecycle
  hasSeenIntro: boolean;
  isAuthenticated: boolean;
  hasCompletedDiagnostic: boolean;
  operativeName: string;
  operativeEmail: string;

  // Daily Focus & Preferences
  selectedFocus: 'boundaries' | 'negotiation' | 'calm' | 'presence';
  hapticsEnabled: boolean;
  reminderTime: string;

  // Hydration & Toast Engine
  hasHydrated: boolean;
  currentDrillIndex: number;
  lastToastMessage: string | null;

  // Actions
  setSelectedFocus: (focus: 'boundaries' | 'negotiation' | 'calm' | 'presence') => void;
  toggleHaptics: () => void;
  cycleReminderTime: () => void;
  setHasHydrated: (hydrated: boolean) => void;
  updateOperativeName: (name: string) => void;
  nextDailyDrill: () => void;
  clearToast: () => void;
  setToast: (msg: string) => void;
  completeIntro: () => void;
  loginOperative: (email?: string, name?: string) => void;
  completeDiagnostic: (calibratedStats?: Partial<Record<TraitKey, number>>) => void;
  logoutAndResetFlow: () => void;
  setPro: (isPro: boolean) => void;
  toggleChallenge: () => void;
  incrementStreak: () => void;
  toggleBookmarkedRule: (ruleId: string) => void;
  toggleMasteredRule: (ruleId: string) => void;
  completeArenaScenario: (
    scenarioId: string,
    expReward: number,
    traitDeltas: Partial<Record<TraitKey, number>>
  ) => void;
  useAdvisorCredit: () => void;
  setArchiveSearch: (search: string) => void;
  resetProgress: () => void;

  // Backwards-compatible aliases
  toggleBookmark: (ruleId: string) => void;
  toggleMastered: (ruleId: string) => void;
  markRuleComplete: (ruleId: string) => void;
  applyStatDelta: (deltas: Partial<Record<TraitKey, number>>, xpEarned: number) => void;
  recordScenarioCompletion: (scenarioId: string) => void;
}

const computeLevelTier = (xp: number): string => {
  if (xp >= 5000) return 'Tier V: Grand Sovereign';
  if (xp >= 4000) return 'Tier IV: Master Architect';
  if (xp >= 3000) return 'Tier III: Tactician';
  if (xp >= 2000) return 'Tier II: Operative';
  return 'Tier I: Initiate';
};

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      userId: 'usr_black_rules_shadow',
      isPro: false,
      streak: 14,
      streakCount: 14,
      xp: 3450,
      levelTier: 'Tier III: Tactician',
      scenariosWon: 42,
      stats: INITIAL_STATS,
      isChallengeCompleted: false,
      freeAdvisorUsesLeft: 1,

      hasSeenIntro: false,
      isAuthenticated: false,
      hasCompletedDiagnostic: false,
      operativeName: 'Elena Vance',
      operativeEmail: 'strategist@blackrules.io',
      selectedFocus: 'calm',
      hapticsEnabled: true,
      reminderTime: '8:00 AM',

      hasHydrated: false,
      currentDrillIndex: 0,
      lastToastMessage: null,

      rules: BLACK_RULES,
      scenarios: ARENA_SCENARIOS,
      curriculums: CURRICULUMS,
      completedRuleIds: ['01'],
      bookmarkedRuleIds: ['01', '03'],
      masteredRuleIds: ['01'],
      completedScenarioIds: [],

      archiveSearch: '',

      setSelectedFocus: (focus) => set({ selectedFocus: focus }),
      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
      cycleReminderTime: () =>
        set((state) => {
          const times = ['8:00 AM', '12:00 PM', '8:00 PM', 'Off'];
          const currentIdx = times.indexOf(state.reminderTime);
          const nextIdx = (currentIdx + 1) % times.length;
          return { reminderTime: times[nextIdx] };
        }),

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      updateOperativeName: (name) => set({ operativeName: name }),

      completeIntro: () => set({ hasSeenIntro: true }),

      loginOperative: (email, name) =>
        set((state) => ({
          isAuthenticated: true,
          operativeEmail: email || state.operativeEmail,
          operativeName: name || state.operativeName,
        })),

      completeDiagnostic: (calibratedStats) =>
        set((state) => {
          if (!calibratedStats) {
            return { hasCompletedDiagnostic: true };
          }
          const updatedStats = { ...state.stats };
          (Object.keys(calibratedStats) as TraitKey[]).forEach((key) => {
            const delta = calibratedStats[key] ?? 0;
            updatedStats[key] = Math.max(10, Math.min(100, updatedStats[key] + delta));
          });
          return {
            stats: updatedStats,
            hasCompletedDiagnostic: true,
          };
        }),

      logoutAndResetFlow: () =>
        set({
          hasSeenIntro: false,
          isAuthenticated: false,
          hasCompletedDiagnostic: false,
        }),

      setPro: (isPro) => set({ isPro }),

      toggleChallenge: () =>
        set((state) => {
          const willComplete = !state.isChallengeCompleted;
          if (willComplete) {
            const newXp = state.xp + 20;
            const newStreak = state.streak + 1;
            const updatedStats = {
              ...state.stats,
              stoicism: Math.min(100, state.stats.stoicism + 1),
            };
            return {
              isChallengeCompleted: true,
              streak: newStreak,
              streakCount: newStreak,
              xp: newXp,
              levelTier: computeLevelTier(newXp),
              stats: updatedStats,
              lastToastMessage: 'HABIT COMPLETED // +20 EXP • SELF-CONTROL +1',
            };
          } else {
            return { isChallengeCompleted: false };
          }
        }),

      nextDailyDrill: () =>
        set((state) => ({
          currentDrillIndex: (state.currentDrillIndex + 1) % 7,
          isChallengeCompleted: false,
        })),

      clearToast: () => set({ lastToastMessage: null }),
      setToast: (msg) => set({ lastToastMessage: msg }),

      incrementStreak: () =>
        set((state) => ({
          streak: state.streak + 1,
          streakCount: state.streakCount + 1,
        })),

      toggleBookmarkedRule: (ruleId) =>
        set((state) => {
          const cleanId = ruleId.replace('rule-', '');
          const exists = state.bookmarkedRuleIds.includes(cleanId);
          const updated = exists
            ? state.bookmarkedRuleIds.filter((id) => id !== cleanId)
            : [...state.bookmarkedRuleIds, cleanId];
          return { bookmarkedRuleIds: updated };
        }),

      toggleMasteredRule: (ruleId) =>
        set((state) => {
          const cleanId = ruleId.replace('rule-', '');
          const isCurrentlyMastered = state.masteredRuleIds.includes(cleanId);
          if (isCurrentlyMastered) {
            return {
              masteredRuleIds: state.masteredRuleIds.filter((id) => id !== cleanId),
            };
          } else {
            const newXp = state.xp + 25;
            const updatedStats = {
              ...state.stats,
              awareness: Math.min(100, state.stats.awareness + 1),
              stoicism: Math.min(100, state.stats.stoicism + 1),
            };
            return {
              masteredRuleIds: [...state.masteredRuleIds, cleanId],
              xp: newXp,
              levelTier: computeLevelTier(newXp),
              stats: updatedStats,
            };
          }
        }),

      completeArenaScenario: (scenarioId, expReward, traitDeltas) =>
        set((state) => {
          const updatedStats = { ...state.stats };
          (Object.keys(traitDeltas) as TraitKey[]).forEach((key) => {
            const delta = traitDeltas[key] ?? 0;
            updatedStats[key] = Math.max(10, Math.min(100, updatedStats[key] + delta));
          });

          const newXp = state.xp + expReward;
          const completedScenarios = state.completedScenarioIds.includes(scenarioId)
            ? state.completedScenarioIds
            : [...state.completedScenarioIds, scenarioId];

          return {
            xp: newXp,
            levelTier: computeLevelTier(newXp),
            scenariosWon: state.scenariosWon + 1,
            stats: updatedStats,
            completedScenarioIds: completedScenarios,
          };
        }),

      useAdvisorCredit: () =>
        set((state) => ({
          freeAdvisorUsesLeft: state.isPro
            ? state.freeAdvisorUsesLeft
            : Math.max(0, state.freeAdvisorUsesLeft - 1),
        })),

      setArchiveSearch: (search) => set({ archiveSearch: search }),

      resetProgress: () =>
        set({
          stats: INITIAL_STATS,
          xp: 3450,
          levelTier: 'Tier III: Tactician',
          streak: 14,
          streakCount: 14,
          scenariosWon: 42,
          isChallengeCompleted: false,
          freeAdvisorUsesLeft: 1,
          completedRuleIds: ['12'],
          bookmarkedRuleIds: ['08'],
          masteredRuleIds: ['12', '19'],
          completedScenarioIds: [],
          archiveSearch: '',
        }),

      // Aliases
      toggleBookmark: (ruleId) => {
        const cleanId = ruleId.replace('rule-', '');
        set((state) => ({
          bookmarkedRuleIds: state.bookmarkedRuleIds.includes(cleanId)
            ? state.bookmarkedRuleIds.filter((id) => id !== cleanId)
            : [...state.bookmarkedRuleIds, cleanId],
        }));
      },

      toggleMastered: (ruleId) => {
        const cleanId = ruleId.replace('rule-', '');
        set((state) => {
          const exists = state.masteredRuleIds.includes(cleanId);
          return {
            masteredRuleIds: exists
              ? state.masteredRuleIds.filter((id) => id !== cleanId)
              : [...state.masteredRuleIds, cleanId],
          };
        });
      },

      markRuleComplete: (ruleId) => {
        const cleanId = ruleId.replace('rule-', '');
        set((state) => ({
          completedRuleIds: state.completedRuleIds.includes(cleanId)
            ? state.completedRuleIds
            : [...state.completedRuleIds, cleanId],
        }));
      },

      applyStatDelta: (deltas, xpEarned) =>
        set((state) => {
          const updatedStats = { ...state.stats };
          (Object.keys(deltas) as TraitKey[]).forEach((key) => {
            const delta = deltas[key] ?? 0;
            updatedStats[key] = Math.max(10, Math.min(100, updatedStats[key] + delta));
          });
          const newXp = state.xp + xpEarned;
          return {
            stats: updatedStats,
            xp: newXp,
            levelTier: computeLevelTier(newXp),
          };
        }),

      recordScenarioCompletion: (scenarioId) =>
        set((state) => ({
          completedScenarioIds: state.completedScenarioIds.includes(scenarioId)
            ? state.completedScenarioIds
            : [...state.completedScenarioIds, scenarioId],
        })),
    }),
    {
      name: 'black-rules-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        isPro: state.isPro,
        hasSeenIntro: state.hasSeenIntro,
        isAuthenticated: state.isAuthenticated,
        hasCompletedDiagnostic: state.hasCompletedDiagnostic,
        operativeName: state.operativeName,
        operativeEmail: state.operativeEmail,
        currentDrillIndex: state.currentDrillIndex,
        streak: state.streak,
        streakCount: state.streakCount,
        xp: state.xp,
        levelTier: state.levelTier,
        scenariosWon: state.scenariosWon,
        stats: state.stats,
        isChallengeCompleted: state.isChallengeCompleted,
        freeAdvisorUsesLeft: state.freeAdvisorUsesLeft,
        completedRuleIds: state.completedRuleIds,
        bookmarkedRuleIds: state.bookmarkedRuleIds,
        masteredRuleIds: state.masteredRuleIds,
        completedScenarioIds: state.completedScenarioIds,
        selectedFocus: state.selectedFocus,
        hapticsEnabled: state.hapticsEnabled,
        reminderTime: state.reminderTime,
      }),
    }
  )
);
