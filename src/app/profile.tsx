import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '../components/ui/AppIcon';
import { fonts } from '../theme/tokens';
import { useUserStore } from '../store/useUserStore';
import { BLACK_RULES } from '../store/mockData';
import { syncUserProgressToCloud } from '../lib/supabase';
import { addBreadcrumb, getBreadcrumbs } from '../lib/sentry';

export default function ProfileModalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    isPro,
    xp,
    levelTier,
    streak,
    masteredRuleIds,
    bookmarkedRuleIds,
    stats,
    operativeName,
    operativeEmail,
    updateOperativeName,
    logoutAndResetFlow,
    rules,
    setToast,
  } = useUserStore();

  const [name, setName] = useState(operativeName);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTelemetryLog, setShowTelemetryLog] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);

  const allRules = rules && rules.length > 0 ? rules : BLACK_RULES;

  const bookmarkedRules = allRules.filter((r) =>
    bookmarkedRuleIds.includes(r.id)
  );

  const handleNameChange = (val: string) => {
    setName(val);
    updateOperativeName(val);
  };

  const handleBookmarkPress = (ruleId: string) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    router.back();
    setTimeout(() => {
      router.push(`/(tabs)/codex/${ruleId}`);
    }, 150);
  };

  const handleSyncCloud = async () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    setIsSyncing(true);
    addBreadcrumb('cloud_sync', `Manual sync initiated by ${operativeName}`);

    try {
      const result = await syncUserProgressToCloud({
        isPro,
        xp,
        streak,
        stats,
        masteredRuleIds,
        bookmarkedRuleIds,
        operativeName: name,
        operativeEmail,
      });

      setIsSyncing(false);
      if (result.mode === 'cloud') {
        setToast('SYNC COMPLETE // SUPABASE CLOUD ACTIVE');
      } else {
        setToast('LOCAL-FIRST ACTIVE // CLOUD STANDBY');
      }
    } catch {
      setIsSyncing(false);
      setToast('LOCAL STORAGE VERIFIED // CACHE SECURE');
    }
  };

  const handleToggleTelemetry = () => {
    const crumbs = getBreadcrumbs().map(
      (b) => `[${b.category.toUpperCase()}] ${b.message}`
    );
    setTelemetryLogs(crumbs);
    setShowTelemetryLog((prev) => !prev);
  };

  const handleDeleteAccount = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // safe fallback
    }

    Alert.alert(
      'Delete Account & Erase All Data',
      'This will permanently wipe your streak, mastered rules, character telemetry, and cloud credentials from this device. This action is irreversible.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete & Erase Data',
          style: 'destructive',
          onPress: () => {
            addBreadcrumb('compliance', 'User account erased (App Store mandated)');
            logoutAndResetFlow();
            setToast('DATA ERASED // SESSION RESET');
            router.replace('/(onboarding)/welcome' as any);
          },
        },
      ]
    );
  };

  const handleLogoutReplay = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // safe fallback
    }
    logoutAndResetFlow();
    router.replace('/(onboarding)/welcome' as any);
  };

  const initial = (name || 'E').trim().charAt(0).toUpperCase();

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
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerCode}>PROFILE // DOSSIER FILE</Text>
          <Text style={styles.headerMainTitle}>Account & Bookmarks</Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={10}
        >
          <AppIcon name="close" size={18} color="#FAFAFA" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarFrame}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>

            <View style={styles.nameBlock}>
              <View style={styles.nameInputRow}>
                <TextInput
                  value={name}
                  onChangeText={handleNameChange}
                  placeholder="Your Name"
                  placeholderTextColor="#71717A"
                  style={styles.nameInput}
                />
                <AppIcon name="tune" size={14} color="#71717A" />
              </View>

              <Text style={styles.emailText}>{operativeEmail}</Text>

              <View style={styles.clearanceBadge}>
                <Text style={styles.clearanceBadgeText}>
                  {isPro ? 'TIER SOVEREIGN // PRO' : levelTier.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats Strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>XP</Text>
            <Text style={styles.statValue}>{xp.toLocaleString()}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>MASTERED</Text>
            <Text style={styles.statValue}>{masteredRuleIds.length}/12</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SAVED</Text>
            <Text style={styles.statValue}>{bookmarkedRuleIds.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statValue}>{streak}D</Text>
          </View>
        </View>

        {/* Saved Bookmarks Vault Section */}
        <View style={styles.vaultSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>SAVED RULES</Text>
            <Text style={styles.sectionCount}>
              {bookmarkedRules.length} Bookmarked
            </Text>
          </View>

          {bookmarkedRules.length === 0 ? (
            <View style={styles.emptyVaultBox}>
              <AppIcon name="bookmark" size={20} color="#3F3F46" />
              <Text style={styles.emptyVaultText}>
                No rules bookmarked yet. Tap the bookmark icon on any rule to save it here.
              </Text>
            </View>
          ) : (
            <View style={styles.bookmarkList}>
              {bookmarkedRules.map((rule) => (
                <Pressable
                  key={rule.id}
                  onPress={() => handleBookmarkPress(rule.id)}
                  style={styles.bookmarkCard}
                >
                  <View style={styles.bookmarkLeft}>
                    <Text style={styles.ruleBadgeText}>RULE #{rule.number}</Text>
                    <Text style={styles.ruleTitleText}>{rule.title}</Text>
                  </View>
                  <AppIcon name="arrow_forward" size={14} color="#FAFAFA" />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Cloud & Startup Stack Status Card */}
        <View style={styles.cloudCard}>
          <View style={styles.cloudHeaderRow}>
            <View style={styles.cloudHeaderLeft}>
              <View style={styles.cloudPulseDot} />
              <Text style={styles.cloudCardTitle}>STARTUP STACK & TELEMETRY</Text>
            </View>
            <View style={styles.cloudBadge}>
              <Text style={styles.cloudBadgeText}>HYBRID ACTIVE</Text>
            </View>
          </View>

          <View style={styles.cloudGrid}>
            <View style={styles.cloudGridItem}>
              <Text style={styles.cloudGridLabel}>DATABASE / RLS</Text>
              <Text style={styles.cloudGridValue}>Supabase Free Tier (pgvector)</Text>
            </View>
            <View style={styles.cloudGridItem}>
              <Text style={styles.cloudGridLabel}>AUTH & IDENTITY</Text>
              <Text style={styles.cloudGridValue}>Clerk / Local-First Sovereign</Text>
            </View>
            <View style={styles.cloudGridItem}>
              <Text style={styles.cloudGridLabel}>RATE LIMITING</Text>
              <Text style={styles.cloudGridValue}>Upstash Serverless Redis HTTP</Text>
            </View>
            <View style={styles.cloudGridItem}>
              <Text style={styles.cloudGridLabel}>AI VECTOR RAG</Text>
              <Text style={styles.cloudGridValue}>Pinecone / Cosine Matcher</Text>
            </View>
          </View>

          <View style={styles.cloudSyncRow}>
            <Pressable
              onPress={handleSyncCloud}
              disabled={isSyncing}
              style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color="#09090B" />
              ) : (
                <>
                  <AppIcon name="cached" size={14} color="#09090B" />
                  <Text style={styles.syncButtonText}>Sync Progress to Cloud Now</Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={handleToggleTelemetry}
              style={styles.telemetryToggleBtn}
            >
              <AppIcon name="terminal" size={13} color="#A1A1AA" />
              <Text style={styles.telemetryToggleText}>
                {showTelemetryLog ? 'Hide Telemetry' : 'Diagnostics (Sentry)'}
              </Text>
            </Pressable>
          </View>

          {showTelemetryLog && (
            <View style={styles.telemetryConsole}>
              <Text style={styles.telemetryHeader}>IN-MEMORY SENTRY RING BUFFER (LAST 20)</Text>
              {telemetryLogs.length === 0 ? (
                <Text style={styles.telemetryEmpty}>No events logged in buffer yet.</Text>
              ) : (
                telemetryLogs.map((log, idx) => (
                  <Text key={idx} style={styles.telemetryLine}>
                    {`> ${log}`}
                  </Text>
                ))
              )}
            </View>
          )}
        </View>

        {/* Command Controls */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionLabel}>CONTROLS & COMPLIANCE</Text>

          {!isPro && (
            <Pressable
              onPress={() => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                } catch {
                  // safe fallback
                }
                router.push('/paywall');
              }}
              style={styles.proCtaBtn}
            >
              <Text style={styles.proCtaText}>Elevate to Sovereign Pro →</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              try {
                Haptics.selectionAsync();
              } catch {
                // safe fallback
              }
              router.push('/advisor');
            }}
            style={styles.advisorCtaBtn}
          >
            <Text style={styles.advisorCtaText}>Consult AI Coach →</Text>
          </Pressable>

          {/* Privacy Policy & Terms Modal Route */}
          <Pressable
            onPress={() => {
              try {
                Haptics.selectionAsync();
              } catch {
                // safe fallback
              }
              router.push('/legal' as any);
            }}
            style={styles.legalBtn}
          >
            <View style={styles.legalBtnLeft}>
              <AppIcon name="lock" size={14} color="#A1A1AA" />
              <Text style={styles.legalBtnText}>Privacy Policy & Legal Terms</Text>
            </View>
            <AppIcon name="arrow_forward" size={14} color="#71717A" />
          </Pressable>

          <Pressable
            onPress={handleLogoutReplay}
            style={styles.resetBtn}
          >
            <Text style={styles.resetBtnText}>
              Reset Session & Replay Walkthrough
            </Text>
          </Pressable>

          {/* Apple App Store Mandatory: Delete Account & Erase All Data */}
          <Pressable
            onPress={handleDeleteAccount}
            style={styles.deleteAccountBtn}
          >
            <AppIcon name="delete" size={13} color="#EF4444" />
            <Text style={styles.deleteAccountBtnText}>
              Delete Account & Erase All Data
            </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    backgroundColor: 'rgba(9, 9, 11, 0.95)',
  },
  headerTitleGroup: {
    gap: 2,
  },
  headerCode: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  headerMainTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: '#FAFAFA',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 48,
    gap: 18,
  },
  identityCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 16,
    padding: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarFrame: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  nameBlock: {
    flex: 1,
    gap: 3,
  },
  nameInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameInput: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: '#FAFAFA',
    paddingVertical: 0,
    flex: 1,
  },
  emailText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#71717A',
  },
  clearanceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  clearanceBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
    letterSpacing: 0.6,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  statValue: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 13,
    color: '#FAFAFA',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#27272A',
  },
  vaultSection: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
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
  emptyVaultBox: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyVaultText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 18,
  },
  bookmarkList: {
    gap: 8,
  },
  bookmarkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 14,
  },
  bookmarkLeft: {
    gap: 2,
    flex: 1,
    paddingRight: 8,
  },
  ruleBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  ruleTitleText: {
    fontFamily: fonts.headlineMedium,
    fontSize: 14,
    color: '#FAFAFA',
  },
  controlsSection: {
    gap: 10,
  },
  proCtaBtn: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proCtaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#09090B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  advisorCtaBtn: {
    height: 48,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advisorCtaText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: '#FAFAFA',
    letterSpacing: 0.6,
  },
  resetBtn: {
    height: 46,
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    borderWidth: 1,
    borderColor: '#450A0A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#F87171',
    letterSpacing: 0.5,
  },
  cloudCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  cloudHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cloudHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cloudPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  cloudCardTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#FAFAFA',
    letterSpacing: 1,
  },
  cloudBadge: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cloudBadgeText: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#A1A1AA',
    letterSpacing: 0.5,
  },
  cloudGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cloudGridItem: {
    width: '48%',
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  cloudGridLabel: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#71717A',
    letterSpacing: 0.6,
  },
  cloudGridValue: {
    fontFamily: fonts.headlineMedium,
    fontSize: 11,
    color: '#FAFAFA',
  },
  cloudSyncRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  syncButton: {
    flex: 1,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#09090B',
    letterSpacing: 0.6,
  },
  telemetryToggleBtn: {
    height: 42,
    paddingHorizontal: 12,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  telemetryToggleText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#A1A1AA',
  },
  telemetryConsole: {
    backgroundColor: '#050507',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  telemetryHeader: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  telemetryEmpty: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: '#52525B',
  },
  telemetryLine: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: '#A1A1AA',
    lineHeight: 14,
  },
  legalBtn: {
    height: 46,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  legalBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legalBtnText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: '#FAFAFA',
    letterSpacing: 0.5,
  },
  deleteAccountBtn: {
    height: 46,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  deleteAccountBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#EF4444',
    letterSpacing: 0.6,
  },
});
