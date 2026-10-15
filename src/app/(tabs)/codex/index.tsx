import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../../components/ui/TopAppBar';
import { AppIcon } from '../../../components/ui/AppIcon';
import { colors, fonts } from '../../../theme/tokens';
import { useUserStore } from '../../../store/useUserStore';


export default function CodexCatalogScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    isPro,
    curriculums,
    masteredRuleIds,
    archiveSearch,
    setArchiveSearch,
  } = useUserStore();

  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Base progress map per curriculum ID
  const baseProgress: Record<string, number> = {
    'curr-1': 11,
    'curr-2': 15,
    'curr-3': 7,
    'curr-4': 0,
    'curr-5': 9,
    'curr-6': 0,
  };

  const getMasteredCount = (currId: string, defaultRuleId: string, total: number) => {
    const isMastered = masteredRuleIds.includes(defaultRuleId);
    const base = baseProgress[currId] ?? 0;
    return Math.min(total, base + (isMastered ? 1 : 0));
  };

  const FILTER_PILLS = [
    'All',
    'Negotiation',
    'Defense',
    'Leadership',
    'Boundaries',
    'Locked Pro',
  ] as const;

  const filteredCards = (curriculums || []).filter((card) => {
    const matchesFilter =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Locked Pro'
        ? card.isPro
        : card.tag.toUpperCase().includes(activeFilter.toUpperCase());

    const matchesSearch =
      archiveSearch.trim() === ''
        ? true
        : card.title.toLowerCase().includes(archiveSearch.toLowerCase()) ||
          card.subtitle.toLowerCase().includes(archiveSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCardPress = (curr: typeof curriculums[0]) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }

    if (curr.isPro && !isPro) {
      router.push('/paywall');
    } else {
      router.push(`/(tabs)/codex/${curr.defaultRuleId}`);
    }
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="Codex" />

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subCode}>LIBRARY // CODEX ARCHIVES</Text>
          <Text style={styles.mainTitle}>Strategic Curriculums</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <AppIcon name="search" size={18} color={colors.outline} />
          <TextInput
            value={archiveSearch}
            onChangeText={setArchiveSearch}
            placeholder="Search doctrines, keywords, axioms..."
            placeholderTextColor="#696459"
            style={styles.searchInput}
          />
          {archiveSearch.length > 0 && (
            <Pressable
              onPress={() => setArchiveSearch('')}
              hitSlop={8}
            >
              <AppIcon name="cancel" size={16} color={colors.outline} />
            </Pressable>
          )}
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTER_PILLS.map((pill) => {
            const isActive = activeFilter === pill;
            return (
              <Pressable
                key={pill}
                onPress={() => {
                  try {
                    Haptics.selectionAsync();
                  } catch {
                    // safe fallback
                  }
                  setActiveFilter(pill);
                }}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {pill}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 2-Column Bento Grid */}
        <View style={styles.bentoGrid}>
          {filteredCards.map((card) => {
            const isLocked = card.isPro && !isPro;
            const mastered = getMasteredCount(card.id, card.defaultRuleId, card.totalRules);

            return (
              <Pressable
                key={card.id}
                onPress={() => handleCardPress(card)}
                style={[
                  styles.bentoCard,
                  isLocked && styles.bentoCardLocked,
                ]}
              >
                <View style={styles.bentoTop}>
                  <Text style={styles.bentoCategory}>
                    {card.tag.toUpperCase()}
                  </Text>
                  {isLocked ? (
                    <View style={styles.proLockPill}>
                      <AppIcon name="lock" size={11} color={colors.primary} />
                      <Text style={styles.proLockText}>PRO</Text>
                    </View>
                  ) : (
                    <Text style={styles.bentoProgressText}>
                      {mastered}/{card.totalRules}
                    </Text>
                  )}
                </View>

                <Text style={styles.bentoTitle} numberOfLines={2}>
                  {card.title}
                </Text>

                <Text style={styles.bentoSubtitle} numberOfLines={2}>
                  {card.subtitle}
                </Text>

                {/* Progress bar or Locked label */}
                <View style={styles.bentoFooter}>
                  {isLocked ? (
                    <Text style={styles.lockedCtaText}>Tap to Unlock Access</Text>
                  ) : (
                    <View style={styles.bentoTrack}>
                      <View
                        style={[
                          styles.bentoFill,
                          { width: `${(mastered / card.totalRules) * 100}%` },
                        ]}
                      />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Editorial Visual Intermission Card */}
        <View style={styles.intermissionCard}>
          <Text style={styles.intermissionLabel}>TACTICAL FIELD NOTE</Text>
          <Text style={styles.intermissionQuote}>
            "Never commit fully to anyone without reserving the ultimate right of silence."
          </Text>
        </View>

        {/* Bottom Unlock Pro Banner */}
        {!isPro && (
          <Pressable
            onPress={() => router.push('/paywall')}
            style={styles.unlockBanner}
          >
            <View style={styles.unlockBannerLeft}>
              <AppIcon name="bolt" size={18} color={colors.primary} />
              <View>
                <Text style={styles.unlockBannerTitle}>
                  38 OF 100 RULES DECODED
                </Text>
                <Text style={styles.unlockBannerSub}>
                  Unlock the full classified arsenal with Black Pro.
                </Text>
              </View>
            </View>
            <View style={styles.unlockBtn}>
              <Text style={styles.unlockBtnText}>UNLOCK PRO</Text>
            </View>
          </Pressable>
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
  header: {
    gap: 4,
  },
  subCode: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.4,
  },
  mainTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.onSurface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurface,
    paddingVertical: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  filterPillTextActive: {
    color: colors.onPrimary,
    fontFamily: fonts.labelSemiBold,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bentoCard: {
    width: '48%',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 14,
    gap: 8,
    minHeight: 148,
    justifyContent: 'space-between',
  },
  bentoCardLocked: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: 'rgba(242, 202, 80, 0.25)',
  },
  bentoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bentoCategory: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: colors.outline,
    letterSpacing: 0.8,
  },
  bentoProgressText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
  },
  proLockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proLockText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: colors.primary,
  },
  bentoTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.onSurface,
    lineHeight: 20,
  },
  bentoSubtitle: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    lineHeight: 15,
  },
  bentoFooter: {
    marginTop: 4,
  },
  bentoTrack: {
    height: 3,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  bentoFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  lockedCtaText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  intermissionCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  intermissionLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.2,
  },
  intermissionQuote: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 14,
    color: colors.onSurface,
    lineHeight: 20,
  },
  unlockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(242, 202, 80, 0.08)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 16,
    padding: 14,
  },
  unlockBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  unlockBannerTitle: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1,
  },
  unlockBannerSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  unlockBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  unlockBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 10,
    color: colors.onPrimary,
  },
});
