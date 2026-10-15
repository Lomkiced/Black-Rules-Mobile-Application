import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '../../components/ui/AppIcon';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';
import { TraitKey } from '../../types';

interface DiagnosticOption {
  id: string;
  indexCode: string;
  label: string;
  impactTag: string;
  traitDeltas: Partial<Record<TraitKey, number>>;
}

interface DiagnosticStep {
  category: string;
  question: string;
  subContext: string;
  options: DiagnosticOption[];
}

const DIAGNOSTIC_STEPS: DiagnosticStep[] = [
  {
    category: 'STOICISM & ASSERTIVENESS',
    question: 'How do you respond when interrupted during a high-stakes meeting?',
    subContext: 'Assessing your baseline threshold for emotional containment versus reactive defense.',
    options: [
      {
        id: 'opt-1-1',
        indexCode: '01',
        label: 'Maintain neutral eye contact in silence until they finish, then continue your exact sentence as if no interruption occurred.',
        impactTag: 'High Stoicism • Controlled Frame',
        traitDeltas: { stoicism: +8, assertiveness: +4 },
      },
      {
        id: 'opt-1-2',
        indexCode: '02',
        label: 'Raise hand smoothly and firmly state: "Hold that thought, I am finishing the thesis before we take inquiries."',
        impactTag: 'High Assertiveness • Boundary Defense',
        traitDeltas: { assertiveness: +8, stoicism: +2 },
      },
      {
        id: 'opt-1-3',
        indexCode: '03',
        label: 'Yield the floor immediately and wait to see if the chair returns the speaking turn to you later.',
        impactTag: 'Vulnerable Compliance • Frame Loss',
        traitDeltas: { stoicism: -4, assertiveness: -6 },
      },
    ],
  },
  {
    category: 'NEGOTIATION & LEVERAGE',
    question: 'A counterpart presents an aggressive lowball offer and waits for your reaction. What is your immediate move?',
    subContext: 'Testing reserve posture against manufactured price discounting anchors.',
    options: [
      {
        id: 'opt-2-1',
        indexCode: '01',
        label: 'Hold 4 seconds of dead silence and maintain eye contact until they bid against themselves.',
        impactTag: 'High Negotiation • +8 Leverage',
        traitDeltas: { negotiation: +8, stoicism: +5 },
      },
      {
        id: 'opt-2-2',
        indexCode: '02',
        label: 'Immediately justify your price with a detailed breakdown of your costs and operational complexity.',
        impactTag: 'Over-Explanation • -5 Leverage',
        traitDeltas: { negotiation: -5, assertiveness: -3 },
      },
      {
        id: 'opt-2-3',
        indexCode: '03',
        label: 'Split the difference immediately to preserve relationship harmony and close the deal today.',
        impactTag: 'Premature Concession • -8 Leverage',
        traitDeltas: { negotiation: -8, assertiveness: -5 },
      },
    ],
  },
  {
    category: 'SOCIAL AWARENESS & DECEPTION DEFENSE',
    question: 'A colleague suddenly becomes unusually complimentary right before a major reorganization. How do you read the signal?',
    subContext: 'Detecting counterfeit warmth deployed to probe for strategic leaks.',
    options: [
      {
        id: 'opt-3-1',
        indexCode: '01',
        label: 'Audit what information they are extracting and feed only non-critical variables while noting the behavioral shift.',
        impactTag: 'Apex Awareness • +10 Defense',
        traitDeltas: { awareness: +10, persuasion: +4 },
      },
      {
        id: 'opt-3-2',
        indexCode: '02',
        label: 'Share your upcoming division roadmap openly to reciprocate and build an internal coalition.',
        impactTag: 'Exposed Flank • High Strategic Risk',
        traitDeltas: { awareness: -6, negotiation: -4 },
      },
      {
        id: 'opt-3-3',
        indexCode: '03',
        label: 'Confront them publicly about their sudden shift in tone during the morning standup.',
        impactTag: 'Premature Escalation • Medium Risk',
        traitDeltas: { awareness: -2, stoicism: -5 },
      },
    ],
  },
];

export default function DiagnosticScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeDiagnostic } = useUserStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<Record<number, string>>({});
  const [isCalibrating, setIsCalibrating] = useState(false);

  const step = DIAGNOSTIC_STEPS[currentStepIndex];
  const selectedOptionId = selectedOptionIds[currentStepIndex];

  const handleSelectOption = (id: string) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    setSelectedOptionIds((prev) => ({
      ...prev,
      [currentStepIndex]: id,
    }));
  };

  const handleSkip = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    completeDiagnostic({});
    router.replace('/(tabs)');
  };

  const handleConfirmStep = () => {
    if (!selectedOptionId || isCalibrating) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }

    if (currentStepIndex < DIAGNOSTIC_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Final step -> Calibrate
      setIsCalibrating(true);

      // Aggregate all trait deltas
      const aggregatedDeltas: Partial<Record<TraitKey, number>> = {};
      DIAGNOSTIC_STEPS.forEach((s, idx) => {
        const chosenId = selectedOptionIds[idx];
        const chosenOpt = s.options.find((o) => o.id === chosenId);
        if (chosenOpt && chosenOpt.traitDeltas) {
          (Object.keys(chosenOpt.traitDeltas) as TraitKey[]).forEach((trait) => {
            aggregatedDeltas[trait] = (aggregatedDeltas[trait] ?? 0) + (chosenOpt.traitDeltas[trait] ?? 0);
          });
        }
      });

      setTimeout(() => {
        completeDiagnostic(aggregatedDeltas);
        setIsCalibrating(false);

        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {
          // safe fallback
        }

        router.replace('/(tabs)');
      }, 900);
    }
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top + 8, 20),
          },
        ]}
      >
        <View style={styles.headerTopRow}>
          <Text style={styles.assessmentCode}>
            ASSESSMENT // STEP 0{currentStepIndex + 1} OF 03
          </Text>
          <Pressable onPress={handleSkip} hitSlop={12} style={styles.skipBtn}>
            <Text style={styles.skipText}>SKIP</Text>
          </Pressable>
        </View>

        {/* 3-segment Progress Bar */}
        <View style={styles.segmentRow}>
          {DIAGNOSTIC_STEPS.map((_, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.segment,
                  isCompleted && styles.segmentCompleted,
                  isCurrent && styles.segmentCurrent,
                ]}
              />
            );
          })}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Pill */}
        <View style={styles.categoryPill}>
          <AppIcon name="radar" size={13} color={colors.primary} />
          <Text style={styles.categoryText}>{step.category}</Text>
        </View>

        {/* Question Title & Subtitle */}
        <View style={styles.questionBlock}>
          <Text style={styles.questionTitle}>{step.question}</Text>
          <Text style={styles.questionSub}>{step.subContext}</Text>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          {step.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => handleSelectOption(opt.id)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
              >
                <View style={styles.optionTopRow}>
                  <View
                    style={[
                      styles.indexCircle,
                      isSelected && styles.indexCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.indexCodeText,
                        isSelected && styles.indexCodeTextSelected,
                      ]}
                    >
                      {opt.indexCode}
                    </Text>
                  </View>

                  <View style={styles.impactBadge}>
                    <Text style={styles.impactBadgeText}>{opt.impactTag}</Text>
                  </View>
                </View>

                <Text style={styles.optionLabel}>{opt.label}</Text>

                {isSelected && (
                  <View style={styles.selectedMarker}>
                    <AppIcon name="check_circle" size={14} color={colors.primary} />
                    <Text style={styles.selectedMarkerText}>POSTURE SELECTED</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom + 16, 24),
          },
        ]}
      >
        <Pressable
          onPress={handleConfirmStep}
          disabled={!selectedOptionId || isCalibrating}
          style={[
            styles.ctaButton,
            (!selectedOptionId || isCalibrating) && styles.ctaButtonDisabled,
          ]}
        >
          {isCalibrating ? (
            <View style={styles.btnRow}>
              <ActivityIndicator size="small" color={colors.onPrimary} />
              <Text style={styles.ctaButtonText}>
                CALIBRATING 5-VECTOR RADAR...
              </Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <Text style={styles.ctaButtonText}>
                {currentStepIndex === 2
                  ? 'Complete Calibration & Enter Codex →'
                  : 'Confirm Tactical Posture →'}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assessmentCode: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.6,
  },
  skipBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  skipText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    letterSpacing: 1.2,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    height: 3,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 2,
  },
  segmentCompleted: {
    backgroundColor: colors.primary,
  },
  segmentCurrent: {
    backgroundColor: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 18,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(242, 202, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.2,
  },
  questionBlock: {
    gap: 8,
  },
  questionTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.onSurface,
    lineHeight: 30,
  },
  questionSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  optionCardSelected: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  optionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexCircleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  indexCodeText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 10,
    color: colors.primary,
  },
  indexCodeTextSelected: {
    color: colors.onPrimary,
  },
  impactBadge: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  impactBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.6,
  },
  optionLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 20,
  },
  selectedMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  selectedMarkerText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  ctaButton: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonDisabled: {
    opacity: 0.4,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.onPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
