import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '../components/ui/AppIcon';
import { fonts } from '../theme/tokens';
import { useUserStore } from '../store/useUserStore';
import { BLACK_RULES } from '../store/mockData';

export default function ProfileModalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    isPro,
    xp,
    streak,
    masteredRuleIds,
    bookmarkedRuleIds,
    operativeName,
    operativeEmail,
    selectedFocus,
    hapticsEnabled,
    reminderTime,
    updateOperativeName,
    toggleHaptics,
    cycleReminderTime,
    logoutAndResetFlow,
    resetProgress,
    rules,
    setToast,
  } = useUserStore();

  const [name, setName] = useState(operativeName);

  const allRules = rules && rules.length > 0 ? rules : BLACK_RULES;
  const bookmarkedRules = allRules.filter((r) =>
    bookmarkedRuleIds.includes(r.id)
  );

  const handleNameChange = (val: string) => {
    setName(val);
    updateOperativeName(val);
  };

  const handleBookmarkPress = (ruleId: string) => {
    if (hapticsEnabled) {
      try {
        Haptics.selectionAsync();
      } catch {
        // safe fallback
      }
    }
    router.back();
    setTimeout(() => {
      router.push(`/(tabs)/codex/${ruleId}` as any);
    }, 150);
  };

  const handleToggleHaptics = () => {
    toggleHaptics();
    if (!hapticsEnabled) {
      // It will turn ON
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // safe fallback
      }
    }
  };

  const handleCycleReminder = () => {
    if (hapticsEnabled) {
      try {
        Haptics.selectionAsync();
      } catch {
        // safe fallback
      }
    }
    cycleReminderTime();
  };

  const handleReplayIntro = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // safe fallback
      }
    }
    logoutAndResetFlow();
    router.replace('/(onboarding)/welcome' as any);
  };

  const handleSignOut = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // safe fallback
      }
    }
    router.replace('/(auth)/login' as any);
  };

  const handleResetProgress = () => {
    if (hapticsEnabled) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {
        // safe fallback
      }
    }

    Alert.alert(
      'Reset All Progress',
      'Are you sure you want to reset your XP, streaks, and learned rules to default values? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Progress',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            setToast('PROGRESS RESET TO DEFAULT');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    if (hapticsEnabled) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {
        // safe fallback
      }
    }

    Alert.alert(
      'Delete Account & Erase All Data',
      'This will permanently wipe your profile, streak, mastered rules, and saved preferences from this device. This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete & Erase Data',
          style: 'destructive',
          onPress: () => {
            logoutAndResetFlow();
            setToast('DATA ERASED // SESSION RESET');
            router.replace('/(onboarding)/welcome' as any);
          },
        },
      ]
    );
  };

  const initial = (name || 'E').trim().charAt(0).toUpperCase();

  return (
    <View style={styles.root}>
      {/* Top Navigation Bar */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top + 8, 20),
          },
        ]}
      >
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerCode}>ACCOUNT // SETTINGS</Text>
          <Text style={styles.headerMainTitle}>Account & Preferences</Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={10}
          accessibilityLabel="Close"
        >
          <AppIcon name="close" size={18} color="#FAFAFA" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
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
                <AppIcon name="edit" size={14} color="#71717A" />
              </View>

              <Text style={styles.emailText}>{operativeEmail || 'user@blackrules.io'}</Text>

              <View
                style={[
                  styles.clearanceBadge,
                  isPro && styles.clearanceBadgePro,
                ]}
              >
                <Text
                  style={[
                    styles.clearanceBadgeText,
                    isPro && styles.clearanceBadgeProText,
                  ]}
                >
                  {isPro ? 'PRO MEMBER' : 'FREE PLAN'}
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
            <Text style={styles.statLabel}>LEARNED</Text>
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

        {/* Membership Banner (if !isPro) */}
        {!isPro && (
          <View style={styles.proBannerCard}>
            <View style={styles.proBannerHeader}>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>SOVEREIGN</Text>
              </View>
              <Text style={styles.proBannerTitle}>Upgrade to Black Rules Pro</Text>
            </View>
            <Text style={styles.proBannerDesc}>
              Unlock all 12 rules, unlimited practice scenarios, and instant AI Coach consultations.
            </Text>
            <Pressable
              onPress={() => {
                if (hapticsEnabled) {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  } catch {
                    // safe fallback
                  }
                }
                router.push('/paywall');
              }}
              style={styles.proBannerBtn}
            >
              <Text style={styles.proBannerBtnText}>Unlock Pro Pass →</Text>
            </Pressable>
          </View>
        )}

        {/* Saved Rules Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>SAVED RULES</Text>
            <Text style={styles.sectionCount}>
              {bookmarkedRules.length} Bookmarked
            </Text>
          </View>

          {bookmarkedRules.length === 0 ? (
            <View style={styles.emptyVaultBox}>
              <AppIcon name="bookmark" size={20} color="#52525B" />
              <Text style={styles.emptyVaultText}>
                No rules bookmarked yet. Tap the bookmark icon on any rule card to save it here for quick access.
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

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>APP PREFERENCES</Text>

          <View style={styles.prefGroup}>
            {/* Haptic Feedback Toggle Row */}
            <View style={styles.prefRow}>
              <View style={styles.prefLeft}>
                <View style={styles.prefIconFrame}>
                  <AppIcon name="vibration" size={16} color="#FAFAFA" />
                </View>
                <View style={styles.prefTextGroup}>
                  <Text style={styles.prefTitle}>Haptic Feedback</Text>
                  <Text style={styles.prefDesc}>Subtle vibration on taps and habit completion</Text>
                </View>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={handleToggleHaptics}
                trackColor={{ false: '#27272A', true: '#FAFAFA' }}
                thumbColor={hapticsEnabled ? '#09090B' : '#71717A'}
                ios_backgroundColor="#27272A"
              />
            </View>

            <View style={styles.prefDivider} />

            {/* Daily Reminder Time Row */}
            <Pressable
              onPress={handleCycleReminder}
              style={styles.prefRow}
            >
              <View style={styles.prefLeft}>
                <View style={styles.prefIconFrame}>
                  <AppIcon name="alarm" size={16} color="#FAFAFA" />
                </View>
                <View style={styles.prefTextGroup}>
                  <Text style={styles.prefTitle}>Daily Habit Reminder</Text>
                  <Text style={styles.prefDesc}>Scheduled reminder for your daily rule habit</Text>
                </View>
              </View>
              <View style={styles.reminderPill}>
                <Text style={styles.reminderPillText}>{reminderTime}</Text>
                <AppIcon name="unfold_more" size={13} color="#A1A1AA" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* About & Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT & COMPLIANCE</Text>

          <View style={styles.actionGroup}>
            {/* Privacy Policy & Terms */}
            <Pressable
              onPress={() => {
                if (hapticsEnabled) {
                  try {
                    Haptics.selectionAsync();
                  } catch {
                    // safe fallback
                  }
                }
                router.push('/legal' as any);
              }}
              style={styles.actionRow}
            >
              <View style={styles.actionLeft}>
                <AppIcon name="verified_user" size={16} color="#A1A1AA" />
                <Text style={styles.actionTitle}>Privacy Policy & Terms of Use</Text>
              </View>
              <AppIcon name="arrow_forward" size={14} color="#71717A" />
            </Pressable>

            <View style={styles.actionDivider} />

            {/* Replay App Walkthrough */}
            <Pressable
              onPress={handleReplayIntro}
              style={styles.actionRow}
            >
              <View style={styles.actionLeft}>
                <AppIcon name="play_arrow" size={16} color="#A1A1AA" />
                <Text style={styles.actionTitle}>Replay App Introduction</Text>
              </View>
              <AppIcon name="arrow_forward" size={14} color="#71717A" />
            </Pressable>

            <View style={styles.actionDivider} />

            {/* Sign Out */}
            <Pressable
              onPress={handleSignOut}
              style={styles.actionRow}
            >
              <View style={styles.actionLeft}>
                <AppIcon name="logout" size={16} color="#A1A1AA" />
                <Text style={styles.actionTitle}>Sign Out</Text>
              </View>
              <AppIcon name="arrow_forward" size={14} color="#71717A" />
            </Pressable>

            <View style={styles.actionDivider} />

            {/* Reset All Progress */}
            <Pressable
              onPress={handleResetProgress}
              style={styles.actionRow}
            >
              <View style={styles.actionLeft}>
                <AppIcon name="restart_alt" size={16} color="#F87171" />
                <Text style={[styles.actionTitle, { color: '#F87171' }]}>
                  Reset All Progress
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Apple App Store Mandatory: Delete Account */}
          <Pressable
            onPress={handleDeleteAccount}
            style={styles.deleteBtn}
          >
            <AppIcon name="delete_forever" size={15} color="#EF4444" />
            <Text style={styles.deleteBtnText}>Delete Account & Erase All Data</Text>
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
    gap: 20,
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
    fontSize: 20,
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
  clearanceBadgePro: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  clearanceBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
    letterSpacing: 0.6,
  },
  clearanceBadgeProText: {
    color: '#09090B',
    fontFamily: fonts.labelSemiBold,
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
  proBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  proBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proBadge: {
    backgroundColor: '#09090B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proBadgeText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 8,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  proBannerTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 15,
    color: '#09090B',
  },
  proBannerDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#3F3F46',
    lineHeight: 16,
  },
  proBannerBtn: {
    height: 40,
    backgroundColor: '#09090B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  proBannerBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  section: {
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
  prefGroup: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  prefIconFrame: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefTextGroup: {
    flex: 1,
    gap: 2,
  },
  prefTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 13,
    color: '#FAFAFA',
  },
  prefDesc: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: '#71717A',
    lineHeight: 14,
  },
  prefDivider: {
    height: 1,
    backgroundColor: '#27272A',
    marginLeft: 60,
  },
  reminderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reminderPillText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#FAFAFA',
  },
  actionGroup: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionTitle: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: '#FAFAFA',
    letterSpacing: 0.4,
  },
  actionDivider: {
    height: 1,
    backgroundColor: '#27272A',
    marginLeft: 44,
  },
  deleteBtn: {
    height: 46,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  deleteBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#EF4444',
    letterSpacing: 0.6,
  },
});
