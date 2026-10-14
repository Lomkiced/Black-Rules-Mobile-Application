import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radius } from '../../theme/tokens';
import { Button } from '../../components/ui/Button';

interface Question {
  id: number;
  question: string;
  context: string;
  options: Array<{
    label: string;
    impact: string;
  }>;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'How do you respond when interrupted during a high-stakes meeting?',
    context: 'Assessing your baseline Stoicism & Assertiveness.',
    options: [
      { label: 'Stop immediately, wait for them to finish, then continue as if uninterrupted.', impact: 'High Stoicism' },
      { label: 'Speak louder and assert immediate control over the floor.', impact: 'High Assertiveness' },
      { label: 'Yield the floor and wait to be called on again.', impact: 'Vulnerable Compliance' },
    ],
  },
  {
    id: 2,
    question: 'A counterpart makes an unreasonable ultimatum. Your instinctive reaction:',
    context: 'Assessing your Negotiation and Perception thresholds.',
    options: [
      { label: 'Deploy a label probe: "It sounds like you have no flexibility here."', impact: 'Calibrated Negotiation' },
      { label: 'Reject the ultimatum immediately and threaten retaliation.', impact: 'Volatile Reaction' },
      { label: 'Accept concessions to maintain the relationship.', impact: 'Submissive Trap' },
    ],
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQ = QUESTIONS[currentStep];

  const handleSelectOption = (idx: number) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    setSelectedOption(idx);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top + 24, 32),
          paddingBottom: Math.max(insets.bottom + 24, 32),
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.stepCode}>ASSESSMENT // STEP 0{currentStep + 1}</Text>
        <Text style={styles.title}>Baseline Diagnostic</Text>
        <Text style={styles.context}>{currentQ.context}</Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQ.question}</Text>
      </View>

      <View style={styles.optionsList}>
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <Pressable
              key={idx}
              onPress={() => handleSelectOption(idx)}
              style={[
                styles.optionBtn,
                isSelected && styles.optionBtnSelected,
              ]}
            >
              <Text style={styles.optionIndex}>0{idx + 1}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.impactTag}>{opt.impact}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          label={currentStep < QUESTIONS.length - 1 ? 'CONTINUE DIAGNOSTIC' : 'INITIALIZE DOSSIER'}
          variant="gold"
          size="lg"
          disabled={selectedOption === null}
          onPress={handleNext}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  content: {
    paddingHorizontal: 24,
    gap: 24,
  },
  header: {
    gap: 6,
  },
  stepCode: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.gold.DEFAULT,
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.alabaster,
  },
  context: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.zincMuted,
  },
  questionCard: {
    backgroundColor: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    padding: 20,
  },
  questionText: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.alabaster,
    lineHeight: 26,
  },
  optionsList: {
    gap: 12,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    padding: 16,
  },
  optionBtnSelected: {
    borderColor: colors.gold.DEFAULT,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  optionIndex: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.gold.DEFAULT,
    marginTop: 2,
  },
  optionLabel: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.alabaster,
    lineHeight: 20,
  },
  impactTag: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.zincMuted,
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 12,
  },
});
