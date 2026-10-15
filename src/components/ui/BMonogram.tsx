import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';

interface BMonogramProps {
  size?: number;
  style?: ViewStyle;
  showBorder?: boolean;
}

export const BMonogram: React.FC<BMonogramProps> = ({
  size = 40,
  style,
  showBorder = true,
}) => {
  const pixelCorner = Math.max(2, Math.round(size * 0.075));
  const borderWidth = Math.max(1, Math.round(size * 0.035));
  const cornerRadius = Math.round(size * 0.22);

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Background rounded badge */}
        <Rect
          x={borderWidth}
          y={borderWidth}
          width={100 - borderWidth * 2}
          height={100 - borderWidth * 2}
          rx={cornerRadius}
          fill="#09090B"
          stroke={showBorder ? '#3F3F46' : 'transparent'}
          strokeWidth={showBorder ? 3 : 0}
        />

        {/* 4 subtle pixel-corner accents */}
        <Rect x="12" y="12" width="6" height="6" fill="#71717A" />
        <Rect x="82" y="12" width="6" height="6" fill="#71717A" />
        <Rect x="12" y="82" width="6" height="6" fill="#71717A" />
        <Rect x="82" y="82" width="6" height="6" fill="#71717A" />

        {/* Bold Editorial Serif "B" */}
        <Path
          d="M 28 22
             H 54
             C 66 22, 73 28, 73 37
             C 73 44, 68 49, 61 51
             C 71 53, 76 60, 76 68
             C 76 78, 68 84, 54 84
             H 28
             Z
             M 42 34
             V 48
             H 52
             C 58 48, 62 45, 62 41
             C 62 37, 58 34, 52 34
             Z
             M 42 57
             V 72
             H 53
             C 60 72, 64 68, 64 64
             C 64 60, 60 57, 53 57
             Z"
          fill="#FFFFFF"
        />

        {/* Subtle geometric pixel cut in center bar */}
        <Rect x="28" y="50" width="14" height="2" fill="#09090B" />
      </Svg>
    </View>
  );
};
