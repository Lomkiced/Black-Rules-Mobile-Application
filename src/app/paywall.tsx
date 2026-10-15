import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '../components/ui/AppIcon';
import { LoadingDots } from '../components/ui/LoadingOverlay';
import { fonts } from '../theme/tokens';
import { useUserStore } from '../store/useUserStore';
import {
  purchaseProPlan,
  restoreProPurchases,
  openStripeWebCheckout,
} from '../lib/revenuecat';

type PlanType = 'annual' | 'monthly';

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setPro, setToast } = useUserStore();

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

  const handleRestore = async () => {
    if (restoreStatus !== 'idle') return;
    try {
      Haptics.selectionAsync();
    } catch {
      // fallback
    }
    setRestoreStatus('connecting');

    const result = await restoreProPurchases();
    if (result.restored) {
      setRestoreStatus('verified');
      setPro(true);
      setToast('ENTITLEMENT RESTORED // SOVEREIGN PRO');
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // fallback
      }
      setTimeout(() => {
        router.back();
      }, 700);
    } else {
      setRestoreStatus('idle');
      setToast('NO ACTIVE ENTITLEMENT FOUND');
    }
  };

  const handlePurchase = async () => {
    if (isAuthorizing) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // fallback
    }
    setIsAuthorizing(true);

    const result = await purchaseProPlan(selectedPlan);
    setIsAuthorizing(false);

    if (result.success) {
      setPro(true);
      setToast('SOVEREIGN ACCESS UNLOCKED // PRO');
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // fallback
      }
      router.back();
    } else if (result.error && result.error !== 'PURCHASE_CANCELLED') {
      setToast(`CHECKOUT: ${result.error}`);
    }
  };

  const handleStripeFallback = async () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // fallback
    }
    const opened = await openStripeWebCheckout();
    if (!opened) {
      setToast('STRIPE LINK NOT CONFIGURED');
    }
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

        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>SOVEREIGN PRO</Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.closeBtn}
          accessibilityLabel="Close"
        >
          <AppIcon name="close" size={18} color="#FAFAFA" />
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
          <Text style={styles.heroSub}>UNRESTRICTED ACCESS</Text>
          <Text style={styles.heroTitle}>
            Master Every Law of Human Nature
          </Text>
          <Text style={styles.heroDescription}>
            Get full access to all 12 Black Rules, premium practice scenarios, unlimited AI Coach sessions, and continuous character telemetry.
          </Text>
        </View>

        {/* 3 Benefit Rows */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <AppIcon name="auto_stories" size={15} color="#09090B" />
            </View>
            <View style={styles.benefitTextGroup}>
              <Text style={styles.benefitTitle}>All 12 Black Rules & Defenses</Text>
              <Text style={styles.benefitDesc}>
                Reading People, Office Strategy, and complete psychological mechanics.
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <AppIcon name="swords" size={15} color="#09090B" />
            </View>
            <View style={styles.benefitTextGroup}>
              <Text style={styles.benefitTitle}>Advanced Practice Scenarios</Text>
              <Text style={styles.benefitDesc}>
                Realistic dilemmas on public ambushes, disrespectful jokes, and credit theft.
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <AppIcon name="bolt" size={15} color="#09090B" />
            </View>
            <View style={styles.benefitTextGroup}>
              <Text style={styles.benefitTitle}>Unlimited AI Coach Consultations</Text>
              <Text style={styles.benefitDesc}>
                Instant verbal defense scripts and tactical framing for any real-life situation.
              </Text>
            </View>
          </View>
        </View>

        {/* Plan Cards */}
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
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>SAVE 50%</Text>
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

            <Text style={styles.planCadence}>ANNUAL PASS</Text>
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
          style={[styles.ctaButton, isAuthorizing && styles.ctaButtonDisabled]}
        >
          {isAuthorizing ? (
            <LoadingDots size={6} color="#09090B" />
          ) : (
            <Text style={styles.ctaText}>
              {selectedPlan === 'annual'
                ? 'Start 7-Day Free Trial →'
                : 'Unlock Monthly Access →'}
            </Text>
          )}
        </Pressable>

        {/* Web Checkout Secondary Option */}
        <Pressable
          onPress={handleStripeFallback}
          style={styles.stripeBtn}
        >
          <AppIcon name="lock" size={13} color="#A1A1AA" />
          <Text style={styles.stripeBtnText}>Pay with Card via Stripe Web Checkout</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          {selectedPlan === 'annual'
            ? '7 days free, then $29.99/year. Cancel anytime in App Store / Play Store settings.'
            : '$4.99/month. Cancel anytime in Store settings.'}
        </Text>

        {/* App Store & Google Play Mandatory Compliance Links */}
        <View style={styles.complianceLinksRow}>
          <Pressable
            onPress={() => router.push('/legal' as any)}
            hitSlop={8}
          >
            <Text style={styles.complianceLink}>Terms of Service</Text>
          </Pressable>

          <Text style={styles.complianceDot}>•</Text>

          <Pressable
            onPress={() => router.push('/legal' as any)}
            hitSlop={8}
          >
            <Text style={styles.complianceLink}>Privacy Policy</Text>
          </Pressable>

          <Text style={styles.complianceDot}>•</Text>

          <Pressable
            onPress={handleRestore}
            hitSlop={8}
          >
            <Text style={styles.complianceLink}>Restore</Text>
          </Pressable>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(9, 9, 11, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  restoreBtn: {
    paddingVertical: 6,
  },
  restoreText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#A1A1AA',
    letterSpacing: 0.5,
  },
  tierBadge: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  tierBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#FAFAFA',
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 18,
  },
  heroSection: {
    gap: 6,
  },
  heroSub: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: '#FAFAFA',
    lineHeight: 30,
  },
  heroDescription: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 19,
    marginTop: 2,
  },
  benefitsSection: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  benefitTextGroup: {
    flex: 1,
    gap: 2,
  },
  benefitTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 14,
    color: '#FAFAFA',
  },
  benefitDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 16,
  },
  planMatrix: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  planCardSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#18181B',
  },
  planBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveBadgeText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 8,
    color: '#09090B',
  },
  flexibleTag: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#71717A',
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#71717A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#FFFFFF',
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  planCadence: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  planPrice: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 22,
    color: '#FAFAFA',
  },
  planSubtext: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: '#A1A1AA',
  },
  ctaButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  ctaButtonDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 13,
    color: '#09090B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  footerNote: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 14,
  },
  stripeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
  },
  stripeBtnText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#A1A1AA',
    letterSpacing: 0.4,
  },
  complianceLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  complianceLink: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#A1A1AA',
    textDecorationLine: 'underline',
  },
  complianceDot: {
    color: '#3F3F46',
    fontSize: 12,
  },
});
