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
    isPro,
    isChallengeCompleted,
  } = useUserStore();

  const handleUpgradePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    router.push('/paywall');
  };

  const handleShareDossier = async () => {
    try {
      Haptics.selectionAsync();
      await Share.share({
        message: `BLACK RULES // OPERATIVE CHARACTER DOSSIER\nOperative: ${operativeName || 'Strategist'}\nClearance: ${isPro ? 'Tier Sovereign // PRO' : levelTier}\nStreak: ${streak} Days Active • ${xp.toLocaleString()} XP\n\n5-TRAIT CHARACTER VECTOR:\n• Self-Control: ${stats.stoicism}%\n• Confidence: ${stats.assertiveness}%\n• Persuasion: ${stats.persuasion}%\n• Awareness: ${stats.awareness}%\n• Negotiation: ${stats.negotiation}%\n\nMaster the Unspoken Laws of Human Nature: blackrules.io`,
      });
    } catch {
      // safe fallback
    }
  };

  const initial = (operativeName || 'E').trim().charAt(0).toUpperCase();

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
              const isToday = idx === 4; // Friday
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

        {/* Clean Upgrade to Pro Card */}
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
    gap: 18,
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
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#18181B',
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 16,
    color: '#FAFAFA',
  },
  profileInfo: {
    gap: 2,
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
    letterSpacing: 0.8,
  },
  profileName: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: '#FAFAFA',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    paddingTop: 12,
  },
  metricItem: {
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 15,
    color: '#FAFAFA',
  },
  metricLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: '#71717A',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#27272A',
  },
  shareDossierBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    paddingVertical: 10,
  },
  shareDossierText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#FAFAFA',
    letterSpacing: 0.5,
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
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  bonusTag: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bonusTagText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 8,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  consistencyStreakText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#D4D4D8',
  },
  matrixRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
  },
  dayTextToday: {
    color: '#FFFFFF',
    fontFamily: fonts.labelSemiBold,
  },
  pixelBlock: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#27272A',
    backgroundColor: '#050507',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pixelBlockFilled: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  pixelBlockTodayPending: {
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
  },
  pixelCenterDot: {
    width: 6,
    height: 6,
    borderRadius: 1,
    backgroundColor: '#09090B',
  },
  chartCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  chartHeader: {
    width: '100%',
    alignItems: 'flex-start',
  },
  chartTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  skillsSection: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  skillsList: {
    gap: 10,
  },
  skillCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
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
    fontSize: 14,
    color: '#FAFAFA',
  },
  skillScore: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  skillDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 16,
  },
  skillTrack: {
    height: 3,
    backgroundColor: '#050507',
    borderRadius: 9999,
    overflow: 'hidden',
    marginTop: 4,
  },
  skillFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  upgradeCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 16,
    padding: 18,
    gap: 12,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upgradeTitle: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#FAFAFA',
    letterSpacing: 1,
  },
  upgradeDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 18,
  },
  upgradeBtn: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#09090B',
    letterSpacing: 0.6,
  },
});
