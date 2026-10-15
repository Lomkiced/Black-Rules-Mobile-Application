import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BMonogram } from '../../components/ui/BMonogram';
import { PixelArtBanner, PixelBannerVariant } from '../../components/ui/PixelArtBanner';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';

interface IntroSlide {
  step: string;
  variant: PixelBannerVariant;
  title: string;
  description: string;
  pill: string;
}

const SLIDES: IntroSlide[] = [
  {
    step: 'STEP 01 OF 03',
    variant: 'shield',
    title: 'Master the Black Rules',
    description:
      'Learn 12 timeless psychological principles to protect your boundaries, stay calm under pressure, and earn genuine respect.',
    pill: '12 CORE RULES • PLAIN ENGLISH',
  },
  {
    step: 'STEP 02 OF 03',
    variant: 'chess',
    title: 'Practice Real Situations',
    description:
      'Test yourself in realistic workplace and social dilemmas. Make your choice, see the result, and learn what actually works.',
    pill: 'REAL SCENARIOS • TACTICAL LESSONS',
  },
  {
    step: 'STEP 03 OF 03',
    variant: 'scale',
    title: 'Build Stronger Character',
    description:
      'Track your growth across 5 core traits: Self-Control, Confidence, Persuasion, Awareness, and Negotiation.',
    pill: '5-TRAIT RADAR • DAILY HABITS',
  },
];

export default function WelcomeWalkthroughScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeIntro } = useUserStore();

  const [currentSlide, setCurrentSlide] = useState<0 | 1 | 2>(0);

  const handleSkip = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    completeIntro();
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }

    if (currentSlide < 2) {
      setCurrentSlide((prev) => (prev + 1) as 0 | 1 | 2);
    } else {
      completeIntro();
      router.replace('/(auth)/login');
    }
  };

  const activeSlide = SLIDES[currentSlide];

  return (
    <View style={styles.root}>
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top + 8, 16),
          },
        ]}
      >
        <View style={styles.brandRow}>
          <BMonogram size={28} />
          <Text style={styles.brandText}>BLACK RULES</Text>
        </View>

        <Pressable onPress={handleSkip} hitSlop={12} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Center Slide Visual & Editorial */}
      <View style={styles.slideContent}>
        {/* Pixel Art Banner for current slide */}
        <View style={styles.bannerWrapper}>
          <PixelArtBanner variant={activeSlide.variant} height={160} />
        </View>

        {/* Step Indicator Tag */}
        <View style={styles.stepTag}>
          <Text style={styles.stepTagText}>{activeSlide.step}</Text>
        </View>

        {/* Editorial Text */}
        <View style={styles.editorialBox}>
          <Text style={styles.title}>{activeSlide.title}</Text>
          <Text style={styles.description}>{activeSlide.description}</Text>
        </View>

        {/* Feature Pill */}
        <View style={styles.featurePill}>
          <Text style={styles.featurePillText}>{activeSlide.pill}</Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View
        style={[
          styles.bottomControls,
          {
            paddingBottom: Math.max(insets.bottom + 16, 28),
          },
        ]}
      >
        {/* Pixel Segment Progress Bar */}
        <View style={styles.progressRow}>
          {[0, 1, 2].map((idx) => {
            const isActive = idx === currentSlide;
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  try {
                    Haptics.selectionAsync();
                  } catch {
                    // safe fallback
                  }
                  setCurrentSlide(idx as 0 | 1 | 2);
                }}
                hitSlop={8}
                style={[
                  styles.segment,
                  isActive ? styles.segmentActive : styles.segmentInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Crisp Pure White CTA Button */}
        <Pressable onPress={handleNext} style={styles.ctaButton}>
          <Text style={styles.ctaText}>
            {currentSlide === 2 ? 'Get Started →' : 'Next →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#09090B',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#FAFAFA',
    letterSpacing: 1.5,
  },
  skipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skipText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: '#A1A1AA',
    letterSpacing: 0.8,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 18,
  },
  bannerWrapper: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 14,
    overflow: 'hidden',
  },
  stepTag: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepTagText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#A1A1AA',
    letterSpacing: 1.2,
  },
  editorialBox: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#FAFAFA',
    textAlign: 'center',
    lineHeight: 32,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  featurePill: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  featurePillText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1,
  },
  bottomControls: {
    paddingHorizontal: 24,
    gap: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  segment: {
    height: 4,
    borderRadius: 2,
  },
  segmentActive: {
    width: 36,
    backgroundColor: '#FFFFFF',
  },
  segmentInactive: {
    width: 16,
    backgroundColor: '#27272A',
  },
  ctaButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 13,
    color: '#09090B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
