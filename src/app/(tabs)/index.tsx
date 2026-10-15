import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { AppIcon } from '../../components/ui/AppIcon';
import { PixelArtBanner } from '../../components/ui/PixelArtBanner';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';
import { DAILY_DRILLS, CURRICULUMS } from '../../store/mockData';

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
  } = useUserStore();

  const activeStreak = streak || streakCount || 14;

  // Rule of the Day: first unmastered rule or Rule 01
  const heroRule =
    rules.find((r) => !masteredRuleIds.includes(r.id)) ||
    rules[0];

  const isHeroMastered = masteredRuleIds.includes(heroRule.id);

  // Today's Daily Habit
  const safeDrillIndex = Math.abs(currentDrillIndex || 0) % DAILY_DRILLS.length;
  const currentDrill = DAILY_DRILLS[safeDrillIndex] || DAILY_DRILLS[0];

  // Categories list
  const activeCurriculums = curriculums && curriculums.length > 0 ? curriculums : CURRICULUMS;

  const handleToggleHabit = () => {
    try {
      Haptics.notificationAsync(
        isChallengeCompleted
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
    } catch {
      // safe fallback
    }
    toggleChallenge();
  };

  const handleNextHabit = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    nextDailyDrill();
  };

  const handleRulePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    router.push(`/(tabs)/codex/${heroRule.id}` as any);
  };

  const handleViewAllRules = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
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
        {/* Top Greeting & Streak */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingSub}>DAILY OVERVIEW</Text>
            <Text style={styles.greetingTitle}>
              Hello, {operativeName ? operativeName.split(' ')[0] : 'Strategist'}
            </Text>
          </View>

          <View style={styles.streakPill}>
            <AppIcon name="local_fire_department" size={14} color="#FFFFFF" />
            <Text style={styles.streakText}>{activeStreak} Day Streak</Text>
          </View>
        </View>

        {/* Rule of the Day Card */}
        <View style={styles.ruleCard}>
          {/* Pixel Art Banner */}
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
            <Text style={styles.ruleSummary}>{heroRule.summary}</Text>

            {/* Crisp White Read Button */}
            <Pressable
              onPress={handleRulePress}
              style={styles.readButton}
              accessibilityRole="button"
            >
              <Text style={styles.readButtonText}>
                {isHeroMastered ? 'Review Rule (2 min) →' : 'Read Full Rule (2 min) →'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Today's Daily Habit Card */}
        <View style={styles.habitSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODAY'S DAILY HABIT</Text>
            <Pressable
              onPress={handleNextHabit}
              style={styles.nextHabitBtn}
              accessibilityRole="button"
            >
              <Text style={styles.nextHabitText}>Next Habit ↻</Text>
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
              // Calculate learned count for this curriculum
              const categoryRules = rules.filter((r) =>
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

                  {/* Progress Bar */}
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
  ruleCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  ruleCardBody: {
    padding: 18,
    gap: 12,
  },
  ruleMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleCode: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#A1A1AA',
    letterSpacing: 1,
  },
  masteredBadge: {
    backgroundColor: '#27272A',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  masteredBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#FAFAFA',
  },
  ruleTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: '#FAFAFA',
    lineHeight: 26,
  },
  ruleSummary: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 19,
  },
  readButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  readButtonText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#09090B',
    letterSpacing: 0.6,
  },
  habitSection: {
    gap: 10,
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
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  nextHabitText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#FAFAFA',
  },
  habitCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  habitCardCompleted: {
    backgroundColor: '#18181B',
    borderColor: '#3F3F46',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#71717A',
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
    gap: 6,
  },
  habitMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitTag: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
    letterSpacing: 0.8,
  },
  habitReward: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: '#FFFFFF',
  },
  habitText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#FAFAFA',
    lineHeight: 19,
  },
  habitTextCompleted: {
    color: '#71717A',
    textDecorationLine: 'line-through',
  },
  categoriesSection: {
    gap: 10,
  },
  viewAllText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#FAFAFA',
    letterSpacing: 0.6,
  },
  categoriesList: {
    gap: 10,
  },
  categoryCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  categoryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 15,
    color: '#FAFAFA',
  },
  categorySub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
    marginTop: 2,
  },
  categoryProgressText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#050507',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});
