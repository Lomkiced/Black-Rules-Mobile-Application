import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '../../components/ui/AppIcon';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';

const { width } = Dimensions.get('window');

interface IntroSlide {
  phase: string;
  iconName: string;
  headline: string;
  subtitle: string;
  metricPill: string;
}

const SLIDES: IntroSlide[] = [
  {
    phase: 'PHASE 01 // PERCEPTION',
    iconName: 'visibility',
    headline: 'Decode the Unspoken Laws of Human Nature',
    subtitle:
      'Most people play by rules that only exist on paper. Master the psychological undercurrents that govern boardrooms, negotiations, and status.',
    metricPill: '100+ CODIFIED AXIOMS • DEFENSIVE PSYCHOLOGY',
  },
  {
    phase: 'PHASE 02 // EMOTIONAL ARMOR',
    iconName: 'shield',
    headline: 'Restraint Is the Ultimate Leverage',
    subtitle:
      'He who reacts first surrenders control. Train your daily composure with 2-minute tactical briefings and real-world behavioral drills.',
    metricPill: 'DAILY SHADOW PROTOCOLS • STREAK CALIBRATION',
  },
  {
    phase: 'PHASE 03 // LIVE COMBAT',
    iconName: 'swords',
    headline: 'Simulate High-Stakes Social Warfare',
    subtitle:
      'Step into The Arena to test your responses against credit thieves, hostile executives, and lowball anchors—and watch your 5-trait radar evolve.',
    metricPill: 'NEURAL ARENA SIMULATIONS • 5-VECTOR RADAR',
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
      {/* Background Ambient Glow */}
      <View style={styles.ambientGlow} pointerEvents="none" />

      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top + 8, 20),
          },
        ]}
      >
        <Text style={styles.initiationCode}>BLACK RULES // INITIATION</Text>
        <Pressable onPress={handleSkip} hitSlop={12} style={styles.skipBtn}>
          <Text style={styles.skipText}>SKIP</Text>
        </Pressable>
      </View>

      {/* Center Slide Visual & Editorial */}
      <View style={styles.slideContent}>
        {/* Emblem Frame */}
        <View style={styles.emblemContainer}>
          <View style={styles.emblemRing} />
          <View style={styles.emblemFrame}>
            <AppIcon
              name={activeSlide.iconName}
              size={44}
              color={colors.primary}
              strokeWidth={1.75}
            />
          </View>
        </View>

        {/* Phase Tag */}
        <View style={styles.phaseTag}>
          <View style={styles.phaseDot} />
          <Text style={styles.phaseText}>{activeSlide.phase}</Text>
        </View>

        {/* Editorial Text */}
        <View style={styles.editorialBox}>
          <Text style={styles.headline}>{activeSlide.headline}</Text>
          <Text style={styles.subtitle}>{activeSlide.subtitle}</Text>
        </View>

        {/* Metric Pill */}
        <View style={styles.metricPill}>
          <AppIcon name="bolt" size={13} color={colors.primary} />
          <Text style={styles.metricPillText}>{activeSlide.metricPill}</Text>
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
        {/* Animated Progress Indicator Dots */}
        <View style={styles.indicatorRow}>
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
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Full-width Primary Gold CTA Button */}
        <Pressable onPress={handleNext} style={styles.ctaButton}>
          <Text style={styles.ctaText}>
            {currentSlide === 2
              ? 'Enter Sovereign Vault →'
              : 'Continue Initiation →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
  },
  ambientGlow: {
    position: 'absolute',
    top: -120,
    alignSelf: 'center',
    width: width * 1.1,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(242, 202, 80, 0.05)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  initiationCode: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    letterSpacing: 1.2,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 20,
  },
  emblemContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emblemRing: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.2)',
  },
  emblemFrame: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  phaseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(242, 202, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.3)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  phaseText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.4,
  },
  editorialBox: {
    alignItems: 'center',
    gap: 12,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.onSurface,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 6,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  metricPillText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  bottomControls: {
    paddingHorizontal: 24,
    gap: 20,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 32,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.surfaceContainerHighest,
  },
  ctaButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 13,
    color: colors.onPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
