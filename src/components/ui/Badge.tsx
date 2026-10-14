import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, fonts } from '../../theme/tokens';

interface BadgeProps {
  label: string;
  variant?: 'gold' | 'crimson' | 'muted' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => {
  const getColors = () => {
    switch (variant) {
      case 'gold':
        return {
          bg: colors.gold.muted,
          border: colors.gold.DEFAULT,
          text: colors.gold.light,
        };
      case 'crimson':
        return {
          bg: colors.crimson.muted,
          border: colors.crimson.DEFAULT,
          text: '#FCA5A5',
        };
      case 'muted':
        return {
          bg: 'rgba(39, 39, 42, 0.4)',
          border: colors.borderSubtle,
          text: colors.zincMuted,
        };
      default:
        return {
          bg: '#18181B',
          border: colors.borderSubtle,
          text: colors.alabaster,
        };
    }
  };

  const scheme = getColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: scheme.bg, borderColor: scheme.border },
      ]}
    >
      <Text style={[styles.text, { color: scheme.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
