import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bookmark, Lock, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlackRule } from '../../types';
import { colors, fonts } from '../../theme/tokens';
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
          <Text style={styles.lawCode}>RULE #{rule.number}</Text>
          <Badge
            label={rule.category}
            variant="gold"
          />
          {rule.isPro && <Badge label="PRO" variant="gold" />}
        </View>

        <View style={styles.actionGroup}>
          <Pressable onPress={handleBookmark} hitSlop={8} style={styles.iconBtn}>
            <Bookmark
              size={18}
              color={isBookmarked ? colors.primary : colors.outline}
              fill={isBookmarked ? colors.primary : 'transparent'}
            />
          </Pressable>
          <Pressable onPress={handleComplete} hitSlop={8} style={styles.iconBtn}>
            <CheckCircle2
              size={18}
              color={isCompleted ? colors.primary : colors.outline}
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
          <Lock size={24} color={colors.primary} />
          <Text style={styles.lockedTitle}>Classified Strategic Doctrine</Text>
          <Text style={styles.lockedSubtitle}>
            Unlock full execution tactics and defensive reversals with Pro.
          </Text>
        </Pressable>
      ) : (
        <View style={styles.bodyContent}>
          {/* Summary / Premise */}
          <Text style={styles.sectionLabel}>THE DOCTRINE</Text>
          <Text style={styles.premiseText}>{rule.summary}</Text>

          {/* Psychology Trap */}
          {rule.psychBullets && rule.psychBullets.length > 0 && (
            <View style={styles.trapBox}>
              <View style={styles.trapHeader}>
                <AlertTriangle size={14} color="#FCA5A5" />
                <Text style={styles.trapLabel}>PSYCHOLOGICAL TRAP</Text>
              </View>
              <Text style={styles.trapText}>{rule.psychBullets[0]}</Text>
            </View>
          )}

          {/* Law / Tactic */}
          {rule.lawBullets && rule.lawBullets.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>TACTICAL EXECUTION</Text>
              <Text style={styles.tacticText}>{rule.lawBullets[0]}</Text>
            </>
          )}

          {/* Defense / Reversal */}
          {rule.defenseBullets && rule.defenseBullets.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>DEFENSIVE REVERSAL</Text>
              <Text style={styles.reversalText}>{rule.defenseBullets[0]}</Text>
            </>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: colors.surfaceContainerLow,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
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
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 1,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.onSurface,
    lineHeight: 28,
    marginBottom: 12,
  },
  quoteBox: {
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
    paddingLeft: 12,
    marginBottom: 16,
  },
  quoteText: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  bodyContent: {
    gap: 10,
  },
  sectionLabel: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.2,
    marginTop: 6,
  },
  premiseText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurface,
    lineHeight: 21,
  },
  trapBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 10,
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
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#FCA5A5',
    letterSpacing: 1,
  },
  trapText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 19,
  },
  tacticText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurface,
    lineHeight: 20,
  },
  reversalText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 19,
  },
  lockedContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(242, 202, 80, 0.04)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 12,
    gap: 8,
  },
  lockedTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.onSurface,
  },
  lockedSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
