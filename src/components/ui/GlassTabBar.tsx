import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Moon, BookOpen, Swords, BarChart3 } from 'lucide-react-native';
import { colors, fonts, radius } from '../../theme/tokens';

export const GlassTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? colors.gold.DEFAULT : colors.zincMuted;
    const size = 20;

    switch (routeName) {
      case 'index':
        return <Moon size={size} color={color} strokeWidth={isFocused ? 2.2 : 1.8} />;
      case 'codex':
        return <BookOpen size={size} color={color} strokeWidth={isFocused ? 2.2 : 1.8} />;
      case 'arena':
        return <Swords size={size} color={color} strokeWidth={isFocused ? 2.2 : 1.8} />;
      case 'stats':
        return <BarChart3 size={size} color={color} strokeWidth={isFocused ? 2.2 : 1.8} />;
      default:
        return <Moon size={size} color={color} />;
    }
  };

  const getTabLabel = (routeName: string): string => {
    switch (routeName) {
      case 'index':
        return 'Shadow';
      case 'codex':
        return 'Codex';
      case 'arena':
        return 'Arena';
      case 'stats':
        return 'Stats';
      default:
        return routeName;
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: Math.max(insets.bottom, 12),
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {
              // safe fallback
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemFocused,
              ]}
            >
              {getTabIcon(route.name, isFocused)}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? colors.gold.DEFAULT : colors.zincMuted,
                    fontFamily: isFocused ? fonts.sansSemiBold : fonts.sans,
                  },
                ]}
              >
                {getTabLabel(route.name)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(18, 18, 21, 0.88)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.xl,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
    ...(Platform.OS === 'ios'
      ? {
          // Native blur support or overlay
        }
      : {}),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: radius.md,
    gap: 4,
  },
  tabItemFocused: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
