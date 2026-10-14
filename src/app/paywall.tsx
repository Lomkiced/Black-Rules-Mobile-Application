import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Polygon } from 'react-native-svg';
import { AppIcon } from '../components/ui/AppIcon';
import { colors, fonts } from '../theme/tokens';
import { useUserStore } from '../store/useUserStore';

type PlanType = 'annual' | 'monthly';

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setPro } = useUserStore();

  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'connecting' | 'verified'>('idle');

  const handleSelectPlan = (plan: PlanType) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // fallback
    }
    setSelectedPlan(plan);
  };

  const handleRestore = () => {
    if (restoreStatus !== 'idle') return;
    try {
      Haptics.selectionAsync();
    } catch {
      // fallback
    }
    setRestoreStatus('connecting');

    setTimeout(() => {
      setRestoreStatus('verified');
      setPro(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // fallback
      }
      setTimeout(() => {
        router.back();
      }, 700);
    }, 1000);
  };

  const handlePurchase = () => {
    if (isAuthorizing) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // fallback
    }
    setIsAuthorizing(true);

    setTimeout(() => {
      setPro(true);
      setIsAuthorizing(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // fallback
      }
      router.back();
    }, 900);
  };

  return (
    <View style={styles.root}>
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top, 14),
            height: 56 + Math.max(insets.top, 14),
          },
        ]}
      >
        <Pressable
          onPress={handleRestore}
          hitSlop={8}
          style={styles.restoreBtn}
        >
          <Text style={styles.restoreText}>
            {restoreStatus === 'idle'
              ? 'Restore Access'
              : restoreStatus === 'connecting'
              ? 'Connecting...'
              : 'Receipt Verified'}
          </Text>
        </Pressable>

        <View style={styles.tierSovereignBadge}>
          <Text style={styles.tierSovereignText}>TIER SOVEREIGN</Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.closeBtn}
          accessibilityLabel="Close"
        >
          <AppIcon name="close" size={20} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom + 24, 32),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroSub}>MEMBERSHIP ELEVATION // THE STRATEGIST</Text>
          <Text style={styles.heroTitle}>Master the Unspoken Laws of Human Nature</Text>
        </View>

        {/* Visual Proof Emblem Card */}
        <View style={styles.emblemCard}>
          <View style={styles.emblemTextGroup}>
            <Text style={styles.emblemLabel}>UNRESTRICTED DOSSIER</Text>
            <Text style={styles.emblemTitle}>CODEX // 100 OF 100 UNLOCKED</Text>
            <Text style={styles.emblemDesc}>
              Complete declassification of deceptive signals, power dynamics, and social defense maneuvers.
            </Text>
          </View>

          {/* Miniature Radar SVG */}
          <View style={styles.miniRadarContainer}>
            <Svg width={72} height={72} viewBox="0 0 72 72">
              <Polygon
                points="36,6 64.5,26.7 53.6,60.3 18.4,60.3 7.5,26.7"
                stroke={colors.outlineVariant}
                strokeWidth={1}
                fill="rgba(32, 31, 34, 0.4)"
              />
              <Polygon
                points="36,16 57,32 49,54 23,54 15,32"
                stroke={colors.primary}
                strokeWidth={1.5}
                fill="rgba(242, 202, 80, 0.2)"
              />
            </Svg>
          </View>
        </View>

        {/* 3 Benefit Rows */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <AppIcon name="auto_stories" size={16} color={colors.primary} />
            </View>
            <View style={styles.benefitTextGroup}>
              <Text style={styles.benefitTitle}>100+ Strategic Laws & Defenses</Text>
              <Text style={styles.benefitDesc}>
                Full breakdown, psychological trap warnings, and reverse tactics.
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <AppIcon name="swords" size={16} color={colors.primary} />
            </View>
            <View style={styles.benefitTextGroup}>
              <Text style={styles.benefitTitle}>Unlimited Arena Simulations</Text>
              <Text style={styles.benefitDesc}>
                High-pressure boardroom scenarios with live EXP calibration.
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <AppIcon name="radar" size={16} color={colors.primary} />
            </View>
            <View style={styles.benefitTextGroup}>
              <Text style={styles.benefitTitle}>Character Radar & Blind-Spot Analytics</Text>
              <Text style={styles.benefitDesc}>
                Continuous 5-trait tracking with vulnerability diagnosis.
              </Text>
            </View>
          </View>
        </View>

        {/* Interactive Plan Matrix: 2 Side-by-Side Cards */}
        <View style={styles.planMatrix}>
          {/* Annual Card */}
          <Pressable
            onPress={() => handleSelectPlan('annual')}
            style={[
              styles.planCard,
              selectedPlan === 'annual' && styles.planCardSelected,
            ]}
          >
            <View style={styles.planBadgeRow}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>SAVE 50%</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedPlan === 'annual' && styles.radioCircleActive,
                ]}
              >
                {selectedPlan === 'annual' && <View style={styles.radioInnerDot} />}
              </View>
            </View>

            <Text style={styles.planCadence}>ANNUAL CLEARANCE</Text>
            <Text style={styles.planPrice}>$29.99</Text>
            <Text style={styles.planSubtext}>per year ($2.50/mo)</Text>
          </Pressable>

          {/* Monthly Card */}
          <Pressable
            onPress={() => handleSelectPlan('monthly')}
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
          >
            <View style={styles.planBadgeRow}>
              <Text style={styles.flexibleTag}>FLEXIBLE</Text>
              <View
                style={[
                  styles.radioCircle,
                  selectedPlan === 'monthly' && styles.radioCircleActive,
                ]}
              >
                {selectedPlan === 'monthly' && <View style={styles.radioInnerDot} />}
              </View>
            </View>

            <Text style={styles.planCadence}>MONTHLY PASS</Text>
            <Text style={styles.planPrice}>$4.99</Text>
            <Text style={styles.planSubtext}>billed monthly</Text>
          </Pressable>
        </View>

        {/* Primary CTA Button */}
        <Pressable
          onPress={handlePurchase}
          disabled={isAuthorizing}
          style={[
            styles.ctaButton,
            isAuthorizing && styles.ctaButtonDisabled,
          ]}
        >
          {isAuthorizing ? (
            <View style={styles.ctaRow}>
              <ActivityIndicator size="small" color={colors.onPrimary} />
              <Text style={styles.ctaText}>SECURING SOVEREIGN CLEARANCE...</Text>
            </View>
          ) : (
            <View style={styles.ctaRow}>
              <Text style={styles.ctaText}>
                {selectedPlan === 'annual'
                  ? 'Start 7-Day Free Trial'
                  : 'Unlock Monthly Access'}
              </Text>
              <AppIcon name="arrow_forward" size={16} color={colors.onPrimary} />
            </View>
          )}
        </Pressable>

        <Text style={styles.footerNote}>
          {selectedPlan === 'annual'
            ? '7 days free, then $29.99/yr. Cancel anytime in App Store.'
            : '$4.99/month. Cancel anytime in App Store.'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(19, 19, 21, 0.94)',
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  restoreBtn: {
    paddingVertical: 6,
  },
  restoreText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  tierSovereignBadge: {
    backgroundColor: 'rgba(242, 202, 80, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  tierSovereignText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 18,
  },
  heroSection: {
    gap: 6,
  },
  heroSub: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.4,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.onSurface,
    lineHeight: 30,
  },
  emblemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  emblemTextGroup: {
    flex: 1,
    gap: 4,
  },
  emblemLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.outline,
    letterSpacing: 1,
  },
  emblemTitle: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  emblemDesc: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
  },
  miniRadarContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitsSection: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  benefitTextGroup: {
    flex: 1,
    gap: 2,
  },
  benefitTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 13,
    color: colors.onSurface,
  },
  benefitDesc: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    lineHeight: 15,
  },
  planMatrix: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainer,
  },
  planBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 22,
  },
  discountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountBadgeText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: colors.onPrimary,
  },
  flexibleTag: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.outline,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primary,
  },
  radioInnerDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.primary,
  },
  planCadence: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  planPrice: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.onSurface,
  },
  planSubtext: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  ctaButton: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  ctaButtonDisabled: {
    opacity: 0.8,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.onPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerNote: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
});
