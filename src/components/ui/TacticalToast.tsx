import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AppIcon } from './AppIcon';
import { fonts } from '../../theme/tokens';
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
        <AppIcon name="bolt" size={13} color="#FFFFFF" />
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
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  toastText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: '#FAFAFA',
    letterSpacing: 1,
  },
});
