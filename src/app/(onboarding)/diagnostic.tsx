import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LoadingDots } from '../../components/ui/LoadingOverlay';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';
import { TraitKey } from '../../types';

interface DiagnosticOption {
  id: string;
  number: string;
  label: string;
  traitDeltas: Partial<Record<TraitKey, number>>;
}

interface DiagnosticQuestion {
  question: string;
  options: DiagnosticOption[];
}

const QUESTIONS: DiagnosticQuestion[] = [
  {
    question: 'How do you respond when someone interrupts you in a meeting?',
    options: [
      {
        id: 'opt-1-1',
        number: '01',
        label: 'Wait in calm silence until they stop, then finish your sentence smoothly.',
        traitDeltas: { stoicism: +8, assertiveness: +4 },
      },
      {
        id: 'opt-1-2',
        number: '02',
        label: 'Raise your hand and state firmly: "Allow me to finish this thought first."',
        traitDeltas: { assertiveness: +8, stoicism: +2 },
      },
      {
        id: 'opt-1-3',
        number: '03',
        label: 'Stop talking immediately and let them take over the conversation.',
        traitDeltas: { stoicism: -4, assertiveness: -6 },
      },
    ],
  },
  {
    question: 'Someone offers you 20% less than you deserve. What is your immediate reaction?',
    options: [
      {
        id: 'opt-2-1',
        number: '01',
        label: 'Hold 4 seconds of calm silence and let them fill the void.',
        traitDeltas: { negotiation: +8, stoicism: +5 },
      },
      {
        id: 'opt-2-2',
        number: '02',
        label: 'Immediately give a long speech explaining all your costs and hard work.',
        traitDeltas: { negotiation: -4, assertiveness: -2 },
      },
      {
        id: 'opt-2-3',
        number: '03',
        label: 'Accept the discount right away to avoid any conflict.',
        traitDeltas: { negotiation: -8, assertiveness: -5 },
      },
    ],
  },
  {
    question: 'A coworker becomes unusually friendly right before major team changes. What do you do?',
    options: [
      {
        id: 'opt-3-1',
        number: '01',
        label: 'Observe their actions quietly without sharing sensitive project plans.',
        traitDeltas: { awareness: +10, persuasion: +4 },
      },
      {
        id: 'opt-3-2',
        number: '02',
        label: 'Share your plans openly hoping to make them your close ally.',
        traitDeltas: { awareness: -6, negotiation: -4 },
      },
      {
        id: 'opt-3-3',
        number: '03',
        label: 'Confront them aggressively in front of the entire group.',
        traitDeltas: { awareness: -2, stoicism: -6 },
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
  const [isFinishing, setIsFinishing] = useState(false);

  const currentQ = QUESTIONS[currentStepIndex];
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

  const handleNextStep = () => {
    if (!selectedOptionId || isFinishing) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }

    if (currentStepIndex < QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsFinishing(true);

      const aggregatedDeltas: Partial<Record<TraitKey, number>> = {};
      QUESTIONS.forEach((q, idx) => {
        const chosenId = selectedOptionIds[idx];
        const chosenOpt = q.options.find((o) => o.id === chosenId);
        if (chosenOpt && chosenOpt.traitDeltas) {
          (Object.keys(chosenOpt.traitDeltas) as TraitKey[]).forEach((trait) => {
            aggregatedDeltas[trait] = (aggregatedDeltas[trait] ?? 0) + (chosenOpt.traitDeltas[trait] ?? 0);
          });
        }
      });

      setTimeout(() => {
        completeDiagnostic(aggregatedDeltas);
        setIsFinishing(false);
        router.replace('/(tabs)');
      }, 700);
    }
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

  return (
    <View style={styles.root}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top + 8, 18),
          },
        ]}
      >
        <View style={styles.headerTopRow}>
          <Text style={styles.stepTitle}>
            Quick Character Check (Step {currentStepIndex + 1} of 3)
          </Text>
          <Pressable onPress={handleSkip} hitSlop={10}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <Text style={styles.stepSubtitle}>
          Answer 3 quick questions to set your starting scores.
        </Text>

        {/* 3-segment Progress Bar */}
        <View style={styles.progressBar}>
          {[0, 1, 2].map((idx) => (
            <View
              key={idx}
              style={[
                styles.segment,
                idx <= currentStepIndex ? styles.segmentActive : styles.segmentInactive,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Text */}
        <Text style={styles.questionText}>{currentQ.question}</Text>

        {/* Numbered Options */}
        <View style={styles.optionsList}>
          {currentQ.options.map((opt) => {
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
                <View
                  style={[
                    styles.numberBadge,
                    isSelected && styles.numberBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.numberText,
                      isSelected && styles.numberTextSelected,
                    ]}
                  >
                    {opt.number}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom + 16, 24),
          },
        ]}
      >
        <Pressable
          onPress={handleNextStep}
          disabled={!selectedOptionId || isFinishing}
          style={[
            styles.ctaButton,
            (!selectedOptionId || isFinishing) && styles.ctaDisabled,
          ]}
        >
          {isFinishing ? (
            <LoadingDots size={6} color="#09090B" />
          ) : (
            <Text style={styles.ctaText}>
              {currentStepIndex === 2 ? 'Finish Setup →' : 'Next Question →'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#FAFAFA',
    letterSpacing: 0.6,
  },
  skipText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: '#71717A',
  },
  stepSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#A1A1AA',
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentInactive: {
    backgroundColor: '#27272A',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 20,
  },
  questionText: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: '#FAFAFA',
    lineHeight: 30,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  optionCardSelected: {
    backgroundColor: '#18181B',
    borderColor: '#FFFFFF',
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  numberText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#A1A1AA',
  },
  numberTextSelected: {
    color: '#09090B',
  },
  optionLabel: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#D4D4D8',
    lineHeight: 20,
    marginTop: 3,
  },
  optionLabelSelected: {
    color: '#FAFAFA',
    fontFamily: fonts.bodyMedium,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    backgroundColor: '#09090B',
  },
  ctaButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: {
    opacity: 0.35,
  },
  ctaText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 13,
    color: '#09090B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
