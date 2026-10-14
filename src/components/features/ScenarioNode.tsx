import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AlertCircle, ChevronRight, ShieldAlert, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ScenarioChoice, ScenarioNode as ScenarioNodeType } from '../../types';
import { colors, fonts, radius } from '../../theme/tokens';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ScenarioNodeProps {
  node: ScenarioNodeType;
  onSelectChoice: (choice: ScenarioChoice) => void;
  selectedChoiceId?: string;
  isResolved?: boolean;
}

export const ScenarioNodeView: React.FC<ScenarioNodeProps> = ({
  node,
  onSelectChoice,
  selectedChoiceId,
  isResolved = false,
}) => {
  const handleChoicePress = (choice: ScenarioChoice) => {
    if (isResolved) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }
    onSelectChoice(choice);
  };

  return (
    <View style={styles.container}>
      {/* Node Header & Character */}
      <Card variant="elevated" style={styles.contextCard}>
        <View style={styles.headerRow}>
          <Badge label="INCOMING ENCOUNTER" variant="crimson" />
          <Text style={styles.nodeTitle}>{node.title}</Text>
        </View>

        <Text style={styles.characterLabel}>{node.character}</Text>

        <View style={styles.dialogueBox}>
          <Text style={styles.dialogueText}>{node.dialogue}</Text>
        </View>

        <Text style={styles.contextText}>{node.context}</Text>

        {node.trapWarning && (
          <View style={styles.trapBox}>
            <ShieldAlert size={14} color={colors.crimson.light} />
            <Text style={styles.trapText}>{node.trapWarning}</Text>
          </View>
        )}
      </Card>

      {/* Choices */}
      {node.choices.length > 0 && (
        <View style={styles.choicesSection}>
          <Text style={styles.sectionHeader}>CALIBRATE YOUR MOVE</Text>
          {node.choices.map((choice, index) => {
            const isSelected = selectedChoiceId === choice.id;

            return (
              <Pressable
                key={choice.id}
                onPress={() => handleChoicePress(choice)}
                disabled={isResolved}
                style={[
                  styles.choiceCard,
                  isSelected && styles.choiceCardSelected,
                  isResolved && !isSelected && styles.choiceCardDisabled,
                ]}
              >
                <View style={styles.choiceTopRow}>
                  <Text style={styles.choiceIndex}>0{index + 1}</Text>
                  <Text style={styles.choiceLabel}>{choice.label}</Text>
                  <ChevronRight
                    size={16}
                    color={isSelected ? colors.gold.DEFAULT : colors.zincMuted}
                  />
                </View>

                <Text style={styles.choiceDesc}>{choice.description}</Text>

                {/* Impacts row */}
                <View style={styles.impactsRow}>
                  <View style={styles.xpTag}>
                    <Zap size={11} color={colors.gold.light} />
                    <Text style={styles.xpText}>+{choice.xpReward} XP</Text>
                  </View>

                  {Object.entries(choice.statImpacts).map(([stat, val]) => (
                    <Text
                      key={stat}
                      style={[
                        styles.statImpactText,
                        { color: (val ?? 0) >= 0 ? colors.gold.DEFAULT : colors.crimson.light },
                      ]}
                    >
                      {stat.toUpperCase()} {(val ?? 0) >= 0 ? `+${val}` : val}
                    </Text>
                  ))}
                </View>

                {/* Outcome Consequence when chosen */}
                {isSelected && (
                  <View style={styles.consequenceBox}>
                    <AlertCircle size={14} color={colors.gold.DEFAULT} />
                    <Text style={styles.consequenceText}>{choice.consequence}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  contextCard: {
    backgroundColor: colors.charcoal,
    borderColor: colors.borderSubtle,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  nodeTitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.zincMuted,
    letterSpacing: 0.8,
  },
  characterLabel: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.alabaster,
    marginTop: 4,
    marginBottom: 10,
  },
  dialogueBox: {
    backgroundColor: 'rgba(9, 9, 11, 0.7)',
    borderLeftWidth: 2,
    borderLeftColor: colors.crimson.DEFAULT,
    padding: 12,
    borderRadius: radius.sm,
    marginBottom: 12,
  },
  dialogueText: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: 14,
    color: colors.alabaster,
    lineHeight: 21,
  },
  contextText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.zincMuted,
    lineHeight: 19,
    marginBottom: 12,
  },
  trapBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.crimson.muted,
    borderColor: colors.crimson.DEFAULT,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 10,
  },
  trapText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 12,
    color: '#FECACA',
    lineHeight: 17,
  },
  choicesSection: {
    gap: 12,
  },
  sectionHeader: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.gold.dark,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  choiceCard: {
    backgroundColor: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    padding: 14,
    gap: 8,
  },
  choiceCardSelected: {
    borderColor: colors.gold.DEFAULT,
    backgroundColor: '#181610',
  },
  choiceCardDisabled: {
    opacity: 0.4,
  },
  choiceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  choiceIndex: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.gold.DEFAULT,
  },
  choiceLabel: {
    flex: 1,
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.alabaster,
  },
  choiceDesc: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.zincMuted,
    lineHeight: 18,
  },
  impactsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  xpTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gold.muted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  xpText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.gold.light,
  },
  statImpactText: {
    fontFamily: fonts.mono,
    fontSize: 10,
  },
  consequenceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: colors.gold.DEFAULT,
    borderRadius: radius.md,
    padding: 10,
    marginTop: 6,
  },
  consequenceText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.alabaster,
    lineHeight: 18,
  },
});
