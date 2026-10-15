import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '../../../components/ui/AppIcon';
import { PixelArtBanner } from '../../../components/ui/PixelArtBanner';
import { colors, fonts } from '../../../theme/tokens';
import { useUserStore } from '../../../store/useUserStore';
import { BLACK_RULES } from '../../../store/mockData';

type RuleTab = 'The Rule' | 'Why It Works' | 'How to Use It';

const RULE_TABS: RuleTab[] = ['The Rule', 'Why It Works', 'How to Use It'];

export default function CodexReaderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    isPro,
    bookmarkedRuleIds,
    masteredRuleIds,
    toggleBookmarkedRule,
    toggleMasteredRule,
  } = useUserStore();

  const initialIndex = BLACK_RULES.findIndex(
    (r) => r.id === id || r.number === id
  );
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  const currentRule = BLACK_RULES[currentIndex] || BLACK_RULES[0];
  const isBookmarked = bookmarkedRuleIds.includes(currentRule.id);
  const isMastered = masteredRuleIds.includes(currentRule.id);

  const [activeTab, setActiveTab] = useState<RuleTab>('The Rule');

  const handleShare = async () => {
    try {
      Haptics.selectionAsync();
      await Share.share({
        message: `BLACK RULE #${currentRule.number}: ${currentRule.title}.\n${currentRule.summary}\n\n#BlackRules`,
      });
    } catch {
      // safe fallback
    }
  };

  const handlePrevRule = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    const prevIndex = (currentIndex - 1 + BLACK_RULES.length) % BLACK_RULES.length;
    setCurrentIndex(prevIndex);
    setActiveTab('The Rule');
  };

  const handleNextRule = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    const nextIndex = (currentIndex + 1) % BLACK_RULES.length;
    const nextRule = BLACK_RULES[nextIndex];

    if (nextRule.isPro && !isPro) {
      router.push('/paywall');
      return;
    }

    setCurrentIndex(nextIndex);
    setActiveTab('The Rule');
  };

  const bullets =
    activeTab === 'The Rule'
      ? currentRule.lawBullets
      : activeTab === 'Why It Works'
      ? currentRule.psychBullets
      : currentRule.defenseBullets;

  return (
    <View style={styles.root}>
      {/* Top Navigation Bar */}
      <View
        style={[
          styles.navBar,
          {
            paddingTop: Math.max(insets.top, 12),
            height: 56 + Math.max(insets.top, 12),
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.iconBtn}
        >
          <AppIcon name="arrow_back" size={20} color="#FAFAFA" />
        </Pressable>

        <View style={styles.rulePill}>
          <Text style={styles.rulePillText}>
            RULE #{currentRule.number} OF 12
          </Text>
        </View>

        <View style={styles.navRight}>
          <Pressable
            onPress={() => {
              try {
                Haptics.selectionAsync();
              } catch {
                // fallback
              }
              toggleBookmarkedRule(currentRule.id);
            }}
            hitSlop={8}
            style={styles.iconBtn}
          >
            <AppIcon
              name="bookmark"
              size={19}
              color={isBookmarked ? '#FFFFFF' : '#71717A'}
              filled={isBookmarked}
            />
          </Pressable>
          <Pressable onPress={handleShare} hitSlop={8} style={styles.iconBtn}>
            <AppIcon name="share" size={19} color="#71717A" />
          </Pressable>
        </View>
      </View>

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
        {/* Pixel Art Banner */}
        <PixelArtBanner
          variant={currentRule.pixelVariant || 'shield'}
          height={140}
        />

        {/* Title Header */}
        <View style={styles.titleSection}>
          <Text style={styles.categoryCode}>{currentRule.category}</Text>
          <Text style={styles.title}>{currentRule.title}</Text>
          <Text style={styles.summary}>{currentRule.summary}</Text>
        </View>

        {/* 3 Clear Tabs */}
        <View style={styles.tabsRow}>
          {RULE_TABS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => {
                  try {
                    Haptics.selectionAsync();
                  } catch {
                    // fallback
                  }
                  setActiveTab(tab);
                }}
                style={[
                  styles.tabItem,
                  isSelected && styles.tabItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabItemText,
                    isSelected && styles.tabItemTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Tactical Bullet List */}
        <View style={styles.bulletBox}>
          {bullets.map((bullet, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <View style={styles.pixelDot} />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>

        {/* Real-Life Example Box */}
        {currentRule.realLifeExample && (
          <View style={styles.exampleBox}>
            <Text style={styles.exampleLabel}>REAL-LIFE EXAMPLE</Text>
            <Text style={styles.exampleText}>{currentRule.realLifeExample}</Text>
          </View>
        )}

        {/* Quote Monolith */}
        <View style={styles.quoteBox}>
          <View style={styles.quoteBar} />
          <View style={styles.quoteContent}>
            <Text style={styles.quoteText}>"{currentRule.quote}"</Text>
            <Text style={styles.quoteAuthor}>— {currentRule.author}</Text>
          </View>
        </View>

        {/* Action Controls: Save & Mark as Learned */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => {
              try {
                Haptics.selectionAsync();
              } catch {
                // fallback
              }
              toggleBookmarkedRule(currentRule.id);
            }}
            style={[
              styles.actionBtnSecondary,
              isBookmarked && styles.actionBtnSecondaryActive,
            ]}
          >
            <AppIcon
              name="bookmark"
              size={15}
              color={isBookmarked ? '#FFFFFF' : '#A1A1AA'}
              filled={isBookmarked}
            />
            <Text style={styles.actionBtnSecondaryText}>
              {isBookmarked ? 'Saved in Vault' : 'Save Rule'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              try {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } catch {
                // fallback
              }
              toggleMasteredRule(currentRule.id);
            }}
            style={[
              styles.actionBtnPrimary,
              isMastered && styles.actionBtnPrimaryDone,
            ]}
          >
            <AppIcon
              name="check"
              size={15}
              color={isMastered ? '#FAFAFA' : '#09090B'}
              strokeWidth={2.5}
            />
            <Text
              style={[
                styles.actionBtnPrimaryText,
                isMastered && styles.actionBtnPrimaryDoneText,
              ]}
            >
              {isMastered ? 'Learned' : 'Mark as Learned'}
            </Text>
          </Pressable>
        </View>

        {/* Previous / Next Rule Navigation */}
        <View style={styles.navigationRow}>
          <Pressable onPress={handlePrevRule} style={styles.navStepBtn}>
            <Text style={styles.navStepText}>← Previous</Text>
          </Pressable>

          <Pressable onPress={handleNextRule} style={styles.navStepBtn}>
            <Text style={styles.navStepText}>Next Rule →</Text>
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
  navBar: {
    backgroundColor: 'rgba(9, 9, 11, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  iconBtn: {
    padding: 6,
  },
  rulePill: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  rulePillText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#FAFAFA',
    letterSpacing: 0.8,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 18,
  },
  titleSection: {
    gap: 6,
  },
  categoryCode: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: '#FAFAFA',
    lineHeight: 30,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#121215',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
  },
  tabItemText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
  },
  tabItemTextActive: {
    color: '#09090B',
    fontFamily: fonts.labelSemiBold,
  },
  bulletBox: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pixelDot: {
    width: 5,
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#FAFAFA',
    lineHeight: 20,
  },
  exampleBox: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  exampleLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  exampleText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#D4D4D8',
    lineHeight: 19,
  },
  quoteBox: {
    flexDirection: 'row',
    backgroundColor: '#050507',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
  },
  quoteBar: {
    width: 3,
    backgroundColor: '#FFFFFF',
  },
  quoteContent: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  quoteText: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 13,
    color: '#FAFAFA',
    lineHeight: 19,
  },
  quoteAuthor: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnSecondary: {
    flex: 1,
    height: 48,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnSecondaryActive: {
    borderColor: '#71717A',
  },
  actionBtnSecondaryText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#FAFAFA',
  },
  actionBtnPrimary: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnPrimaryDone: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  actionBtnPrimaryText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#09090B',
  },
  actionBtnPrimaryDoneText: {
    color: '#FAFAFA',
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  navStepBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navStepText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#A1A1AA',
    letterSpacing: 0.6,
  },
});
