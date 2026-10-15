import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BMonogram } from './BMonogram';
import { AppIcon } from './AppIcon';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';

interface TopAppBarProps {
  title: string;
  onSearchPress?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  onSearchPress,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { operativeName } = useUserStore();

  const initial = (operativeName || 'E').trim().charAt(0).toUpperCase();

  const handleProfilePress = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    router.push('/profile' as any);
  };

  const handleAdvisorPress = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    if (onSearchPress) {
      onSearchPress();
    } else {
      router.push('/advisor' as any);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 12),
          height: 60 + Math.max(insets.top, 12),
        },
      ]}
    >
      {/* Left: B Monogram + Clean Screen Title */}
      <View style={styles.leftGroup}>
        <BMonogram size={30} />
        <Text style={styles.screenTitle}>{title}</Text>
      </View>

      {/* Right: Only 2 clean elements - "Ask AI" pill + Profile circle */}
      <View style={styles.rightGroup}>
        <Pressable
          onPress={handleAdvisorPress}
          style={styles.askAiPill}
          accessibilityRole="button"
          accessibilityLabel="Ask AI Coach"
          hitSlop={6}
        >
          <AppIcon name="bolt" size={13} color="#09090B" />
          <Text style={styles.askAiText}>Ask AI</Text>
        </Pressable>

        <Pressable
          onPress={handleProfilePress}
          style={styles.profileCircle}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          hitSlop={6}
        >
          <Text style={styles.profileInitial}>{initial}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(9, 9, 11, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  screenTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: '#FAFAFA',
    letterSpacing: 0.5,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  askAiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  askAiText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#09090B',
    letterSpacing: 0.6,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#18181B',
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#FAFAFA',
  },
});
