import React from 'react';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Polygon,
  Line,
  Circle,
  Text as SvgText,
} from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { CharacterStats, TraitKey } from '../../types';
import { colors, fonts } from '../../theme/tokens';

interface RadarChartProps {
  stats: CharacterStats;
}

interface TraitConfig {
  key: TraitKey;
  label: string;
  deg: number;
  isStar?: boolean;
}

const TRAIT_CONFIGS: TraitConfig[] = [
  { key: 'stoicism', label: 'STOICISM', deg: 0 },
  { key: 'persuasion', label: 'PERSUASION', deg: 72 },
  { key: 'assertiveness', label: 'ASSERTIVE', deg: 144 },
  { key: 'awareness', label: 'AWARENESS', deg: 216, isStar: true },
  { key: 'negotiation', label: 'NEGOTIATION', deg: 288 },
];

export const RadarChart = ({ stats }: RadarChartProps) => {
  const cx = 160;
  const cy = 160;
  const maxR = 110;

  const computeCoord = (deg: number, ratio: number) => {
    const angleRad = (deg * Math.PI) / 180;
    const x = cx + maxR * ratio * Math.sin(angleRad);
    const y = cy - maxR * ratio * Math.cos(angleRad);
    return { x, y };
  };

  // 5 concentric pentagon web rings (20%, 40%, 60%, 80%, 100%)
  const gridRatios = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = gridRatios.map((ratio) =>
    TRAIT_CONFIGS.map((t) => {
      const { x, y } = computeCoord(t.deg, ratio);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ')
  );

  // Dynamic user data polygon points
  const userPoints = TRAIT_CONFIGS.map((t) => {
    const val = stats[t.key] ?? 50;
    const ratio = Math.max(0.1, Math.min(1.0, val / 100));
    const { x, y } = computeCoord(t.deg, ratio);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <View style={styles.chartWrapper}>
      <Svg width={320} height={320} viewBox="0 0 320 320">
        <Defs>
          <RadialGradient id="radarGoldGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#f2ca50" stopOpacity="0.45" />
            <Stop offset="70%" stopColor="#d4af37" stopOpacity="0.22" />
            <Stop offset="100%" stopColor="#d4af37" stopOpacity="0.03" />
          </RadialGradient>
        </Defs>

        {/* 5 Concentric Pentagon Rings */}
        {gridPolygons.map((pts, idx) => (
          <Polygon
            key={`ring-${idx}`}
            points={pts}
            stroke={colors.outlineVariant}
            strokeWidth={idx === 4 ? 1.5 : 0.8}
            fill={idx === 4 ? 'rgba(32, 31, 34, 0.5)' : 'transparent'}
          />
        ))}

        {/* 5 Radial Spokes from (160, 160) to outer perimeter */}
        {TRAIT_CONFIGS.map((t, i) => {
          const { x, y } = computeCoord(t.deg, 1.0);
          return (
            <Line
              key={`spoke-${i}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={colors.outlineVariant}
              strokeWidth={0.8}
            />
          );
        })}

        {/* Dynamic User Data Polygon */}
        <Polygon
          points={userPoints}
          fill="url(#radarGoldGlow)"
          stroke={colors.primary}
          strokeWidth={2.4}
        />

        {/* 5 Vertices at exact computed coordinates */}
        {TRAIT_CONFIGS.map((t, i) => {
          const val = stats[t.key] ?? 50;
          const ratio = Math.max(0.1, Math.min(1.0, val / 100));
          const { x, y } = computeCoord(t.deg, ratio);
          return (
            <React.Fragment key={`vertex-${i}`}>
              <Circle
                cx={x}
                cy={y}
                r={5}
                fill={colors.primary}
                stroke={colors.surface}
                strokeWidth={1.5}
              />
              <Circle
                cx={x}
                cy={y}
                r={9}
                fill="none"
                stroke="rgba(242, 202, 80, 0.35)"
                strokeWidth={1}
              />
            </React.Fragment>
          );
        })}

        {/* Peripheral Labels & Dynamic Percentages */}
        {TRAIT_CONFIGS.map((t, i) => {
          const val = stats[t.key] ?? 0;
          // Position label slightly outside the 110 radius
          const labelDist = t.deg === 0 ? 1.22 : 1.28;
          const { x, y } = computeCoord(t.deg, labelDist);

          // Fine-tune baseline vertical alignment
          const yOffset = t.deg === 0 ? -6 : t.deg === 144 || t.deg === 216 ? 4 : 0;

          return (
            <React.Fragment key={`lbl-${i}`}>
              <SvgText
                x={x}
                y={y + yOffset - 3}
                textAnchor="middle"
                fontSize={9}
                fontFamily={fonts.label}
                fill={colors.onSurfaceVariant}
                letterSpacing={0.8}
              >
                {t.label}
              </SvgText>
              <SvgText
                x={x}
                y={y + yOffset + 11}
                textAnchor="middle"
                fontSize={11}
                fontFamily={fonts.labelSemiBold}
                fill={colors.primary}
              >
                {val}% {t.isStar ? '★' : ''}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
});
