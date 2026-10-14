import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Polygon,
  Line,
  Circle,
  Text as SvgText,
} from 'react-native-svg';
import { CharacterStats } from '../../types';
import { colors, fonts } from '../../theme/tokens';

interface RadarChartProps {
  stats: CharacterStats;
}

export const RadarChart: React.FC<RadarChartProps> = ({ stats }) => {
  // Center is (160, 160), max radius = 100
  const center = 160;
  const radius = 100;
  const angleStep = (Math.PI * 2) / 5;

  const getCoordinates = (index: number, ratio: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = center + radius * ratio * Math.cos(angle);
    const y = center + radius * ratio * Math.sin(angle);
    return { x, y };
  };

  // 5 concentric pentagon rings (20%, 40%, 60%, 80%, 100%)
  const gridRatios = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = gridRatios.map((r) =>
    [0, 1, 2, 3, 4]
      .map((i) => {
        const { x, y } = getCoordinates(i, r);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ')
  );

  // Exact data polygon points from Google Stitch or computed dynamically
  const traitsOrder: Array<{ key: keyof CharacterStats; label: string; isStar?: boolean }> = [
    { key: 'stoicism', label: 'STOICISM' },
    { key: 'persuasion', label: 'PERSUASION' },
    { key: 'assertiveness', label: 'ASSERTIVENESS' },
    { key: 'awareness', label: 'AWARENESS', isStar: true },
    { key: 'negotiation', label: 'NEGOTIATION' },
  ];

  const userPoints = traitsOrder
    .map((t, i) => {
      const val = stats[t.key] ?? 70;
      const { x, y } = getCoordinates(i, val / 100);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <View style={styles.chartWrapper}>
      <Svg width={320} height={320} viewBox="0 0 320 320">
        <Defs>
          <RadialGradient id="radarGoldGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#f2ca50" stopOpacity="0.45" />
            <Stop offset="70%" stopColor="#d4af37" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#d4af37" stopOpacity="0.02" />
          </RadialGradient>
        </Defs>

        {/* 5 Concentric Pentagon Rings */}
        {gridPolygons.map((pts, idx) => (
          <Polygon
            key={`ring-${idx}`}
            points={pts}
            stroke={colors.outlineVariant}
            strokeWidth={idx === 4 ? 1.5 : 0.8}
            fill={idx === 4 ? 'rgba(32, 31, 34, 0.45)' : 'transparent'}
          />
        ))}

        {/* 5 Radial Spokes from (160, 160) */}
        {[0, 1, 2, 3, 4].map((i) => {
          const { x, y } = getCoordinates(i, 1.0);
          return (
            <Line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
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
          strokeWidth={2.2}
        />

        {/* 5 Glowing Vertices */}
        {traitsOrder.map((t, i) => {
          const val = stats[t.key] ?? 70;
          const { x, y } = getCoordinates(i, val / 100);
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
                r={8}
                fill="none"
                stroke="rgba(242, 202, 80, 0.3)"
                strokeWidth={1}
              />
            </React.Fragment>
          );
        })}

        {/* Peripheral Labels */}
        {traitsOrder.map((t, i) => {
          const val = stats[t.key] ?? 70;
          const { x, y } = getCoordinates(i, 1.28);
          return (
            <React.Fragment key={`lbl-${i}`}>
              <SvgText
                x={x}
                y={y - 3}
                textAnchor="middle"
                fontSize={9}
                fontFamily={fonts.label}
                fill={colors.onSurfaceVariant}
                letterSpacing={0.6}
              >
                {t.label}
              </SvgText>
              <SvgText
                x={x}
                y={y + 11}
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
