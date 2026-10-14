import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { AppIcon } from '../../components/ui/AppIcon';
import { RadarChart } from '../../components/features/RadarChart';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';

const ELENA_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrGG84acRosCC5hZ-eL73H6Ptl9iHaPEf11DlKHKInScqxXhEFhGr8i9juFcJ7DB94XJHaeaxtvvOGqxATmJpa27fMA5cLBS4uk6ad6HrkmqlTHg3i1H1ttqwCJ5vKuU5GzZVvrH2wIlfG1By_lv4bMOAJKWkqCauXwPKMBnuCqiWcJvwHIWyFlkDXEMC5blfRMcecNVJfYeVVxmDDQ8pWpKzok8P7BICPAMVqQygiXIZ8nF6W-e6z2w';

interface TraitVelocity {
  key: string;
  label: string;
  val: number;
  delta: string;
  desc: string;
}

const TRAIT_VELOCITIES: TraitVelocity[] = [
  {
    key: 'stoicism',
    label: 'STOICISM',
    val: 82,
    delta: '+6.8%',
    desc: 'Unwavering neutrality under boardroom duress.',
  },
  {
    key: 'persuasion',
    label: 'PERSUASION',
    val: 68,
    delta: '+3.4%',
    desc: 'Subconscious anchoring and framing dominance.',
  },
  {
    key: 'assertiveness',
    label: 'ASSERTIVENESS',
    val: 75,
    delta: '+4.1%',
    desc: 'Friction tolerance and boundary enforcement.',
  },
  {
    key: 'awareness',
    label: 'AWARENESS',
    val: 90,
    delta: '+8.2%',
    desc: 'Micro-expression reading and deception detection.',
  },
  {
    key: 'negotiation',
    label: 'NEGOTIATION',
    val: 60,
    delta: '+1.9%',
    desc: 'Information asymmetry and concession pacing.',
  },
];

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { stats, isPro } = useUserStore();

  const handleUpgradePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    router.push('/paywall');
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="Stats" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 94,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: ELENA_AVATAR }} style={styles.avatarImg} />
              <View style={styles.verifiedBadge}>
                <AppIcon name="verified" size={13} color={colors.primary} />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.tierPill}>
                <Text style={styles.tierPillText}>TIER III: TACTICIAN</Text>
              </View>
              <Text style={styles.profileName}>Elena Vance</Text>
              <Text style={styles.profileDesignation}>Lead Corporate Strategist</Text>
            </View>
          </View>

          {/* Axiom Calibration XP bar */}
          <View style={styles.calibrationSection}>
            <View style={styles.calibrationRow}>
              <Text style={styles.calibrationLabel}>AXIOM CALIBRATION</Text>
              <Text style={styles.calibrationValue}>69% • 3,450 / 5,000 XP</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: '69%' }]} />
            </View>
          </View>

          {/* 3-Column Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricNumber}>42</Text>
              <Text style={styles.metricLabel}>Scenarios Won</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricNumber}>14D</Text>
              <Text style={styles.metricLabel}>Streak Active</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricNumber}>94%</Text>
              <Text style={styles.metricLabel}>Precision</Text>
            </View>
          </View>
        </View>

        {/* High-Fidelity SVG Radar Chart Container */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>CHARACTER DEFENSE RADAR</Text>
            <View style={styles.liveTag}>
              <View style={styles.pulsingDot} />
              <Text style={styles.liveText}>TELEMETRY LIVE</Text>
            </View>
          </View>

          <RadarChart stats={stats} />
        </View>

        {/* Momentum Velocity List */}
        <View style={styles.velocitySection}>
          <Text style={styles.sectionHeader}>MOMENTUM VELOCITY</Text>

          <View style={styles.velocityList}>
            {TRAIT_VELOCITIES.map((item) => (
              <View key={item.key} style={styles.velocityCard}>
                <View style={styles.velocityTop}>
                  <View style={styles.velocityLabelGroup}>
                    <Text style={styles.velocityTitle}>{item.label}</Text>
                    <View style={styles.deltaBadge}>
                      <Text style={styles.deltaText}>{item.delta}</Text>
                    </View>
                  </View>
                  <Text style={styles.velocityScore}>{item.val}%</Text>
                </View>

                <Text style={styles.velocityDesc}>{item.desc}</Text>

                <View style={styles.velocityTrack}>
                  <View
                    style={[styles.velocityFill, { width: `${item.val}%` }]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Inline Upgrade Banner */}
        {!isPro && (
          <View style={styles.upgradeBannerCard}>
            <View style={styles.upgradeHeader}>
              <AppIcon name="military_tech" size={20} color={colors.primary} />
              <Text style={styles.upgradeTitle}>UNLOCK THE STRATEGIST PRO</Text>
            </View>

            <Text style={styles.upgradeDesc}>
              Deep psychological threat telemetry, full blind-spot diagnostic audit, and unrestricted access to 48 unredacted character laws.
            </Text>

            <Pressable
              onPress={handleUpgradePress}
              style={styles.upgradeCta}
            >
              <Text style={styles.upgradeCtaText}>
                Begin 7-Day Access Pass • $14.99/mo
              </Text>
              <AppIcon name="arrow_forward" size={16} color={colors.onPrimary} />
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
    backgroundColor: colors.surface,
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
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: 'rgba(242, 202, 80, 0.4)',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.surface,
    borderRadius: 9999,
    padding: 2,
  },
  profileInfo: {
    gap: 2,
  },
  tierPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: colors.primary,
  },
  tierPillText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  profileName: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.onSurface,
  },
  profileDesignation: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  calibrationSection: {
    gap: 6,
  },
  calibrationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calibrationLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.outline,
    letterSpacing: 1,
  },
  calibrationValue: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
  },
  track: {
    height: 4,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingTop: 12,
  },
  metricCol: {
    alignItems: 'center',
    gap: 2,
  },
  metricNumber: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 16,
    color: colors.primary,
  },
  metricLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.outlineVariant,
  },
  chartContainer: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  chartHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    letterSpacing: 1.2,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  liveText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
  },
  velocitySection: {
    gap: 10,
  },
  sectionHeader: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    letterSpacing: 1.2,
  },
  velocityList: {
    gap: 10,
  },
  velocityCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  velocityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  velocityLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  velocityTitle: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.onSurface,
    letterSpacing: 0.8,
  },
  deltaBadge: {
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  deltaText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
  },
  velocityScore: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 13,
    color: colors.primary,
  },
  velocityDesc: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    lineHeight: 15,
  },
  velocityTrack: {
    height: 3,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 9999,
    overflow: 'hidden',
    marginTop: 2,
  },
  velocityFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  upgradeBannerCard: {
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.primary,
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
    color: colors.primary,
    letterSpacing: 1.2,
  },
  upgradeDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  upgradeCta: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  upgradeCtaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.onPrimary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
