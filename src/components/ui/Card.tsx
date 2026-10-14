import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme/tokens';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'crimsonAlert' | 'goldAccent';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  style,
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'crimsonAlert':
        return styles.crimsonCard;
      case 'goldAccent':
        return styles.goldCard;
      case 'elevated':
        return styles.elevatedCard;
      default:
        return styles.defaultCard;
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
  },
  defaultCard: {
    backgroundColor: colors.charcoal,
    borderColor: colors.borderSubtle,
  },
  elevatedCard: {
    backgroundColor: '#16161B',
    borderColor: colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  crimsonCard: {
    backgroundColor: '#180E10',
    borderColor: colors.crimson.DEFAULT,
  },
  goldCard: {
    backgroundColor: '#161510',
    borderColor: colors.gold.DEFAULT,
  },
});
