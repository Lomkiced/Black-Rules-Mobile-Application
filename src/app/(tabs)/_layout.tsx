import React from 'react';
import { Tabs } from 'expo-router';
import { FloatingBottomNav } from '../../components/ui/FloatingBottomNav';
import { colors } from '../../theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingBottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        sceneStyle: { backgroundColor: colors.surface },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily Shadow',
        }}
      />
      <Tabs.Screen
        name="codex"
        options={{
          title: 'The Codex',
        }}
      />
      <Tabs.Screen
        name="arena"
        options={{
          title: 'The Arena',
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Character Stats',
        }}
      />
    </Tabs>
  );
}
