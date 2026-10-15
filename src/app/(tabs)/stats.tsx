import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Share } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { AppIcon } from '../../components/ui/AppIcon';
import { RadarChart } from '../../components/features/RadarChart';
import { BMonogram } from '../../components/ui/BMonogram';
import { fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';
import { TraitKey } from '../../types';

interface SkillConfig {
  key: TraitKey;
  label: string;
  desc: string;
}

const SKILLS: SkillConfig[] = [
  {
    key: 'stoicism',
    label: 'Self-Control',
    desc: 'Remaining calm and neutral under sudden emotional pressure.',
  },
  {
    key: 'assertiveness',
    label: 'Confidence',
    desc: 'Setting firm boundaries and stating needs without apologizing.',
  },
  {
    key: 'persuasion',
    label: 'Persuasion',
    desc: 'Framing discussions so others naturally agree with your position.',
  },
  {
    key: 'awareness',
    label: 'Awareness',
    desc: 'Spotting hidden motives, subtle body language, and unspoken agendas.',
  },
  {
    key: 'negotiation',
    label: 'Negotiation',
    desc: 'Using tactical silence and slow concessions to win optimal terms.',
  },
];

const WEEKDAYS = [
  { day: 'Mon', completed: true },
  { day: 'Tue', completed: true },
  { day: 'Wed', completed: true },
  { day: 'Thu', completed: true },
  { day: 'Fri', completed: true },
  { day: 'Sat', completed: false },
  { day: 'Sun', completed: false },
];

export default function StatsScreen() {
  const router = useRouter();
  const {
    operativeName,
    stats,
    xp,
    levelTier,
    streak,
    masteredRuleIds,
    completedScenarioIds = [],
    isPro,
    isChallengeCompleted,
    hapticsEnabled,
  } = useUserStore();

  const handleUpgradePress = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // safe fallback
      }
    }
    router.push('/paywall');
  };

  const handleShareDossier = async () => {
    if (hapticsEnabled) {
      try {
        Haptics.selectionAsync();
      } catch {
        // safe fallback
      }
    }
    try {
      await Share.share({
        message: `BLACK RULES // OPERATIVE CHARACTER DOSSIER\nOperative: ${operativeName || 'Strategist'}\nClearance: ${isPro ? 'Tier Sovereign // PRO' : levelTier}\nStreak: ${streak} Days Active • ${xp.toLocaleString()} XP\n\n5-TRAIT CHARACTER VECTOR:\n• Self-Control: ${stats.stoicism}%\n• Confidence: ${stats.assertiveness}%\n• Persuasion: ${stats.persuasion}%\n• Awareness: ${stats.awareness}%\n• Negotiation: ${stats.negotiation}%\n\nMaster the Unspoken Laws of Human Nature: blackrules.io`,
      });
    } catch {
      // safe fallback
    }
  };

  const initial = (operativeName || 'E').trim().charAt(0).toUpperCase();

  // 4 Core Milestones & Achievements
  const milestones = [
    {
      id: 'first-step',
      title: 'First Step',
      desc: 'Learn your first Black Rule',
      icon: 'flag',
      unlocked: masteredRuleIds.length >= 1,
      progress: `${Math.min(1, masteredRuleIds.length)} / 1`,
    },
    {
      id: 'rule-scholar',
      title: 'Rule Scholar',
      desc: 'Learn 5 Black Rules',
      icon: 'auto_stories',
      unlocked: masteredRuleIds.length >= 5,
      progress: `${Math.min(5, masteredRuleIds.length)} / 5`,
    },
    {
      id: 'cool-under-fire',
      title: 'Cool Under Fire',
      desc: 'Complete 3 Practice Scenarios',
      icon: 'swords',
      unlocked: completedScenarioIds.length >= 3,
      progress: `${Math.min(3, completedScenarioIds.length)} / 3`,
    },
    {
      id: 'consistent-mind',
      title: 'Consistent Mind',
      desc: 'Reach a 7-Day Streak',
      icon: 'local_fire_department',
      unlocked: streak >= 7,
      progress: `${Math.min(7, streak)} / 7`,
    },
  ];

  return (
    <View style={styles.root}>
      <TopAppBar title="Progress" />

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
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.tierPill}>
                <Text style={styles.tierPillText}>
                  {isPro ? 'SOVEREIGN PRO' : levelTier.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.profileName}>{operativeName || 'Strategist'}</Text>
            </View>
          </View>

          {/* Quick Metrics Strip */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{xp.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Total XP</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{masteredRuleIds.length}/12</Text>
              <Text style={styles.metricLabel}>Rules Learned</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{streak}D</Text>
              <Text style={styles.metricLabel}>Daily Streak</Text>
            </View>
          </View>

          {/* Share Character Dossier Button */}
          <Pressable
            onPress={handleShareDossier}
            style={styles.shareDossierBtn}
            accessibilityRole="button"
          >
            <AppIcon name="share" size={13} color="#FAFAFA" />
            <Text style={styles.shareDossierText}>Share Character Dossier</Text>
          </Pressable>
        </View>

        {/* 7-Day Consistency Pixel Matrix Card */}
        <View style={styles.consistencyCard}>
          <View style={styles.consistencyHeader}>
            <View style={styles.consistencyTitleRow}>
              <Text style={styles.consistencyLabel}>7-DAY CONSISTENCY MATRIX</Text>
              <View style={styles.bonusTag}>
                <Text style={styles.bonusTagText}>+20 XP DAILY BONUS</Text>
              </View>
            </View>
            <Text style={styles.consistencyStreakText}>
              {streak} Days Streak • {isChallengeCompleted ? 'Completed Today' : 'Pending Today'}
            </Text>
          </View>

          {/* 7-Day Pixel Blocks */}
          <View style={styles.matrixRow}>
            {WEEKDAYS.map((w, idx) => {
              const isToday = idx === 4; // Current day simulated
              const isFilled = w.completed || (isToday && isChallengeCompleted);

              return (
                <View key={w.day} style={styles.dayCol}>
                  <Text style={[styles.dayText, isToday && styles.dayTextToday]}>
                    {w.day}
                  </Text>
                  <View
                    style={[
                      styles.pixelBlock,
                      isFilled && styles.pixelBlockFilled,
                      isToday && !isFilled && styles.pixelBlockTodayPending,
                    ]}
                  >
                    {isFilled && <View style={styles.pixelCenterDot} />}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Monochrome SVG Radar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>5-TRAIT CHARACTER RADAR</Text>
          </View>

          <RadarChart stats={stats} />
        </View>

        {/* Milestones & Achievements Grid */}
        <View style={styles.milestonesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>MILESTONES & ACHIEVEMENTS</Text>
            <Text style={styles.sectionCount}>
              {milestones.filter((m) => m.unlocked).length} / {milestones.length} Unlocked
            </Text>
          </View>

          <View style={styles.milestonesGrid}>
            {milestones.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.milestoneCard,
                  m.unlocked ? styles.milestoneUnlocked : styles.milestoneLocked,
                ]}
              >
                <View style={styles.milestoneTopRow}>
                  <View
                    style={[
                      styles.milestoneIconFrame,
                      m.unlocked && styles.milestoneIconFrameUnlocked,
                    ]}
                  >
                    <AppIcon
                      name={m.icon}
                      size={14}
                      color={m.unlocked ? '#09090B' : '#71717A'}
                    />
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      m.unlocked ? styles.statusPillUnlocked : styles.statusPillLocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        m.unlocked && styles.statusPillTextUnlocked,
                      ]}
                    >
                      {m.unlocked ? 'UNLOCKED ✓' : m.progress}
                    </Text>
                  </View>
                </View>

                <View style={styles.milestoneTextGroup}>
                  <Text
                    style={[
                      styles.milestoneTitle,
                      m.unlocked && styles.milestoneTitleUnlocked,
                    ]}
                  >
                    {m.title}
                  </Text>
                  <Text style={styles.milestoneDesc}>{m.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Skill Score List (0–100%) */}
        <View style={styles.skillsSection}>
          <Text style={styles.sectionTitle}>SKILL SCORES</Text>

          <View style={styles.skillsList}>
            {SKILLS.map((skill) => {
              const score = stats[skill.key] ?? 50;

              return (
                <View key={skill.key} style={styles.skillCard}>
                  <View style={styles.skillTopRow}>
                    <Text style={styles.skillName}>{skill.label}</Text>
                    <Text style={styles.skillScore}>{score}%</Text>
                  </View>

                  <Text style={styles.skillDesc}>{skill.desc}</Text>

                  {/* Progress Bar */}
                  <View style={styles.skillTrack}>
                    <View
                      style={[
                        styles.skillFill,
                        { width: `${Math.max(5, score)}%` },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Upgrade to Pro Card */}
        {!isPro && (
          <View style={styles.upgradeCard}>
            <View style={styles.upgradeHeader}>
              <BMonogram size={24} />
              <Text style={styles.upgradeTitle}>UPGRADE TO SOVEREIGN PRO</Text>
            </View>

            <Text style={styles.upgradeDesc}>
              Unlock all 12 Black Rules, premium practice scenarios, unlimited AI Coach queries, and deep character telemetry.
            </Text>

            <Pressable
              onPress={handleUpgradePress}
              style={styles.upgradeBtn}
            >
              <Text style={styles.upgradeBtnText}>Upgrade to Pro →</Text>
            </Pressable>
          </View>
        )}
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
  profileCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    backgroundColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 18,
    color: '#FAFAFA',
  },
  profileInfo: {
    gap: 4,
  },
  tierPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierPillText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
    letterSpacing: 0.6,
  },
  profileName: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: '#FAFAFA',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#18181B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  metricItem: {
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 14,
    color: '#FAFAFA',
  },
  metricLabel: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#71717A',
    letterSpacing: 0.5,
  },
  metricDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#27272A',
  },
  shareDossierBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    paddingVertical: 10,
  },
  shareDossierText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#FAFAFA',
    letterSpacing: 0.6,
  },
  consistencyCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  consistencyHeader: {
    gap: 4,
  },
  consistencyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consistencyLabel: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  bonusTag: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bonusTagText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 8,
    color: '#FAFAFA',
    letterSpacing: 0.5,
  },
  consistencyStreakText: {
    fontFamily: fonts.headlineMedium,
    fontSize: 12,
    color: '#FAFAFA',
  },
  matrixRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
  },
  dayTextToday: {
    color: '#FAFAFA',
    fontFamily: fonts.labelSemiBold,
  },
  pixelBlock: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
    backgroundColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pixelBlockFilled: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  pixelBlockTodayPending: {
    borderColor: '#52525B',
    borderStyle: 'dashed',
  },
  pixelCenterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#09090B',
  },
  chartCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  milestonesSection: {
    gap: 12,
  },
  sectionHeaderRow: {
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
  sectionCount: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
  },
  milestonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  milestoneCard: {
    width: '48.4%',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
  },
  milestoneUnlocked: {
    backgroundColor: '#121215',
    borderColor: '#FFFFFF',
    opacity: 1,
  },
  milestoneLocked: {
    backgroundColor: '#0F0F12',
    borderColor: '#27272A',
    opacity: 0.65,
  },
  milestoneTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneIconFrame: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneIconFrameUnlocked: {
    backgroundColor: '#FFFFFF',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillUnlocked: {
    backgroundColor: '#FFFFFF',
  },
  statusPillLocked: {
    backgroundColor: '#18181B',
  },
  statusPillText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 8,
    color: '#71717A',
    letterSpacing: 0.5,
  },
  statusPillTextUnlocked: {
    color: '#09090B',
  },
  milestoneTextGroup: {
    gap: 2,
  },
  milestoneTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 12,
    color: '#A1A1AA',
  },
  milestoneTitleUnlocked: {
    color: '#FAFAFA',
  },
  milestoneDesc: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: '#71717A',
    lineHeight: 13,
  },
  skillsSection: {
    gap: 12,
  },
  skillsList: {
    gap: 10,
  },
  skillCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  skillTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillName: {
    fontFamily: fonts.headlineMedium,
    fontSize: 13,
    color: '#FAFAFA',
  },
  skillScore: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#FAFAFA',
  },
  skillDesc: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: '#71717A',
    lineHeight: 15,
  },
  skillTrack: {
    height: 4,
    backgroundColor: '#27272A',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  skillFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  upgradeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    gap: 10,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  upgradeTitle: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#09090B',
    letterSpacing: 0.8,
  },
  upgradeDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#3F3F46',
    lineHeight: 16,
  },
  upgradeBtn: {
    height: 42,
    backgroundColor: '#09090B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  upgradeBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
