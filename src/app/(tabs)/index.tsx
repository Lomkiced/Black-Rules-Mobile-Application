import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { AppIcon } from '../../components/ui/AppIcon';
import { PixelArtBanner } from '../../components/ui/PixelArtBanner';
import { fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';
import { DAILY_DRILLS, CURRICULUMS, ARENA_SCENARIOS, BLACK_RULES } from '../../store/mockData';

type FocusKey = 'calm' | 'negotiation' | 'boundaries' | 'presence';

interface FocusPill {
  key: FocusKey;
  label: string;
  icon: string;
}

const FOCUS_PILLS: FocusPill[] = [
  { key: 'calm', label: 'Calm & Control', icon: 'self_improvement' },
  { key: 'negotiation', label: 'Negotiation', icon: 'scale' },
  { key: 'boundaries', label: 'Boundaries', icon: 'shield' },
  { key: 'presence', label: 'Confidence', icon: 'military_tech' },
];

export default function DailyShadowScreen() {
  const router = useRouter();

  const {
    operativeName,
    streak,
    streakCount,
    isChallengeCompleted,
    toggleChallenge,
    currentDrillIndex,
    nextDailyDrill,
    curriculums,
    rules,
    masteredRuleIds,
    selectedFocus = 'calm',
    setSelectedFocus,
    hapticsEnabled,
  } = useUserStore();

  const activeStreak = streak || streakCount || 14;

  // Dynamic Time-of-Day Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = operativeName ? operativeName.trim().split(' ')[0] : 'Strategist';

  // Dynamic Rule & Scenario based on Selected Focus
  const allRules = rules && rules.length > 0 ? rules : BLACK_RULES;
  const allScenarios = ARENA_SCENARIOS;

  const getRecommendedData = () => {
    switch (selectedFocus) {
      case 'negotiation': {
        const rule = allRules.find((r) => r.id === '01' || r.id === '12') || allRules[0];
        const scenario = allScenarios.find((s) => s.id === 'scenario-02') || allScenarios[1];
        return { rule, scenario, focusTitle: 'Smart Negotiation' };
      }
      case 'boundaries': {
        const rule = allRules.find((r) => r.id === '02' || r.id === '06') || allRules[1];
        const scenario = allScenarios.find((s) => s.id === 'scenario-03') || allScenarios[2];
        return { rule, scenario, focusTitle: 'Respect & Boundaries' };
      }
      case 'presence': {
        const rule = allRules.find((r) => r.id === '07' || r.id === '08') || allRules[3];
        const scenario = allScenarios.find((s) => s.id === 'scenario-01') || allScenarios[0];
        return { rule, scenario, focusTitle: 'Confidence & Presence' };
      }
      case 'calm':
      default: {
        const rule = allRules.find((r) => r.id === '03' || r.id === '05') || allRules[2];
        const scenario = allScenarios.find((s) => s.id === 'scenario-04') || allScenarios[3];
        return { rule, scenario, focusTitle: 'Calm Under Pressure' };
      }
    }
  };

  const { rule: heroRule, scenario: recommendedScenario, focusTitle } = getRecommendedData();
  const isHeroMastered = masteredRuleIds.includes(heroRule.id);

  // Today's Daily Habit
  const safeDrillIndex = Math.abs(currentDrillIndex || 0) % DAILY_DRILLS.length;
  const currentDrill = DAILY_DRILLS[safeDrillIndex] || DAILY_DRILLS[0];

  // Curriculums
  const activeCurriculums = curriculums && curriculums.length > 0 ? curriculums : CURRICULUMS;

  const handleSelectFocus = (focus: FocusKey) => {
    if (hapticsEnabled) {
      try {
        Haptics.selectionAsync();
      } catch {
        // safe fallback
      }
    }
    setSelectedFocus(focus);
  };

  const handleToggleHabit = () => {
    if (hapticsEnabled) {
      try {
        Haptics.notificationAsync(
          isChallengeCompleted
            ? Haptics.NotificationFeedbackType.Warning
            : Haptics.NotificationFeedbackType.Success
        );
      } catch {
        // safe fallback
      }
    }
    toggleChallenge();
  };

  const handleNextHabit = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // safe fallback
      }
    }
    nextDailyDrill();
  };

  const handleRulePress = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // safe fallback
      }
    }
    router.push(`/(tabs)/codex/${heroRule.id}` as any);
  };

  const handlePracticeScenario = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // safe fallback
      }
    }
    router.push('/(tabs)/arena' as any);
  };

  const handleViewAllRules = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // safe fallback
      }
    }
    router.push('/(tabs)/codex' as any);
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="Today" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic Time-of-Day Header */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingSub}>DAILY OVERVIEW</Text>
            <Text style={styles.greetingTitle}>
              {greeting}, {firstName}
            </Text>
          </View>

          <View style={styles.streakPill}>
            <AppIcon name="local_fire_department" size={14} color="#FFFFFF" />
            <Text style={styles.streakText}>{activeStreak} Day Streak</Text>
          </View>
        </View>

        {/* Interactive "Today's Focus" Selector */}
        <View style={styles.focusSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODAY'S FOCUS</Text>
            <Text style={styles.focusActiveTag}>{focusTitle.toUpperCase()}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.focusPillsRow}
          >
            {FOCUS_PILLS.map((pill) => {
              const isActive = selectedFocus === pill.key;
              return (
                <Pressable
                  key={pill.key}
                  onPress={() => handleSelectFocus(pill.key)}
                  style={[
                    styles.focusPill,
                    isActive && styles.focusPillActive,
                  ]}
                  accessibilityRole="button"
                >
                  <AppIcon
                    name={pill.icon}
                    size={14}
                    color={isActive ? '#09090B' : '#A1A1AA'}
                  />
                  <Text
                    style={[
                      styles.focusPillText,
                      isActive && styles.focusPillTextActive,
                    ]}
                  >
                    {pill.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Rule of the Day Card */}
        <View style={styles.ruleCard}>
          <PixelArtBanner
            variant={heroRule.pixelVariant || 'shield'}
            height={130}
            showBorder={false}
          />

          <View style={styles.ruleCardBody}>
            <View style={styles.ruleMetaRow}>
              <Text style={styles.ruleCode}>
                RULE #{heroRule.number} • {heroRule.category}
              </Text>
              {isHeroMastered && (
                <View style={styles.masteredBadge}>
                  <Text style={styles.masteredBadgeText}>Learned</Text>
                </View>
              )}
            </View>

            <Text style={styles.ruleTitle}>{heroRule.title}</Text>
            <Text style={styles.ruleSummary} numberOfLines={2}>
              {heroRule.summary}
            </Text>

            {/* Crisp White Read Button */}
            <Pressable
              onPress={handleRulePress}
              style={styles.readButton}
              accessibilityRole="button"
            >
              <Text style={styles.readButtonText}>
                {isHeroMastered ? 'Review Rule (2 min) →' : 'Read Rule (2 min) →'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Jump to Recommended Practice Card */}
        <Pressable
          onPress={handlePracticeScenario}
          style={styles.scenarioCard}
          accessibilityRole="button"
        >
          <View style={styles.scenarioCardHeader}>
            <View style={styles.scenarioBadge}>
              <Text style={styles.scenarioBadgeText}>ARENA PRACTICE</Text>
            </View>
            <Text style={styles.scenarioStars}>★★★★☆</Text>
          </View>

          <View style={styles.scenarioContent}>
            <Text style={styles.scenarioTitle}>
              Practice Today: {recommendedScenario.title}
            </Text>
            <Text style={styles.scenarioContext} numberOfLines={2}>
              {recommendedScenario.narrative}
            </Text>
          </View>

          <View style={styles.scenarioFooter}>
            <Text style={styles.scenarioCtaText}>Start Practice Dilemma →</Text>
            <AppIcon name="arrow_forward" size={14} color="#09090B" />
          </View>
        </Pressable>

        {/* Today's Daily Habit Card */}
        <View style={styles.habitSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODAY'S DAILY HABIT</Text>
            <Pressable
              onPress={handleNextHabit}
              style={styles.nextHabitBtn}
              accessibilityRole="button"
            >
              <Text style={styles.nextHabitText}>New Habit ↻</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleToggleHabit}
            style={[
              styles.habitCard,
              isChallengeCompleted && styles.habitCardCompleted,
            ]}
          >
            {/* Custom Pixel Checkbox */}
            <View
              style={[
                styles.checkbox,
                isChallengeCompleted && styles.checkboxChecked,
              ]}
            >
              {isChallengeCompleted && (
                <AppIcon name="check" size={14} color="#09090B" strokeWidth={3} />
              )}
            </View>

            <View style={styles.habitContent}>
              <View style={styles.habitMetaRow}>
                <Text style={styles.habitTag}>{currentDrill.protocolTag}</Text>
                <Text style={styles.habitReward}>+{currentDrill.expReward} XP</Text>
              </View>

              <Text
                style={[
                  styles.habitText,
                  isChallengeCompleted && styles.habitTextCompleted,
                ]}
              >
                {currentDrill.text}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Categories Preview */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CATEGORIES</Text>
            <Pressable onPress={handleViewAllRules}>
              <Text style={styles.viewAllText}>View All Rules →</Text>
            </Pressable>
          </View>

          <View style={styles.categoriesList}>
            {activeCurriculums.map((curr) => {
              const categoryRules = allRules.filter((r) =>
                r.category.toUpperCase().includes(curr.tag.toUpperCase()) ||
                curr.title.toUpperCase().includes(r.category.toUpperCase())
              );
              const totalRules = Math.max(categoryRules.length, curr.totalRules || 2);
              const learned = categoryRules.filter((r) => masteredRuleIds.includes(r.id)).length;
              const percent = Math.min(100, Math.round((learned / totalRules) * 100));

              return (
                <Pressable
                  key={curr.id}
                  onPress={handleViewAllRules}
                  style={styles.categoryCard}
                >
                  <View style={styles.categoryTop}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.categoryTitle}>{curr.title}</Text>
                      <Text style={styles.categorySub}>{curr.subtitle}</Text>
                    </View>
                    <Text style={styles.categoryProgressText}>
                      {learned} of {totalRules} Learned
                    </Text>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.max(6, percent)}%` },
                      ]}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 22,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingSub: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  greetingTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: '#FAFAFA',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  streakText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#FAFAFA',
    letterSpacing: 0.5,
  },
  focusSection: {
    gap: 10,
  },
  focusActiveTag: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
    letterSpacing: 0.8,
  },
  focusPillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 8,
  },
  focusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  focusPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  focusPillText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#A1A1AA',
  },
  focusPillTextActive: {
    fontFamily: fonts.labelSemiBold,
    color: '#09090B',
  },
  ruleCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    overflow: 'hidden',
  },
  ruleCardBody: {
    padding: 16,
    gap: 8,
  },
  ruleMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleCode: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1,
  },
  masteredBadge: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  masteredBadgeText: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#FAFAFA',
  },
  ruleTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 18,
    color: '#FAFAFA',
  },
  ruleSummary: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 18,
  },
  readButton: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  readButtonText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#09090B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  scenarioCard: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  scenarioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scenarioBadge: {
    backgroundColor: '#27272A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scenarioBadgeText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 8,
    color: '#FAFAFA',
    letterSpacing: 0.8,
  },
  scenarioStars: {
    color: '#A1A1AA',
    fontSize: 11,
    letterSpacing: 1,
  },
  scenarioContent: {
    gap: 4,
  },
  scenarioTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 14,
    color: '#FAFAFA',
  },
  scenarioContext: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 16,
  },
  scenarioFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  scenarioCtaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#09090B',
    letterSpacing: 0.5,
  },
  habitSection: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  nextHabitBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  nextHabitText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#A1A1AA',
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  habitCardCompleted: {
    borderColor: '#3F3F46',
    backgroundColor: '#0D0D10',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#52525B',
    backgroundColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  habitContent: {
    flex: 1,
    gap: 4,
  },
  habitMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitTag: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  habitReward: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: '#FAFAFA',
  },
  habitText: {
    fontFamily: fonts.headlineMedium,
    fontSize: 13,
    color: '#FAFAFA',
    lineHeight: 18,
  },
  habitTextCompleted: {
    color: '#71717A',
    textDecorationLine: 'line-through',
  },
  categoriesSection: {
    gap: 12,
  },
  viewAllText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#A1A1AA',
  },
  categoriesList: {
    gap: 8,
  },
  categoryCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  categoryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 13,
    color: '#FAFAFA',
  },
  categorySub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  categoryProgressText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#27272A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});
