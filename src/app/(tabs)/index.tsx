import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { AppIcon } from '../../components/ui/AppIcon';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';
import { DAILY_DRILLS, CURRICULUMS } from '../../store/mockData';

export default function DailyShadowScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
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

  // Hero Card: First unmastered rule or Rule 12 by default
  const heroRule =
    rules.find((r) => !masteredRuleIds.includes(r.id)) ||
    rules.find((r) => r.id === '12') ||
    rules[0];

  const isHeroMastered = masteredRuleIds.includes(heroRule.id);

  // Today's Micro-Challenge: bound to currentDrillIndex
  const safeDrillIndex = Math.abs(currentDrillIndex || 0) % DAILY_DRILLS.length;
  const currentDrill = DAILY_DRILLS[safeDrillIndex] || DAILY_DRILLS[0];

  // Active Curriculums: top 3
  const activeCurriculums = (curriculums && curriculums.length > 0 ? curriculums : CURRICULUMS).slice(0, 3);

  const handleToggleChallenge = () => {
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

  const handleCycleDrill = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    nextDailyDrill();
  };

  const handleHeroBriefingPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    router.push(`/(tabs)/codex/${heroRule.id}` as any);
  };

  const handleAdvisorPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }
    router.push('/advisor' as any);
  };

  const handleViewAllCurriculums = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    router.push('/(tabs)/codex' as any);
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="Daily Shadow" />

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
        {/* Top Greeting & Psychological Posture */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingHeaderRow}>
            <View>
              <Text style={styles.dispatchLabel}>TACTICAL DISPATCH</Text>
              <Text style={styles.greetingTitle}>Good evening, Strategist</Text>
            </View>

            {/* Streak Badge */}
            <View style={styles.streakBadge}>
              <AppIcon name="local_fire_department" size={14} color={colors.primary} />
              <Text style={styles.streakText}>{activeStreak}D STREAK</Text>
            </View>
          </View>

          {/* Psychological Posture Strip */}
          <View style={styles.postureStrip}>
            <View style={styles.postureDot} />
            <Text style={styles.postureText}>
              Today's psychological posture: <Text style={styles.postureHighlight}>Restraint over Reaction.</Text>
            </Text>
          </View>
        </View>

        {/* Tactical AI Advisor Live Dilemma Banner */}
        <Pressable
          onPress={handleAdvisorPress}
          style={styles.advisorCard}
          accessibilityRole="button"
        >
          <View style={styles.advisorHeader}>
            <View style={styles.advisorBadge}>
              <View style={styles.advisorPulseDot} />
              <Text style={styles.advisorBadgeText}>TACTICAL AI ADVISOR</Text>
            </View>
            <AppIcon name="bolt" size={16} color={colors.primary} />
          </View>

          <Text style={styles.advisorTitle}>ANALYZE LIVE DILEMMA</Text>
          <Text style={styles.advisorSub}>
            Simulate verbal defense scripts & power dynamics before high-stakes confrontations.
          </Text>

          <View style={styles.advisorFooter}>
            <Text style={styles.advisorFooterText}>DISPATCH LIVE ADVISOR</Text>
            <AppIcon name="arrow_forward" size={14} color={colors.primary} />
          </View>
        </Pressable>

        {/* Hero Card: Dynamic Rule of the Day */}
        <View style={styles.heroCard}>
          {/* Top Gold Gradient Bar */}
          <View style={styles.heroTopBar} />

          <View style={styles.heroBody}>
            <View style={styles.heroMetaRow}>
              <Text style={styles.heroRuleCode}>
                BLACK RULE // {heroRule.number} • {heroRule.category}
              </Text>
              <View style={[styles.axiomBadge, isHeroMastered && styles.masteredBadge]}>
                <Text style={[styles.axiomBadgeText, isHeroMastered && styles.masteredBadgeText]}>
                  {isHeroMastered ? 'MASTERED' : 'Axiom'}
                </Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>{heroRule.title}</Text>

            {/* Tactical Metric Strip */}
            <View style={styles.metricStrip}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>TIER IMPACT SCORE</Text>
                <View style={styles.metricValueRow}>
                  <Text style={styles.metricValue}>{heroRule.impactScore}</Text>
                  <Text style={styles.metricSub}>/ 10</Text>
                </View>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>ESTIMATED STUDY</Text>
                <View style={styles.metricValueRow}>
                  <Text style={styles.metricValue}>{heroRule.studyTime}</Text>
                  <Text style={styles.metricSub}>Seconds</Text>
                </View>
              </View>
            </View>

            {/* Complete 2-Min Briefing CTA */}
            <Pressable
              onPress={handleHeroBriefingPress}
              style={styles.heroCta}
              accessibilityRole="button"
            >
              <Text style={styles.heroCtaText}>
                {isHeroMastered ? 'Review 2-Min Briefing' : 'Complete 2-Min Briefing'}
              </Text>
              <AppIcon name="arrow_forward" size={16} color={colors.onPrimary} />
            </Pressable>
          </View>
        </View>

        {/* Today's Micro-Challenge (Rotating Tactical Drill) */}
        <View style={styles.challengeSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>TODAY'S MICRO-CHALLENGE</Text>
            <Pressable
              onPress={handleCycleDrill}
              style={styles.cycleDrillButton}
              accessibilityRole="button"
              accessibilityLabel="Cycle Daily Drill"
            >
              <AppIcon name="cached" size={13} color={colors.primary} />
              <Text style={styles.cycleDrillText}>Cycle Drill ↻</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleToggleChallenge}
            style={[
              styles.challengeCard,
              isChallengeCompleted && styles.challengeCardCompleted,
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChallengeCompleted }}
          >
            {/* Custom Checkbox */}
            <View
              style={[
                styles.checkbox,
                isChallengeCompleted && styles.checkboxChecked,
              ]}
            >
              {isChallengeCompleted && (
                <AppIcon name="check" size={14} color={colors.onPrimary} strokeWidth={2.5} />
              )}
            </View>

            <View style={styles.challengeContent}>
              <View style={styles.drillMetaRow}>
                <Text style={styles.drillProtocolTag}>{currentDrill.protocolTag}</Text>
                <View style={styles.drillRewardBadge}>
                  <Text style={styles.drillRewardText}>+{currentDrill.expReward} EXP</Text>
                </View>
              </View>

              <Text
                style={[
                  styles.challengeText,
                  isChallengeCompleted && styles.challengeTextCompleted,
                ]}
              >
                {currentDrill.text}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Active Curriculums */}
        <View style={styles.curriculumsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>ACTIVE CURRICULUMS</Text>
            <Pressable
              onPress={handleViewAllCurriculums}
              style={styles.viewAllButton}
              accessibilityRole="button"
            >
              <Text style={styles.viewAllText}>View All →</Text>
            </Pressable>
          </View>

          <View style={styles.curriculumsList}>
            {activeCurriculums.map((curr) => {
              const isMastered = masteredRuleIds.includes(curr.defaultRuleId);
              const baseCount =
                curr.id === 'curr-1'
                  ? 12
                  : curr.id === 'curr-2'
                  ? 16
                  : curr.id === 'curr-3'
                  ? 7
                  : curr.id === 'curr-5'
                  ? 9
                  : 5;
              const count = Math.min(curr.totalRules, baseCount + (isMastered ? 1 : 0));
              const percent = Math.min(100, Math.round((count / curr.totalRules) * 100));

              return (
                <Pressable
                  key={curr.id}
                  onPress={handleViewAllCurriculums}
                  style={styles.curriculumCard}
                  accessibilityRole="button"
                >
                  <View style={styles.currTopRow}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.currTitle}>{curr.title}</Text>
                      <Text style={styles.currSubtitle}>{curr.subtitle}</Text>
                    </View>
                    <Text style={styles.currPercent}>{percent}%</Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.currTrack}>
                    <View
                      style={[
                        styles.currFill,
                        { width: `${percent}%` },
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
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 20,
  },
  greetingSection: {
    gap: 12,
  },
  greetingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dispatchLabel: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.4,
    marginBottom: 2,
  },
  greetingTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.onSurface,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  streakText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  postureStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  postureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  postureText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  postureHighlight: {
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurface,
  },
  heroCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 18,
    overflow: 'hidden',
  },
  heroTopBar: {
    height: 4,
    backgroundColor: colors.primary,
  },
  heroBody: {
    padding: 18,
    gap: 14,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroRuleCode: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.2,
    flex: 1,
    paddingRight: 8,
  },
  axiomBadge: {
    backgroundColor: 'rgba(242, 202, 80, 0.15)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  axiomBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
  },
  masteredBadge: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  masteredBadgeText: {
    color: colors.onPrimary,
    fontFamily: fonts.labelSemiBold,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.onSurface,
    lineHeight: 28,
  },
  metricStrip: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  metricItem: {
    flex: 1,
    gap: 2,
  },
  metricLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.outline,
    letterSpacing: 0.8,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricValue: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 17,
    color: colors.primary,
  },
  metricSub: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.outline,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.outlineVariant,
    marginHorizontal: 12,
  },
  heroCta: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroCtaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.onPrimary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  challengeSection: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    letterSpacing: 1.2,
  },
  cycleDrillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 202, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cycleDrillText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 16,
  },
  challengeCardCompleted: {
    borderColor: 'rgba(242, 202, 80, 0.4)',
    backgroundColor: colors.surfaceContainer,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  challengeContent: {
    flex: 1,
    gap: 6,
  },
  drillMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  drillProtocolTag: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1,
    flex: 1,
  },
  drillRewardBadge: {
    backgroundColor: 'rgba(242, 202, 80, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  drillRewardText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: colors.primary,
  },
  challengeText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 19,
  },
  challengeTextCompleted: {
    color: colors.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  curriculumsSection: {
    gap: 10,
  },
  viewAllButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  viewAllText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  curriculumsList: {
    gap: 10,
  },
  curriculumCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  currTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  currTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 15,
    color: colors.onSurface,
  },
  currSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  currPercent: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.primary,
  },
  currTrack: {
    height: 4,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  currFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  advisorCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.4)',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  advisorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advisorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  advisorPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  advisorBadgeText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1,
  },
  advisorTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 16,
    color: colors.onSurface,
  },
  advisorSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  advisorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  advisorFooterText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
  },
});
