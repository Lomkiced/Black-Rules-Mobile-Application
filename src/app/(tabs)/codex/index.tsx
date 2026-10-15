import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../../components/ui/TopAppBar';
import { AppIcon } from '../../../components/ui/AppIcon';
import { colors, fonts } from '../../../theme/tokens';
import { useUserStore } from '../../../store/useUserStore';

type FilterType = 'All' | 'Free' | 'Pro' | 'Saved';

export default function CodexCatalogScreen() {
  const router = useRouter();

  const {
    isPro,
    rules,
    masteredRuleIds,
    bookmarkedRuleIds,
    archiveSearch,
    setArchiveSearch,
  } = useUserStore();

  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const FILTER_PILLS: FilterType[] = ['All', 'Free', 'Pro', 'Saved'];

  const filteredRules = (rules || []).filter((rule) => {
    // Filter by type
    if (activeFilter === 'Free' && rule.isPro) return false;
    if (activeFilter === 'Pro' && !rule.isPro) return false;
    if (activeFilter === 'Saved' && !bookmarkedRuleIds.includes(rule.id)) return false;

    // Search query
    if (archiveSearch.trim() !== '') {
      const q = archiveSearch.toLowerCase();
      const matchNumber = rule.number.includes(q);
      const matchTitle = rule.title.toLowerCase().includes(q);
      const matchSummary = rule.summary.toLowerCase().includes(q);
      const matchCategory = rule.category.toLowerCase().includes(q);
      if (!matchNumber && !matchTitle && !matchSummary && !matchCategory) {
        return false;
      }
    }

    return true;
  });

  // Group filtered rules by category
  const categories = Array.from(new Set(filteredRules.map((r) => r.category)));

  const handleRulePress = (ruleId: string, ruleIsPro: boolean) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }

    if (ruleIsPro && !isPro) {
      router.push('/paywall');
    } else {
      router.push(`/(tabs)/codex/${ruleId}`);
    }
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="Rules" />

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
          <Text style={styles.subCode}>THE 12 BLACK RULES</Text>
          <Text style={styles.mainTitle}>Master Directory</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <AppIcon name="search" size={16} color="#71717A" />
          <TextInput
            value={archiveSearch}
            onChangeText={setArchiveSearch}
            placeholder="Search rules, keywords, habits..."
            placeholderTextColor="#71717A"
            style={styles.searchInput}
          />
          {archiveSearch.length > 0 && (
            <Pressable onPress={() => setArchiveSearch('')} hitSlop={8}>
              <AppIcon name="cancel" size={16} color="#71717A" />
            </Pressable>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
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
        </View>

        {/* Grouped Rules List */}
        {categories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No rules matched your filter.</Text>
          </View>
        ) : (
          categories.map((cat) => {
            const rulesInCat = filteredRules.filter((r) => r.category === cat);
            return (
              <View key={cat} style={styles.categoryGroup}>
                <Text style={styles.categoryHeader}>{cat}</Text>

                <View style={styles.rulesList}>
                  {rulesInCat.map((rule) => {
                    const isLearned = masteredRuleIds.includes(rule.id);
                    const isSaved = bookmarkedRuleIds.includes(rule.id);
                    const isLocked = rule.isPro && !isPro;

                    return (
                      <Pressable
                        key={rule.id}
                        onPress={() => handleRulePress(rule.id, rule.isPro)}
                        style={[
                          styles.ruleRowCard,
                          isLocked && styles.ruleRowCardLocked,
                        ]}
                      >
                        <View style={styles.ruleRowLeft}>
                          {/* Rule Number Monogram Box */}
                          <View
                            style={[
                              styles.numberBox,
                              isLearned && styles.numberBoxLearned,
                            ]}
                          >
                            <Text
                              style={[
                                styles.numberBoxText,
                                isLearned && styles.numberBoxTextLearned,
                              ]}
                            >
                              {rule.number}
                            </Text>
                          </View>

                          {/* Rule Content */}
                          <View style={styles.ruleTextCol}>
                            <View style={styles.ruleBadgeRow}>
                              <Text style={styles.ruleTitleText}>{rule.title}</Text>
                              {rule.isPro && (
                                <View style={styles.proTag}>
                                  <Text style={styles.proTagText}>PRO</Text>
                                </View>
                              )}
                              {isLearned && (
                                <View style={styles.learnedTag}>
                                  <Text style={styles.learnedTagText}>Learned</Text>
                                </View>
                              )}
                              {isSaved && (
                                <View style={styles.savedTag}>
                                  <Text style={styles.savedTagText}>Saved</Text>
                                </View>
                              )}
                            </View>

                            <Text style={styles.ruleSummaryText} numberOfLines={2}>
                              {rule.summary}
                            </Text>
                          </View>
                        </View>

                        <AppIcon
                          name="arrow_forward"
                          size={14}
                          color="#71717A"
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })
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
  header: {
    gap: 2,
  },
  subCode: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  mainTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: '#FAFAFA',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#FAFAFA',
    paddingVertical: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  filterPillText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#A1A1AA',
  },
  filterPillTextActive: {
    color: '#09090B',
    fontFamily: fonts.labelSemiBold,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: '#71717A',
  },
  categoryGroup: {
    gap: 8,
  },
  categoryHeader: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
    marginTop: 6,
  },
  rulesList: {
    gap: 8,
  },
  ruleRowCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ruleRowCardLocked: {
    backgroundColor: '#09090B',
  },
  ruleRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  numberBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBoxLearned: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  numberBoxText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#A1A1AA',
  },
  numberBoxTextLearned: {
    color: '#09090B',
  },
  ruleTextCol: {
    flex: 1,
    gap: 3,
  },
  ruleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  ruleTitleText: {
    fontFamily: fonts.headlineMedium,
    fontSize: 14,
    color: '#FAFAFA',
  },
  proTag: {
    backgroundColor: '#27272A',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  proTagText: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#FFFFFF',
  },
  learnedTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  learnedTagText: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#FAFAFA',
  },
  savedTag: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  savedTagText: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#A1A1AA',
  },
  ruleSummaryText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#71717A',
    lineHeight: 16,
  },
});
