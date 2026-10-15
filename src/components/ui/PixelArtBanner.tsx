import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import Svg, { Rect, G, Line, Circle } from 'react-native-svg';

export type PixelBannerVariant = 'chess' | 'shield' | 'scale' | 'eye' | 'crown' | 'key';

interface PixelArtBannerProps {
  variant?: PixelBannerVariant;
  height?: number;
  style?: ViewStyle;
  showBorder?: boolean;
}

export const PixelArtBanner: React.FC<PixelArtBannerProps> = ({
  variant = 'shield',
  height = 140,
  style,
  showBorder = true,
}) => {
  // 16x16 or 20x20 pixel art definitions for each icon
  // Rendered on a 320x140 canvas
  const renderPixelGlyph = () => {
    const cx = 160;
    const cy = 70;
    const p = 5; // pixel unit size

    switch (variant) {
      case 'chess': // Chess Knight / King
        return (
          <G fill="#FAFAFA">
            {/* Crown/Head cross */}
            <Rect x={cx - p * 0.5} y={cy - p * 8} width={p} height={p * 3} fill="#FAFAFA" />
            <Rect x={cx - p * 2} y={cy - p * 7} width={p * 4} height={p} fill="#FAFAFA" />
            {/* Upper dome */}
            <Rect x={cx - p * 4} y={cy - p * 5} width={p * 8} height={p * 2} fill="#FAFAFA" />
            <Rect x={cx - p * 5} y={cy - p * 3} width={p * 10} height={p * 2} fill="#D4D4D8" />
            {/* Neck / Body */}
            <Rect x={cx - p * 3} y={cy - p * 1} width={p * 6} height={p * 4} fill="#FAFAFA" />
            <Rect x={cx - p * 4} y={cy + p * 3} width={p * 8} height={p * 2} fill="#D4D4D8" />
            {/* Base Pedestal */}
            <Rect x={cx - p * 6} y={cy + p * 5} width={p * 12} height={p * 2} fill="#FAFAFA" />
            <Rect x={cx - p * 8} y={cy + p * 7} width={p * 16} height={p * 2} fill="#FAFAFA" />
            {/* Shadow blocks */}
            <Rect x={cx + p} y={cy - p * 3} width={p * 2} height={p * 2} fill="#71717A" />
            <Rect x={cx + p} y={cy + p} width={p * 2} height={p * 2} fill="#71717A" />
          </G>
        );

      case 'shield': // Heraldic Shield
        return (
          <G fill="#FAFAFA">
            {/* Shield Top Rim */}
            <Rect x={cx - p * 7} y={cy - p * 7} width={p * 14} height={p * 2} fill="#FAFAFA" />
            {/* Body */}
            <Rect x={cx - p * 6} y={cy - p * 5} width={p * 12} height={p * 4} fill="#FAFAFA" />
            <Rect x={cx - p * 5} y={cy - p * 1} width={p * 10} height={p * 4} fill="#FAFAFA" />
            <Rect x={cx - p * 4} y={cy + p * 3} width={p * 8} height={p * 3} fill="#FAFAFA" />
            <Rect x={cx - p * 2} y={cy + p * 6} width={p * 4} height={p * 2} fill="#FAFAFA" />
            <Rect x={cx - p * 0.5} y={cy + p * 8} width={p} height={p} fill="#FAFAFA" />
            {/* Dark Inset / Emblem */}
            <Rect x={cx - p * 4} y={cy - p * 4} width={p * 8} height={p * 7} fill="#050507" />
            {/* Center Cross */}
            <Rect x={cx - p * 0.5} y={cy - p * 3} width={p} height={p * 5} fill="#D4D4D8" />
            <Rect x={cx - p * 2.5} y={cy - p * 1} width={p * 5} height={p} fill="#D4D4D8" />
          </G>
        );

      case 'scale': // Balance Scales
        return (
          <G fill="#FAFAFA">
            {/* Center Pillar */}
            <Rect x={cx - p * 0.5} y={cy - p * 7} width={p} height={p * 14} fill="#FAFAFA" />
            <Rect x={cx - p * 1.5} y={cy - p * 8} width={p * 3} height={p} fill="#FAFAFA" />
            {/* Base */}
            <Rect x={cx - p * 5} y={cy + p * 7} width={p * 10} height={p * 2} fill="#FAFAFA" />
            {/* Crossbeam */}
            <Rect x={cx - p * 10} y={cy - p * 5} width={p * 20} height={p} fill="#FAFAFA" />
            {/* Left Pan Chains & Pan */}
            <Rect x={cx - p * 9} y={cy - p * 4} width={p * 0.5} height={p * 5} fill="#71717A" />
            <Rect x={cx - p * 5} y={cy - p * 4} width={p * 0.5} height={p * 5} fill="#71717A" />
            <Rect x={cx - p * 10} y={cy + p} width={p * 6} height={p} fill="#FAFAFA" />
            <Rect x={cx - p * 8.5} y={cy + p * 2} width={p * 3} height={p} fill="#FAFAFA" />
            {/* Right Pan Chains & Pan */}
            <Rect x={cx + p * 5} y={cy - p * 4} width={p * 0.5} height={p * 5} fill="#71717A" />
            <Rect x={cx + p * 9} y={cy - p * 4} width={p * 0.5} height={p * 5} fill="#71717A" />
            <Rect x={cx + p * 4} y={cy + p} width={p * 6} height={p} fill="#FAFAFA" />
            <Rect x={cx + p * 5.5} y={cy + p * 2} width={p * 3} height={p} fill="#FAFAFA" />
          </G>
        );

      case 'eye': // The Sovereign Eye
        return (
          <G fill="#FAFAFA">
            {/* Top Arc */}
            <Rect x={cx - p * 8} y={cy - p * 1} width={p * 3} height={p} fill="#71717A" />
            <Rect x={cx - p * 5} y={cy - p * 3} width={p * 4} height={p * 1.5} fill="#FAFAFA" />
            <Rect x={cx - p * 2} y={cy - p * 5} width={p * 4} height={p * 1.5} fill="#FAFAFA" />
            <Rect x={cx + p * 1} y={cy - p * 3} width={p * 4} height={p * 1.5} fill="#FAFAFA" />
            <Rect x={cx + p * 5} y={cy - p * 1} width={p * 3} height={p} fill="#71717A" />
            {/* Bottom Arc */}
            <Rect x={cx - p * 5} y={cy + p * 2} width={p * 4} height={p * 1.5} fill="#FAFAFA" />
            <Rect x={cx - p * 2} y={cy + p * 4} width={p * 4} height={p * 1.5} fill="#FAFAFA" />
            <Rect x={cx + p * 1} y={cy + p * 2} width={p * 4} height={p * 1.5} fill="#FAFAFA" />
            {/* Outer Iris */}
            <Rect x={cx - p * 3} y={cy - p * 2} width={p * 6} height={p * 4} fill="#D4D4D8" />
            {/* Pupil */}
            <Rect x={cx - p * 1.5} y={cy - p * 1} width={p * 3} height={p * 2} fill="#050507" />
            {/* Glint */}
            <Rect x={cx - p * 0.5} y={cy - p * 0.5} width={p} height={p} fill="#FFFFFF" />
          </G>
        );

      case 'crown': // Imperial Crown
        return (
          <G fill="#FAFAFA">
            {/* Rim Base */}
            <Rect x={cx - p * 8} y={cy + p * 5} width={p * 16} height={p * 2} fill="#FAFAFA" />
            <Rect x={cx - p * 6} y={cy + p * 3} width={p * 12} height={p * 2} fill="#D4D4D8" />
            {/* Left Spire */}
            <Rect x={cx - p * 8} y={cy - p * 2} width={p * 3} height={p * 5} fill="#FAFAFA" />
            <Rect x={cx - p * 7.5} y={cy - p * 4} width={p * 2} height={p * 2} fill="#FAFAFA" />
            {/* Center Peak Spire */}
            <Rect x={cx - p * 2} y={cy - p * 6} width={p * 4} height={p * 9} fill="#FAFAFA" />
            <Rect x={cx - p * 1} y={cy - p * 8} width={p * 2} height={p * 2} fill="#FAFAFA" />
            {/* Right Spire */}
            <Rect x={cx + p * 5} y={cy - p * 2} width={p * 3} height={p * 5} fill="#FAFAFA" />
            <Rect x={cx + p * 5.5} y={cy - p * 4} width={p * 2} height={p * 2} fill="#FAFAFA" />
            {/* Inset Jewels */}
            <Rect x={cx - p * 5} y={cy + p * 5.5} width={p} height={p} fill="#050507" />
            <Rect x={cx - p * 0.5} y={cy + p * 5.5} width={p} height={p} fill="#050507" />
            <Rect x={cx + p * 4} y={cy + p * 5.5} width={p} height={p} fill="#050507" />
          </G>
        );

      case 'key': // Skeleton Key
        return (
          <G fill="#FAFAFA">
            {/* Bow / Ring Head */}
            <Rect x={cx - p * 7} y={cy - p * 4} width={p * 6} height={p * 8} fill="#FAFAFA" />
            <Rect x={cx - p * 5} y={cy - p * 2} width={p * 2} height={p * 4} fill="#050507" />
            {/* Stem / Shaft */}
            <Rect x={cx - p * 1} y={cy - p * 1} width={p * 11} height={p * 2} fill="#FAFAFA" />
            {/* Collar */}
            <Rect x={cx + p * 6} y={cy - p * 2} width={p * 1.5} height={p * 4} fill="#D4D4D8" />
            {/* Bit / Teeth */}
            <Rect x={cx + p * 8} y={cy + p * 1} width={p * 2} height={p * 4} fill="#FAFAFA" />
            <Rect x={cx + p * 8.5} y={cy + p * 3} width={p * 1.5} height={p} fill="#050507" />
          </G>
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        { height },
        showBorder && styles.bordered,
        style,
      ]}
    >
      <Svg width="100%" height={height} viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice">
        {/* Deep Matte Background */}
        <Rect x="0" y="0" width="320" height="140" fill="#050507" />

        {/* Dither Grid & Corner Accents */}
        {/* Subtle Horizontal scanlines */}
        <Line x1="10" y1="20" x2="310" y2="20" stroke="#18181B" strokeWidth="1" strokeDasharray="2,6" />
        <Line x1="10" y1="120" x2="310" y2="120" stroke="#18181B" strokeWidth="1" strokeDasharray="2,6" />

        {/* 4 Corner Target Pixels */}
        <Rect x="12" y="12" width="4" height="4" fill="#3F3F46" />
        <Rect x="304" y="12" width="4" height="4" fill="#3F3F46" />
        <Rect x="12" y="124" width="4" height="4" fill="#3F3F46" />
        <Rect x="304" y="124" width="4" height="4" fill="#3F3F46" />

        {/* Matrix background dot grid */}
        {[30, 60, 90, 120, 200, 230, 260, 290].map((x) =>
          [35, 70, 105].map((y) => (
            <Rect key={`dot-${x}-${y}`} x={x} y={y} width="2" height="2" fill="#18181B" />
          ))
        )}

        {/* Center Pixel Glyph */}
        {renderPixelGlyph()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#050507',
    overflow: 'hidden',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: {
    borderWidth: 1,
    borderColor: '#27272A',
  },
});
