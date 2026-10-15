import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { BMonogram } from './BMonogram';
import { colors, fonts } from '../../theme/tokens';

interface BootSplashProps {
  onFinish?: () => void;
  duration?: number;
}

export const BootSplash: React.FC<BootSplashProps> = ({
  onFinish,
  duration = 1400,
}) => {
  const pulse = useSharedValue(1);
  const progressWidth = useSharedValue(10);

  useEffect(() => {
    // Pulse animation
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Progress bar fill
    progressWidth.value = withTiming(100, {
      duration: duration - 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    const timer = setTimeout(() => {
      onFinish?.();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const animatedMonogramStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(300)}
      style={styles.bootOverlay}
    >
      <View style={styles.bootCenter}>
        {/* Pulsing Monogram */}
        <Animated.View style={animatedMonogramStyle}>
          <BMonogram size={76} />
        </Animated.View>

        {/* Brand Title */}
        <Text style={styles.brandTitle}>BLACK RULES</Text>
        <Text style={styles.brandSub}>SOVEREIGN MIND PROTOCOL</Text>

        {/* Segmented Pixel Loading Bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
        </View>

        <Text style={styles.loadingLabel}>INITIALIZING VAULT...</Text>
      </View>
    </Animated.View>
  );
};

interface LoadingDotsProps {
  size?: number;
  color?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 6,
  color = '#FFFFFF',
}) => {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.3, { duration: 300 })
      ),
      -1,
      true
    );

    const t2 = setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 300 })
        ),
        -1,
        true
      );
    }, 150);

    const t3 = setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 300 })
        ),
        -1,
        true
      );
    }, 300);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const style1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const style2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const style3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View style={styles.dotsRow}>
      <Animated.View
        style={[
          styles.pixelDot,
          { width: size, height: size, backgroundColor: color },
          style1,
        ]}
      />
      <Animated.View
        style={[
          styles.pixelDot,
          { width: size, height: size, backgroundColor: color },
          style2,
        ]}
      />
      <Animated.View
        style={[
          styles.pixelDot,
          { width: size, height: size, backgroundColor: color },
          style3,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bootOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#09090B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  bootCenter: {
    alignItems: 'center',
    gap: 16,
    width: '80%',
  },
  brandTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: '#FAFAFA',
    letterSpacing: 2,
    marginTop: 8,
  },
  brandSub: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.6,
  },
  progressTrack: {
    width: 180,
    height: 4,
    backgroundColor: '#18181B',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  loadingLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
    letterSpacing: 1.2,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pixelDot: {
    borderRadius: 1,
  },
});
