import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';

const LOGO_URI =
  'https://lh3.googleusercontent.com/aida/AEtjO1VpScQ8WRCEqUh13NVskeMXCHPhejMae5qEgeSlZJL6dtqTMREW0FF78jRUK6sLlE3lDDAfbuB-Sza74J5XRH0uTQgMS5yz9Pdm0QGJ3-9DQDRhCH_Jc9J_mmJ8-N6x6-iQIYmHESgUkzfrJsN2NnlfUyzlaGskRTcRUxd-UNryPtB4DAR9QiHgtqn4VIHiFhDk8a4fj9-MsyLajODWrmB9t8dknmgAYkg4lxDQ1Kr73DsA7jzD2h4C3OQ';

const AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrGG84acRosCC5hZ-eL73H6Ptl9iHaPEf11DlKHKInScqxXhEFhGr8i9juFcJ7DB94XJHaeaxtvvOGqxATmJpa27fMA5cLBS4uk6ad6HrkmqlTHg3i1H1ttqwCJ5vKuU5GzZVvrH2wIlfG1By_lv4bMOAJKWkqCauXwPKMBnuCqiWcJvwHIWyFlkDXEMC5blfRMcecNVJfYeVVxmDDQ8pWpKzok8P7BICPAMVqQygiXIZ8nF6W-e6z2w';

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
  const { logoutAndResetFlow } = useUserStore();

  const handleProfilePress = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    Alert.alert(
      'SOVEREIGN CLEARANCE',
      'Select administrative security protocol:',
      [
        {
          text: 'Open Sovereign Paywall',
          onPress: () => router.push('/paywall'),
        },
        {
          text: 'Lock Vault / Replay Intro & Login',
          style: 'destructive',
          onPress: () => {
            logoutAndResetFlow();
            router.replace('/(onboarding)/welcome' as any);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSearchPress = () => {
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
          height: 64 + Math.max(insets.top, 12),
        },
      ]}
    >
      {/* Left: Monogram + Titles */}
      <View style={styles.leftGroup}>
        <Image
          source={{ uri: LOGO_URI }}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleStack}>
          <Text style={styles.brandSubtitle}>BLACK RULES</Text>
          <Text style={styles.screenTitle}>{title}</Text>
        </View>
      </View>

      {/* Right: Search & Profile Avatar */}
      <View style={styles.rightGroup}>
        <Pressable
          onPress={handleSearchPress}
          style={styles.searchButton}
          accessibilityLabel="Search"
          hitSlop={6}
        >
          <Search size={20} color={colors.onSurfaceVariant} />
        </Pressable>

        <Pressable
          onPress={handleProfilePress}
          style={styles.avatarButton}
          accessibilityLabel="Operative Profile"
          hitSlop={6}
        >
          <Image
            source={{ uri: AVATAR_URI }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(19, 19, 21, 0.88)',
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingHorizontal: 24,
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
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  titleStack: {
    justifyContent: 'center',
    gap: 1,
  },
  brandSubtitle: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.onSurface,
    lineHeight: 22,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: 'rgba(242, 202, 80, 0.45)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
