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
import { fonts } from '../theme/tokens';

type LegalTab = 'Privacy Policy' | 'Terms of Service' | 'Subscription & Billing';

const TABS: LegalTab[] = [
  'Privacy Policy',
  'Terms of Service',
  'Subscription & Billing',
];

export default function LegalModalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LegalTab>('Privacy Policy');

  const handleSelectTab = (tab: LegalTab) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    setActiveTab(tab);
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top + 8, 20),
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerCode}>LEGAL COMPLIANCE // PROTOCOL</Text>
          <Text style={styles.headerTitle}>Legal & Privacy Policy</Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={10}
        >
          <AppIcon name="close" size={18} color="#FAFAFA" />
        </Pressable>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => handleSelectTab(tab)}
              style={[
                styles.tabItem,
                isSelected && styles.tabItemActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isSelected && styles.tabTextActive,
                ]}
              >
                {tab === 'Subscription & Billing' ? 'Billing' : tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Content ScrollView */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Privacy Policy' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Policy</Text>
            <Text style={styles.lastUpdated}>Last Updated: October 2026</Text>

            <Text style={styles.paragraph}>
              Black Rules is engineered with a strict local-first architecture. We believe that personal character training, psychological notes, and behavioral assessments belong solely to you.
            </Text>

            <Text style={styles.subHeading}>1. Information We Collect</Text>
            <Text style={styles.paragraph}>
              • Account Data: If you create an account, we store your email and operative display name to sync your mastered rules across devices.{'\n'}
              • Device Telemetry: Anonymous performance metrics and crash logs via Sentry to maintain high availability.{'\n'}
              • Local Assessment Data: Your radar scores and completed scenarios are saved locally on your device via AsyncStorage.
            </Text>

            <Text style={styles.subHeading}>2. Zero Third-Party Advertising</Text>
            <Text style={styles.paragraph}>
              We do not sell, license, or monetize your data with third-party advertisers or data brokers. All situational analyses typed into the AI Coach are ephemeral and processed strictly for your session.
            </Text>

            <Text style={styles.subHeading}>3. Account Deletion & Right to Erasure</Text>
            <Text style={styles.paragraph}>
              In full compliance with Apple and Google Play Store guidelines, you can permanently delete your profile, diagnostics, and telemetry at any time via the "Delete Account & Erase Data" button in your Profile Dossier.
            </Text>
          </View>
        )}

        {activeTab === 'Terms of Service' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms of Service</Text>
            <Text style={styles.lastUpdated}>Effective Date: October 2026</Text>

            <Text style={styles.paragraph}>
              By accessing or using the Black Rules mobile application, you agree to comply with and be bound by these Terms of Service.
            </Text>

            <Text style={styles.subHeading}>1. Educational & Strategic Purpose</Text>
            <Text style={styles.paragraph}>
              Black Rules provides strategic principles, communication frameworks, and behavioral training simulations based on classical literature and human nature analysis. The content is for personal development and educational purposes only.
            </Text>

            <Text style={styles.subHeading}>2. Acceptable Conduct</Text>
            <Text style={styles.paragraph}>
              You agree not to use the application or its AI advisory services to generate harassment, defamation, or illegal activities. We reserve the right to suspend accounts that abuse rate limits.
            </Text>

            <Text style={styles.subHeading}>3. Intellectual Property</Text>
            <Text style={styles.paragraph}>
              All logos, pixel art designs, B Monograms, editorial curriculums, and custom scenario simulations are the exclusive intellectual property of Black Rules.
            </Text>
          </View>
        )}

        {activeTab === 'Subscription & Billing' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription & Billing Terms</Text>
            <Text style={styles.lastUpdated}>Apple App Store & Google Play Terms</Text>

            <Text style={styles.paragraph}>
              Black Rules offers an optional auto-renewing premium subscription ("Sovereign Pro") to access all 12 rules, unlimited AI Coach sessions, and full simulation rooms.
            </Text>

            <Text style={styles.subHeading}>1. Free Trial & Auto-Renewal</Text>
            <Text style={styles.paragraph}>
              • 7-Day Trial: If offered, the trial period provides full access for 7 days. Unless cancelled at least 24 hours before the trial ends, your Apple ID or Google Play account will be charged $29.99/year.{'\n'}
              • Monthly Plan: Billed at $4.99/month on a recurring cycle until cancelled.
            </Text>

            <Text style={styles.subHeading}>2. Managing & Cancelling Subscriptions</Text>
            <Text style={styles.paragraph}>
              You can manage or cancel your subscription at any time through your Apple ID Account Settings (iOS) or Google Play Subscriptions menu (Android). Cancellations take effect at the end of the current billing period.
            </Text>

            <Text style={styles.subHeading}>3. Restoring Purchases</Text>
            <Text style={styles.paragraph}>
              If you reinstall the app or change devices, tap "Restore Access" on the paywall screen to reinstate your active entitlements with zero additional charges.
            </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    backgroundColor: 'rgba(9, 9, 11, 0.95)',
  },
  headerLeft: {
    gap: 2,
  },
  headerCode: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: '#FAFAFA',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#121215',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  tabText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#A1A1AA',
  },
  tabTextActive: {
    color: '#09090B',
    fontFamily: fonts.labelSemiBold,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: '#FAFAFA',
  },
  lastUpdated: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    marginBottom: 6,
  },
  subHeading: {
    fontFamily: fonts.headlineMedium,
    fontSize: 15,
    color: '#FAFAFA',
    marginTop: 10,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#D4D4D8',
    lineHeight: 20,
  },
});
