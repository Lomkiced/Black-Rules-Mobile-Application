import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '../../../components/ui/AppIcon';
import { PixelArtBanner } from '../../../components/ui/PixelArtBanner';
import { fonts } from '../../../theme/tokens';
import { useUserStore } from '../../../store/useUserStore';
import { BLACK_RULES, getQuizForRule } from '../../../store/mockData';

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
    hapticsEnabled,
    setToast,
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
  const [quizAnswer, setQuizAnswer] = useState<'correct' | 'incorrect' | null>(null);

  const quiz = getQuizForRule(currentRule.id);

  const handleShare = async () => {
    if (hapticsEnabled) {
      try {
        Haptics.selectionAsync();
      } catch {
        // safe fallback
      }
    }
    try {
      await Share.share({
        message: `BLACK RULE #${currentRule.number}: ${currentRule.title}.\n${currentRule.summary}\n\n#BlackRules`,
      });
    } catch {
      // safe fallback
    }
  };

  const handlePrevRule = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // safe fallback
      }
    }
    const prevIndex = (currentIndex - 1 + BLACK_RULES.length) % BLACK_RULES.length;
    setCurrentIndex(prevIndex);
    setActiveTab('The Rule');
    setQuizAnswer(null);
  };

  const handleNextRule = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // safe fallback
      }
    }
    const nextIndex = (currentIndex + 1) % BLACK_RULES.length;
    const nextRule = BLACK_RULES[nextIndex];

    if (nextRule.isPro && !isPro) {
      router.push('/paywall');
      return;
    }

    setCurrentIndex(nextIndex);
    setActiveTab('The Rule');
    setQuizAnswer(null);
  };

  const handleSelectQuizAnswer = (choice: 'correct' | 'incorrect') => {
    setQuizAnswer(choice);

    if (choice === 'correct') {
      if (hapticsEnabled) {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {
          // safe fallback
        }
      }
      if (!isMastered) {
        toggleMasteredRule(currentRule.id);
      }
      setToast('CORRECT APPLICATION // +15 XP • RULE LEARNED');
    } else {
      if (hapticsEnabled) {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch {
          // safe fallback
        }
      }
    }
  };

  const bullets =
    activeTab === 'The Rule'
      ? currentRule.lawBullets
      : activeTab === 'Why It Works'
      ? currentRule.psychBullets
      : currentRule.defenseBullets;

  const progressPercent = ((currentIndex + 1) / BLACK_RULES.length) * 100;

  return (
    <View style={styles.root}>
      {/* Top Thin Progress Bar */}
      <View style={[styles.topProgressBarTrack, { top: insets.top }]}>
        <View
          style={[
            styles.topProgressBarFill,
            { width: `${progressPercent}%` },
          ]}
        />
      </View>

      {/* Top Navigation Bar */}
      <View
        style={[
          styles.navBar,
          {
            paddingTop: Math.max(insets.top + 6, 16),
            height: 56 + Math.max(insets.top + 6, 16),
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.iconBtn}
          accessibilityLabel="Back"
        >
          <AppIcon name="arrow_back" size={20} color="#FAFAFA" />
        </Pressable>

        <View style={styles.rulePill}>
          <Text style={styles.rulePillText}>
            RULE {currentIndex + 1} OF {BLACK_RULES.length}
          </Text>
        </View>

        <View style={styles.navRight}>
          <Pressable
            onPress={() => {
              if (hapticsEnabled) {
                try {
                  Haptics.selectionAsync();
                } catch {
                  // fallback
                }
              }
              toggleBookmarkedRule(currentRule.id);
            }}
            hitSlop={8}
            style={styles.iconBtn}
            accessibilityLabel="Bookmark"
          >
            <AppIcon
              name="bookmark"
              size={19}
              color={isBookmarked ? '#FFFFFF' : '#71717A'}
              filled={isBookmarked}
            />
          </Pressable>
          <Pressable
            onPress={handleShare}
            hitSlop={8}
            style={styles.iconBtn}
            accessibilityLabel="Share"
          >
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

        {/* 3 Clear Content Tabs */}
        <View style={styles.tabsRow}>
          {RULE_TABS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => {
                  if (hapticsEnabled) {
                    try {
                      Haptics.selectionAsync();
                    } catch {
                      // fallback
                    }
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

        {/* Animated Tactical Bullet List */}
        <Animated.View
          key={`${currentRule.id}-${activeTab}`}
          entering={FadeInDown.duration(200)}
          style={styles.bulletBox}
        >
          {bullets.map((bullet, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <View style={styles.pixelDot} />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Real-Life Example Box */}
        {currentRule.realLifeExample && (
          <View style={styles.exampleBox}>
            <Text style={styles.exampleLabel}>REAL-LIFE SCENARIO</Text>
            <Text style={styles.exampleText}>{currentRule.realLifeExample}</Text>
          </View>
        )}

        {/* Quote Box */}
        <View style={styles.quoteBox}>
          <View style={styles.quoteBar} />
          <View style={styles.quoteContent}>
            <Text style={styles.quoteText}>"{currentRule.quote}"</Text>
            <Text style={styles.quoteAuthor}>— {currentRule.author}</Text>
          </View>
        </View>

        {/* Interactive "Quick Takeaway Check" Card */}
        <View style={styles.quizCard}>
          <View style={styles.quizHeaderRow}>
            <View style={styles.quizBadge}>
              <Text style={styles.quizBadgeText}>QUICK CHECK // APPLY THIS RULE</Text>
            </View>
            <View style={styles.quizXpBadge}>
              <Text style={styles.quizXpText}>+15 XP</Text>
            </View>
          </View>

          <Text style={styles.quizQuestion}>{quiz.question}</Text>

          <View style={styles.quizChoices}>
            {/* Option 1: Correct Application */}
            <Pressable
              onPress={() => handleSelectQuizAnswer('correct')}
              style={[
                styles.quizChoiceBtn,
                quizAnswer === 'correct' && styles.quizChoiceCorrect,
              ]}
            >
              <View
                style={[
                  styles.choiceIndicator,
                  quizAnswer === 'correct' && styles.choiceIndicatorCorrect,
                ]}
              >
                <Text
                  style={[
                    styles.choiceIndicatorText,
                    quizAnswer === 'correct' && styles.choiceIndicatorTextActive,
                  ]}
                >
                  A
                </Text>
              </View>
              <Text
                style={[
                  styles.choiceText,
                  quizAnswer === 'correct' && styles.choiceTextActive,
                ]}
              >
                {quiz.correctChoice}
              </Text>
            </Pressable>

            {/* Option 2: Common Mistake */}
            <Pressable
              onPress={() => handleSelectQuizAnswer('incorrect')}
              style={[
                styles.quizChoiceBtn,
                quizAnswer === 'incorrect' && styles.quizChoiceIncorrect,
              ]}
            >
              <View
                style={[
                  styles.choiceIndicator,
                  quizAnswer === 'incorrect' && styles.choiceIndicatorIncorrect,
                ]}
              >
                <Text
                  style={[
                    styles.choiceIndicatorText,
                    quizAnswer === 'incorrect' && styles.choiceIndicatorTextActive,
                  ]}
                >
                  B
                </Text>
              </View>
              <Text
                style={[
                  styles.choiceText,
                  quizAnswer === 'incorrect' && styles.choiceTextActive,
                ]}
              >
                {quiz.incorrectChoice}
              </Text>
            </Pressable>
          </View>

          {quizAnswer !== null && (
            <View
              style={[
                styles.quizFeedbackBox,
                quizAnswer === 'correct'
                  ? styles.feedbackCorrect
                  : styles.feedbackIncorrect,
              ]}
            >
              <Text style={styles.feedbackTitle}>
                {quizAnswer === 'correct'
                  ? 'EXACT APPLICATION ✓'
                  : 'COMMON PITFALL ✗'}
              </Text>
              <Text style={styles.feedbackText}>{quiz.explanation}</Text>
            </View>
          )}
        </View>

        {/* Action Controls: Save & Mark as Learned */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => {
              if (hapticsEnabled) {
                try {
                  Haptics.selectionAsync();
                } catch {
                  // fallback
                }
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
              if (hapticsEnabled) {
                try {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch {
                  // fallback
                }
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
  topProgressBarTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#18181B',
    zIndex: 99,
  },
  topProgressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  rulePillText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#FAFAFA',
    letterSpacing: 1,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    lineHeight: 19,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  tabItemActive: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  tabItemText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 0.5,
  },
  tabItemTextActive: {
    fontFamily: fonts.labelSemiBold,
    color: '#FAFAFA',
  },
  bulletBox: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pixelDot: {
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    borderRadius: 1,
  },
  bulletText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#D4D4D8',
    lineHeight: 19,
    flex: 1,
  },
  exampleBox: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  exampleLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  exampleText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 18,
  },
  quoteBox: {
    flexDirection: 'row',
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  quoteBar: {
    width: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  quoteContent: {
    flex: 1,
    gap: 6,
  },
  quoteText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: '#FAFAFA',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
  },
  quizCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  quizHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizBadge: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  quizBadgeText: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#FAFAFA',
    letterSpacing: 0.8,
  },
  quizXpBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quizXpText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: '#09090B',
  },
  quizQuestion: {
    fontFamily: fonts.headlineMedium,
    fontSize: 13,
    color: '#FAFAFA',
    lineHeight: 18,
  },
  quizChoices: {
    gap: 8,
  },
  quizChoiceBtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    padding: 12,
  },
  quizChoiceCorrect: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  quizChoiceIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  choiceIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#52525B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  choiceIndicatorCorrect: {
    backgroundColor: '#09090B',
    borderColor: '#09090B',
  },
  choiceIndicatorIncorrect: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  choiceIndicatorText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: '#A1A1AA',
  },
  choiceIndicatorTextActive: {
    color: '#FFFFFF',
  },
  choiceText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 17,
    flex: 1,
  },
  choiceTextActive: {
    color: '#09090B',
    fontFamily: fonts.headlineMedium,
  },
  quizFeedbackBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  feedbackCorrect: {
    backgroundColor: '#18181B',
    borderColor: '#52525B',
  },
  feedbackIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderColor: '#7F1D1D',
  },
  feedbackTitle: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: '#FAFAFA',
    letterSpacing: 0.8,
  },
  feedbackText: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: '#A1A1AA',
    lineHeight: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtnSecondary: {
    flex: 1,
    height: 48,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnSecondaryActive: {
    borderColor: '#52525B',
  },
  actionBtnSecondaryText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#A1A1AA',
    letterSpacing: 0.5,
  },
  actionBtnPrimary: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
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
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  actionBtnPrimaryDoneText: {
    color: '#FAFAFA',
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  navStepBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navStepText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#71717A',
  },
});
