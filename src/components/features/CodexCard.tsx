import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bookmark, Lock, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlackRule } from '../../types';
import { colors, fonts, radius } from '../../theme/tokens';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface CodexCardProps {
  rule: BlackRule;
  isBookmarked: boolean;
  isCompleted: boolean;
  isUserPro: boolean;
  onToggleBookmark: () => void;
  onToggleComplete: () => void;
  onUpgradePress?: () => void;
}

export const CodexCard: React.FC<CodexCardProps> = ({
  rule,
  isBookmarked,
  isCompleted,
  isUserPro,
  onToggleBookmark,
  onToggleComplete,
  onUpgradePress,
}) => {
  const isLocked = rule.isPro && !isUserPro;

  const handleBookmark = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    onToggleBookmark();
  };

  const handleComplete = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // safe fallback
    }
    onToggleComplete();
  };

  return (
    <Card variant="elevated" style={styles.card}>
      {/* Header bar: Law Code & Bookmark */}
      <View style={styles.headerRow}>
        <View style={styles.codeGroup}>
          <Text style={styles.lawCode}>{rule.lawCode}</Text>
          <Badge
            label={rule.category}
            variant={rule.category === 'Defense' ? 'crimson' : 'gold'}
          />
          {rule.isPro && <Badge label="PRO" variant="gold" />}
        </View>

        <View style={styles.actionGroup}>
          <Pressable onPress={handleBookmark} hitSlop={8} style={styles.iconBtn}>
            <Bookmark
              size={18}
              color={isBookmarked ? colors.gold.DEFAULT : colors.zincMuted}
              fill={isBookmarked ? colors.gold.DEFAULT : 'transparent'}
            />
          </Pressable>
          <Pressable onPress={handleComplete} hitSlop={8} style={styles.iconBtn}>
            <CheckCircle2
              size={18}
              color={isCompleted ? colors.gold.DEFAULT : colors.zincMuted}
            />
          </Pressable>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{rule.title}</Text>

      {/* Quote */}
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>"{rule.quote}"</Text>
      </View>

      {isLocked ? (
        <Pressable
          style={styles.lockedContainer}
          onPress={onUpgradePress}
          accessibilityRole="button"
        >
          <Lock size={24} color={colors.gold.DEFAULT} />
          <Text style={styles.lockedTitle}>Classified Strategic Doctrine</Text>
          <Text style={styles.lockedSubtitle}>
            Unlock full execution tactics and defensive reversals with Pro.
          </Text>
        </Pressable>
      ) : (
        <View style={styles.bodyContent}>
          {/* Premise */}
          <Text style={styles.sectionLabel}>THE DOCTRINE</Text>
          <Text style={styles.premiseText}>{rule.premise}</Text>

          {/* Psychological Trap */}
          <View style={styles.trapBox}>
            <View style={styles.trapHeader}>
              <AlertTriangle size={14} color={colors.crimson.light} />
              <Text style={styles.trapLabel}>PSYCHOLOGICAL TRAP</Text>
            </View>
            <Text style={styles.trapText}>{rule.psychologicalTrap}</Text>
          </View>

          {/* Execution Tactic */}
          <Text style={styles.sectionLabel}>TACTICAL EXECUTION</Text>
          <Text style={styles.tacticText}>{rule.executionTactic}</Text>

          {/* Reversal */}
          <Text style={styles.sectionLabel}>THE REVERSAL</Text>
          <Text style={styles.reversalText}>{rule.reversal}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: colors.charcoal,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
  lawCode: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.gold.DEFAULT,
    letterSpacing: 1,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.alabaster,
    lineHeight: 28,
    marginBottom: 12,
  },
  quoteBox: {
    borderLeftWidth: 2,
    borderLeftColor: colors.gold.DEFAULT,
    paddingLeft: 12,
    marginBottom: 16,
  },
  quoteText: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.zincMuted,
    lineHeight: 18,
  },
  bodyContent: {
    gap: 10,
  },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.gold.dark,
    letterSpacing: 1.2,
    marginTop: 6,
  },
  premiseText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.alabaster,
    lineHeight: 21,
  },
  trapBox: {
    backgroundColor: colors.crimson.muted,
    borderColor: colors.crimson.DEFAULT,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginTop: 6,
    marginBottom: 6,
  },
  trapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  trapLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: '#FCA5A5',
    letterSpacing: 1,
  },
  trapText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.alabaster,
    lineHeight: 19,
  },
  tacticText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.alabaster,
    lineHeight: 20,
  },
  reversalText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.zincMuted,
    lineHeight: 19,
  },
  lockedContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.04)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.gold.DEFAULT,
    borderRadius: radius.md,
    gap: 8,
  },
  lockedTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.alabaster,
  },
  lockedSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.zincMuted,
    textAlign: 'center',
  },
});
