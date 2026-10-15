import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { fonts } from '../../theme/tokens';
import { AppIcon, MaterialSymbolName } from './AppIcon';

interface TabItemConfig {
  name: string;
  label: string;
  iconName: MaterialSymbolName;
}

const TABS: TabItemConfig[] = [
  { name: 'index', label: 'Today', iconName: 'explore' },
  { name: 'codex', label: 'Rules', iconName: 'auto_stories' },
  { name: 'arena', label: 'Practice', iconName: 'swords' },
  { name: 'stats', label: 'Progress', iconName: 'radar' },
];

export const FloatingBottomNav = ({
  state,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.outerContainer,
        {
          bottom: Math.max(insets.bottom, 12),
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.pillContainer}>
        {TABS.map((tab) => {
          // Find matching route by name prefix
          const routeIndex = state.routes.findIndex((r: { name: string }) => r.name === tab.name);
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

          const activeColor = '#FFFFFF';
          const inactiveColor = '#71717A';

          return (
            <Pressable
              key={tab.name}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              style={styles.tabButton}
            >
              <AppIcon
                name={tab.iconName}
                size={20}
                color={isFocused ? activeColor : inactiveColor}
                strokeWidth={isFocused ? 2.4 : 1.6}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? activeColor : inactiveColor,
                    fontFamily: isFocused ? fonts.labelSemiBold : fonts.label,
                  },
                ]}
              >
                {tab.label}
              </Text>
              {/* 4px White Pixel Dot underneath active tab */}
              {isFocused ? (
                <View style={styles.activePixelDot} />
              ) : (
                <View style={styles.inactiveDotSpacer} />
              )}
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
    width: '90%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#121215',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  activePixelDot: {
    width: 4,
    height: 4,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 2,
  },
  inactiveDotSpacer: {
    width: 4,
    height: 4,
    marginTop: 2,
  },
});
