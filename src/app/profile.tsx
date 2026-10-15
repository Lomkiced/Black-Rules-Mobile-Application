import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '../components/ui/AppIcon';
import { colors, fonts } from '../theme/tokens';
import { useUserStore } from '../store/useUserStore';
import { BLACK_RULES } from '../store/mockData';

const AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrGG84acRosCC5hZ-eL73H6Ptl9iHaPEf11DlKHKInScqxXhEFhGr8i9juFcJ7DB94XJHaeaxtvvOGqxATmJpa27fMA5cLBS4uk6ad6HrkmqlTHg3i1H1ttqwCJ5vKuU5GzZVvrH2wIlfG1By_lv4bMOAJKWkqCauXwPKMBnuCqiWcJvwHIWyFlkDXEMC5blfRMcecNVJfYeVVxmDDQ8pWpKzok8P7BICPAMVqQygiXIZ8nF6W-e6z2w';

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
          <Text style={styles.headerCode}>OPERATIVE DOSSIER // CLEARANCE FILE</Text>
          <Text style={styles.headerMainTitle}>Security Dossier</Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={10}
        >
          <AppIcon name="close" size={20} color={colors.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Operative Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarFrame}>
              <Image source={{ uri: AVATAR_URI }} style={styles.avatarImage} />
            </View>

            <View style={styles.nameBlock}>
              <View style={styles.nameInputRow}>
                <TextInput
                  value={name}
                  onChangeText={handleNameChange}
                  placeholder="Operative Name"
                  placeholderTextColor="#696459"
                  style={styles.nameInput}
                />
                <AppIcon name="tune" size={14} color={colors.outline} />
              </View>

              <Text style={styles.emailText}>{operativeEmail}</Text>

              <View
                style={[
                  styles.clearanceBadge,
                  isPro ? styles.clearanceBadgePro : styles.clearanceBadgeStandard,
                ]}
              >
                <AppIcon
                  name={isPro ? 'verified' : 'military_tech'}
                  size={12}
                  color={colors.primary}
                />
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
            <Text style={styles.statLabel}>EXPERIENCE</Text>
            <Text style={styles.statValue}>{xp} XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>MASTERED</Text>
            <Text style={styles.statValue}>{masteredRuleIds.length}/48</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>BOOKMARKED</Text>
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
            <Text style={styles.sectionLabel}>SAVED AXIOMS // CODEX VAULT</Text>
            <Text style={styles.sectionCount}>
              {bookmarkedRules.length} STORED
            </Text>
          </View>

          {bookmarkedRules.length === 0 ? (
            <View style={styles.emptyVaultBox}>
              <AppIcon name="bookmark" size={20} color={colors.outlineVariant} />
              <Text style={styles.emptyVaultText}>
                No axioms bookmarked in Codex.
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
                  <AppIcon name="arrow_forward" size={15} color={colors.primary} />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Sovereign Command Controls */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionLabel}>COMMAND ACTIONS</Text>

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
              <View style={styles.btnRow}>
                <AppIcon name="bolt" size={16} color={colors.onPrimary} />
                <Text style={styles.proCtaText}>Elevate to Sovereign Pro →</Text>
              </View>
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
            <View style={styles.btnRow}>
              <AppIcon name="psychology" size={16} color={colors.primary} />
              <Text style={styles.advisorCtaText}>Consult AI Strategic Advisor →</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleLogoutReplay}
            style={styles.resetBtn}
          >
            <View style={styles.btnRow}>
              <AppIcon name="lock" size={15} color="#FCA5A5" />
              <Text style={styles.resetBtnText}>
                Lock Vault & Replay Onboarding Walkthrough
              </Text>
            </View>
          </Pressable>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: 'rgba(19, 19, 21, 0.95)',
  },
  headerTitleGroup: {
    gap: 3,
  },
  headerCode: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.6,
  },
  headerMainTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.onSurface,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 48,
    gap: 20,
  },
  identityCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 18,
    padding: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarFrame: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  nameBlock: {
    flex: 1,
    gap: 4,
  },
  nameInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameInput: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.onSurface,
    paddingVertical: 0,
    flex: 1,
  },
  emailText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  clearanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  clearanceBadgePro: {
    backgroundColor: 'rgba(242, 202, 80, 0.15)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  clearanceBadgeStandard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  clearanceBadgeText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
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
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.outline,
    letterSpacing: 0.8,
  },
  statValue: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.primary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.outlineVariant,
  },
  vaultSection: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.outline,
    letterSpacing: 1.2,
  },
  sectionCount: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.primary,
  },
  emptyVaultBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyVaultText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.outline,
  },
  bookmarkList: {
    gap: 10,
  },
  bookmarkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
  },
  bookmarkLeft: {
    gap: 3,
    flex: 1,
    paddingRight: 8,
  },
  ruleBadgeText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1,
  },
  ruleTitleText: {
    fontFamily: fonts.headlineMedium,
    fontSize: 14,
    color: colors.onSurface,
  },
  controlsSection: {
    gap: 12,
  },
  proCtaBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proCtaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.onPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  advisorCtaBtn: {
    height: 50,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.4)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advisorCtaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  resetBtn: {
    height: 48,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#FCA5A5',
    letterSpacing: 0.6,
  },
});
