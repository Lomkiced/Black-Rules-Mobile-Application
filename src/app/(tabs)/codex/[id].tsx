import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '../../../components/ui/AppIcon';
import { colors, fonts } from '../../../theme/tokens';
import { useUserStore } from '../../../store/useUserStore';

const FIELD_IMAGE_URI =
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';

type DoctrineTab = 'The Law' | 'Psychology' | 'Counter-Action';

const DOCTRINE_TABS: DoctrineTab[] = ['The Law', 'Psychology', 'Counter-Action'];

const TAB_POINTS: Record<DoctrineTab, string[]> = {
  'The Law': [
    'Silence forces the opposing party to fill the void with uncalibrated disclosures.',
    'Every concession offered without explicit reciprocal demand devalues your position.',
    'Maintain tactical ambiguity regarding your true reserve price and timing limits.',
  ],
  Psychology: [
    'Adversaries project their own insecurities onto individuals who remain impassive.',
    'The subconscious human urge to be understood is an exploitable security perimeter breach.',
    'Premature transparency triggers immediate price discounting in corporate hierarchy.',
  ],
  'Counter-Action': [
    'When pressed with direct ultimatums, deploy a calibrated mirroring label probe.',
    'Hold unbroken eye contact for 3.5 seconds post-statement without nodding.',
    'If forced to reveal data, provide ranges rather than precise operational metrics.',
  ],
};

export default function CodexReaderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    bookmarkedRuleIds,
    masteredRuleIds,
    toggleBookmark,
    toggleMastered,
  } = useUserStore();

  const ruleId = (id as string) || '08';
  const isBookmarked = bookmarkedRuleIds.includes(`rule-${ruleId}`);
  const isMastered = masteredRuleIds.includes(`rule-${ruleId}`);

  const [activeTab, setActiveTab] = useState<DoctrineTab>('The Law');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleShare = async () => {
    try {
      Haptics.selectionAsync();
      await Share.share({
        message:
          'RULE #08 • LAW OF ASYMMETRY — Never Reveal Your Full Hand. "Those who know do not speak; those who speak do not know." #BlackRules',
      });
    } catch {
      // safe fallback
    }
  };

  const handleBookmarkToggle = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    toggleBookmark(`rule-${ruleId}`);
  };

  const handleMasteredToggle = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // safe fallback
    }
    toggleMastered(`rule-${ruleId}`);
  };

  const handleAudioToggle = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <View style={styles.root}>
      {/* Sub-Header Bar */}
      <View
        style={[
          styles.subHeader,
          {
            paddingTop: Math.max(insets.top, 12),
            height: 60 + Math.max(insets.top, 12),
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.iconBtn}
        >
          <AppIcon name="arrow_back" size={20} color={colors.onSurface} />
        </Pressable>

        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>DEFENSIVE PSYCHOLOGY</Text>
        </View>

        <View style={styles.rightIcons}>
          <Pressable
            onPress={handleBookmarkToggle}
            hitSlop={8}
            style={styles.iconBtn}
          >
            <AppIcon
              name="bookmark"
              size={20}
              color={isBookmarked ? colors.primary : colors.onSurfaceVariant}
              filled={isBookmarked}
            />
          </Pressable>
          <Pressable
            onPress={handleShare}
            hitSlop={8}
            style={styles.iconBtn}
          >
            <AppIcon name="share" size={20} color={colors.onSurfaceVariant} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 94,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Archive Entry Indicator */}
        <View style={styles.archiveIndicatorRow}>
          <Text style={styles.archiveIndicatorText}>
            ARCHIVE ENTRY {ruleId} // 48
          </Text>
          <View style={styles.liveTag}>
            <View style={styles.pulsingDot} />
            <Text style={styles.liveTagText}>ACTIVE PROTOCOL</Text>
          </View>
        </View>

        {/* Tactile Deck Interface (Ghost Cards + Active Card) */}
        <View style={styles.deckContainer}>
          {/* Ghost Card 2 (Bottom-most) */}
          <View style={styles.ghostCard2} />

          {/* Ghost Card 1 (Middle) */}
          <View style={styles.ghostCard1} />

          {/* Active Top Card */}
          <View style={styles.activeCard}>
            {/* Watermark "08" */}
            <Text style={styles.watermark}>{ruleId}</Text>

            {/* Card Header */}
            <Text style={styles.lawCode}>RULE #{ruleId} • LAW OF ASYMMETRY</Text>
            <Text style={styles.lawTitle}>Never Reveal Your Full Hand</Text>

            {/* Segmented Tabs (The Law, Psychology, Counter-Action) */}
            <View style={styles.tabsRow}>
              {DOCTRINE_TABS.map((tab) => {
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
                        styles.tabText,
                        isSelected && styles.tabTextActive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Diamond-Bulleted Tactical List */}
            <View style={styles.bulletList}>
              {TAB_POINTS[activeTab].map((point, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.diamondIcon}>◆</Text>
                  <Text style={styles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>

            {/* Field Scenario Image Card */}
            <View style={styles.scenarioCard}>
              <Image
                source={{ uri: FIELD_IMAGE_URI }}
                style={styles.scenarioImage}
                resizeMode="cover"
              />
              <View style={styles.scenarioOverlay}>
                <Text style={styles.scenarioTag}>
                  SOVEREIGN BOARDROOM • LATENCY: NULL
                </Text>
              </View>
            </View>

            {/* Highlighted Quote Monolith */}
            <View style={styles.quoteMonolith}>
              <View style={styles.quoteBar} />
              <View style={styles.quoteContent}>
                <Text style={styles.quoteText}>
                  "Those who know do not speak; those who speak do not know."
                </Text>
                <Text style={styles.quoteAuthor}>
                  — Lao Tzu • Tao Te Ching
                </Text>
              </View>
            </View>

            {/* Bottom Action Row */}
            <View style={styles.actionRow}>
              {/* Audio Protocol Button */}
              <Pressable
                onPress={handleAudioToggle}
                style={[
                  styles.audioBtn,
                  isPlayingAudio && styles.audioBtnActive,
                ]}
              >
                <AppIcon
                  name={isPlayingAudio ? 'timelapse' : 'play_circle'}
                  size={16}
                  color={isPlayingAudio ? colors.primary : colors.onSurface}
                />
                <Text
                  style={[
                    styles.audioBtnText,
                    isPlayingAudio && styles.audioBtnTextActive,
                  ]}
                >
                  {isPlayingAudio ? 'Playing (3:40)' : 'Audio Protocol (3:40)'}
                </Text>
              </Pressable>

              {/* Mark Mastered Button */}
              <Pressable
                onPress={handleMasteredToggle}
                style={[
                  styles.masteredBtn,
                  isMastered && styles.masteredBtnActive,
                ]}
              >
                <AppIcon
                  name="check"
                  size={15}
                  color={isMastered ? colors.onPrimary : colors.onSurface}
                />
                <Text
                  style={[
                    styles.masteredBtnText,
                    isMastered && styles.masteredBtnTextActive,
                  ]}
                >
                  {isMastered ? 'Mastered' : 'Mark Mastered'}
                </Text>
              </Pressable>
            </View>
          </View>
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
  subHeader: {
    backgroundColor: 'rgba(19, 19, 21, 0.94)',
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  iconBtn: {
    padding: 6,
  },
  categoryPill: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  categoryPillText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1,
  },
  rightIcons: {
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
    gap: 16,
  },
  archiveIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  archiveIndicatorText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    letterSpacing: 1.4,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  liveTagText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  deckContainer: {
    position: 'relative',
    marginTop: 4,
    marginBottom: 16,
  },
  ghostCard2: {
    position: 'absolute',
    bottom: -14,
    left: '4%',
    right: '4%',
    height: 100,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 20,
    opacity: 0.5,
    zIndex: 1,
  },
  ghostCard1: {
    position: 'absolute',
    bottom: -7,
    left: '2%',
    right: '2%',
    height: 100,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 20,
    opacity: 0.7,
    zIndex: 2,
  },
  activeCard: {
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    zIndex: 3,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  watermark: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 150,
    fontFamily: fonts.display,
    color: colors.primary,
    opacity: 0.04,
    zIndex: 0,
  },
  lawCode: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.4,
    zIndex: 1,
  },
  lawTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.onSurface,
    lineHeight: 30,
    zIndex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    zIndex: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  tabText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  tabTextActive: {
    color: colors.primary,
    fontFamily: fonts.labelSemiBold,
  },
  bulletList: {
    gap: 10,
    zIndex: 1,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  diamondIcon: {
    color: colors.primary,
    fontSize: 10,
    marginTop: 3,
  },
  bulletText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 19,
  },
  scenarioCard: {
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    zIndex: 1,
  },
  scenarioImage: {
    width: '100%',
    height: '100%',
  },
  scenarioOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(19, 19, 21, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scenarioTag: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.2,
  },
  quoteMonolith: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    zIndex: 1,
  },
  quoteBar: {
    width: 4,
    backgroundColor: colors.primary,
  },
  quoteContent: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  quoteText: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 14,
    color: colors.onSurface,
    lineHeight: 20,
  },
  quoteAuthor: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    letterSpacing: 0.8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    zIndex: 1,
  },
  audioBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
  },
  audioBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(242, 202, 80, 0.1)',
  },
  audioBtnText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.onSurface,
  },
  audioBtnTextActive: {
    color: colors.primary,
  },
  masteredBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
  },
  masteredBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  masteredBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.onSurface,
  },
  masteredBtnTextActive: {
    color: colors.onPrimary,
  },
});
