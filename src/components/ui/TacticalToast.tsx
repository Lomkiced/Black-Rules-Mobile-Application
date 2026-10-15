import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AppIcon } from './AppIcon';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';

export const TacticalToast: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { lastToastMessage, clearToast } = useUserStore();

  useEffect(() => {
    if (lastToastMessage) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // safe fallback
      }

      const timer = setTimeout(() => {
        clearToast();
      }, 2600);

      return () => clearTimeout(timer);
    }
  }, [lastToastMessage, clearToast]);

  if (!lastToastMessage) return null;

  return (
    <View
      style={[
        styles.toastWrapper,
        {
          top: Math.max(insets.top + 10, 24),
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable onPress={clearToast} style={styles.toastCard}>
        <View style={styles.glowDot} />
        <AppIcon name="bolt" size={13} color={colors.primary} />
        <Text style={styles.toastText}>{lastToastMessage}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 99,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.6)',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  toastText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
  },
});
