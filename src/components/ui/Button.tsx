import React from 'react';
import {
  Text,
  Pressable,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, fonts } from '../../theme/tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'gold' | 'outline' | 'crimson' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'gold',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    onPress();
  };

  const getContainerStyles = (pressed: boolean): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
    };

    let sizeStyle: ViewStyle;
    switch (size) {
      case 'sm':
        sizeStyle = { paddingVertical: 8, paddingHorizontal: 14 };
        break;
      case 'lg':
        sizeStyle = { paddingVertical: 16, paddingHorizontal: 24 };
        break;
      default:
        sizeStyle = { paddingVertical: 12, paddingHorizontal: 20 };
        break;
    }

    let variantStyle: ViewStyle;
    switch (variant) {
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.borderSubtle,
        };
        break;
      case 'crimson':
        variantStyle = {
          backgroundColor: colors.crimson.DEFAULT,
          borderWidth: 1,
          borderColor: colors.crimson.light,
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
        };
        break;
      default:
        variantStyle = {
          backgroundColor: colors.gold.DEFAULT,
          borderWidth: 1,
          borderColor: colors.gold.light,
        };
        break;
    }

    return { ...base, ...sizeStyle, ...variantStyle, ...(style || {}) };
  };

  const getTextStyles = (): TextStyle => {
    const base: TextStyle = {
      fontFamily: fonts.sansSemiBold,
      letterSpacing: 0.5,
    };

    let sizeStyle: TextStyle;
    switch (size) {
      case 'sm':
        sizeStyle = { fontSize: 12 };
        break;
      case 'lg':
        sizeStyle = { fontSize: 16 };
        break;
      default:
        sizeStyle = { fontSize: 14 };
        break;
    }

    let colorStyle: TextStyle;
    switch (variant) {
      case 'outline':
        colorStyle = { color: colors.alabaster };
        break;
      case 'ghost':
        colorStyle = { color: colors.zincMuted };
        break;
      case 'crimson':
        colorStyle = { color: colors.alabaster };
        break;
      default:
        colorStyle = { color: colors.obsidian };
        break;
    }

    return { ...base, ...sizeStyle, ...colorStyle };
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => getContainerStyles(pressed)}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'gold' ? colors.obsidian : colors.alabaster}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text style={getTextStyles()}>{label}</Text>
        </>
      )}
    </Pressable>
  );
};
