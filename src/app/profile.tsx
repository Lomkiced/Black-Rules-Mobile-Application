import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
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
    levelTier,
    streak,
    masteredRuleIds,
    bookmarkedRuleIds,
    operativeName,
    operativeEmail,
    updateOperativeName,
    logoutAndResetFlow,
    rules,
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

  const handleLogoutReplay = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // safe fallback
    }
    logoutAndResetFlow();
    router.replace('/(onboarding)/welcome' as any);
  };

  const initial = (operativeName || 'E').trim().charAt(0).toUpperCase();

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

        {/* Command Controls */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionLabel}>ACTIONS</Text>

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

          <Pressable
            onPress={handleLogoutReplay}
            style={styles.resetBtn}
          >
            <Text style={styles.resetBtnText}>
              Reset Session & Replay Walkthrough
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
});
