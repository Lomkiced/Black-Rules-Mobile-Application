import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, fonts } from '../../theme/tokens';
import { AppIcon, MaterialSymbolName } from './AppIcon';

interface TabItemConfig {
  name: string;
  label: string;
  iconName: MaterialSymbolName;
}

const TABS: TabItemConfig[] = [
  { name: 'index', label: 'Shadow', iconName: 'explore' },
  { name: 'codex', label: 'Codex', iconName: 'auto_stories' },
  { name: 'arena', label: 'Arena', iconName: 'swords' },
  { name: 'stats', label: 'Stats', iconName: 'radar' },
];

export const FloatingBottomNav: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.outerContainer,
        {
          bottom: Math.max(insets.bottom, 14),
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.pillContainer}>
        {TABS.map((tab) => {
          // Find matching route by name prefix
          const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
          const isFocused = state.index === routeIndex;
          const routeKey = state.routes[routeIndex]?.key;

          const onPress = () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {
              // safe fallback
            }

            if (routeKey) {
              const event = navigation.emit({
                type: 'tabPress',
                target: routeKey,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(tab.name);
              }
            }
          };

          const iconColor = isFocused ? colors.primary : colors.onSurfaceVariant;

          return (
            <Pressable
              key={tab.name}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              style={[
                styles.tabButton,
                isFocused && styles.tabButtonActive,
              ]}
            >
              <AppIcon
                name={tab.iconName}
                size={21}
                color={iconColor}
                strokeWidth={isFocused ? 2.3 : 1.8}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: iconColor,
                    fontFamily: isFocused ? fonts.labelSemiBold : fonts.label,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  pillContainer: {
    width: '100%',
    maxWidth: 361,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(28, 27, 29, 0.92)',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.65,
    shadowRadius: 24,
    elevation: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 3,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(242, 202, 80, 0.1)',
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.6,
  },
});
