import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { AppIcon } from '../../components/ui/AppIcon';
import { PixelArtBanner, PixelBannerVariant } from '../../components/ui/PixelArtBanner';
import { LoadingDots } from '../../components/ui/LoadingOverlay';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';
import { ARENA_SCENARIOS } from '../../store/mockData';
import { TraitKey } from '../../types';

const SCENARIO_VARIANTS: PixelBannerVariant[] = ['chess', 'scale', 'shield', 'eye', 'crown'];

export default function ArenaScreen() {
  const router = useRouter();
  const {
    scenarios: storeScenarios,
    isPro,
    completeArenaScenario,
    completedScenarioIds,
  } = useUserStore();

  const scenarios = storeScenarios && storeScenarios.length > 0 ? storeScenarios : ARENA_SCENARIOS;

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<'A' | 'B' | 'C'>('C');
  const [isLoading, setIsLoading] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];
  const isScenarioCompleted = completedScenarioIds?.includes(currentScenario.id) || false;
  const bannerVariant = SCENARIO_VARIANTS[currentScenarioIndex % SCENARIO_VARIANTS.length];

  const selectedOption =
    currentScenario.options.find((opt) => opt.id === selectedKey) ||
    currentScenario.options[0];

  const handleSelectScenario = (index: number) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }

    const target = scenarios[index];
    if (target.isPro && !isPro) {
      router.push('/paywall');
      return;
    }

    setCurrentScenarioIndex(index);
    setHasConfirmed(completedScenarioIds?.includes(target.id) || false);
    setIsLoading(false);
    setSelectedKey(target.options.find((o) => o.isRecommended)?.id || 'A');
  };

  const handleSelectChoice = (id: 'A' | 'B' | 'C') => {
    if (hasConfirmed) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    setSelectedKey(id);
  };

  const handleConfirmChoice = () => {
    if (hasConfirmed || isLoading) return;

    if (currentScenario.isPro && !isPro) {
      router.push('/paywall');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setHasConfirmed(true);

      completeArenaScenario(
        currentScenario.id,
        selectedOption.expReward,
        selectedOption.traitDeltas
      );

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // safe fallback
      }
    }, 600);
  };

  const handleNextScenario = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }

    const nextIndex = (currentScenarioIndex + 1) % scenarios.length;
    const target = scenarios[nextIndex];
    if (target.isPro && !isPro) {
      router.push('/paywall');
      return;
    }

    setCurrentScenarioIndex(nextIndex);
    setHasConfirmed(completedScenarioIds?.includes(target.id) || false);
    setIsLoading(false);
    setSelectedKey(target.options.find((o) => o.isRecommended)?.id || 'A');
  };

  const handleResetChoice = () => {
    setHasConfirmed(false);
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="Practice" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Scenario Selector Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scenarioSelectorRow}
        >
          {scenarios.map((sc, idx) => {
            const isActive = idx === currentScenarioIndex;
            const isDone = completedScenarioIds?.includes(sc.id);

            return (
              <Pressable
                key={sc.id}
                onPress={() => handleSelectScenario(idx)}
                style={[
                  styles.pill,
                  isActive && styles.pillActive,
                  sc.isPro && !isPro && styles.pillPro,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isActive && styles.pillTextActive,
                  ]}
                >
                  Scenario {idx + 1}
                  {sc.isPro && !isPro ? ' (PRO)' : ''}
                </Text>

                {isDone && (
                  <AppIcon
                    name="check_circle"
                    size={11}
                    color={isActive ? '#09090B' : '#FFFFFF'}
                  />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Clear Situation Card */}
        <View style={styles.situationCard}>
          <PixelArtBanner variant={bannerVariant} height={120} showBorder={false} />

          <View style={styles.situationBody}>
            <View style={styles.situationMeta}>
              <Text style={styles.situationTag}>
                {currentScenario.roomNumber} • {currentScenario.difficulty.toUpperCase()}
              </Text>
              {currentScenario.isPro && (
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PRO SCENARIO</Text>
                </View>
              )}
            </View>

            <Text style={styles.situationTitle}>{currentScenario.title}</Text>
            <Text style={styles.situationNarrative}>{currentScenario.narrative}</Text>

            <View style={styles.questionBox}>
              <Text style={styles.questionText}>{currentScenario.question}</Text>
            </View>
          </View>
        </View>

        {/* 3 Clean Choice Cards */}
        <View style={styles.choicesSection}>
          <Text style={styles.choicesSectionTitle}>YOUR RESPONSE</Text>

          {currentScenario.options.map((opt) => {
            const isSelected = selectedKey === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => handleSelectChoice(opt.id)}
                style={[
                  styles.choiceCard,
                  isSelected && styles.choiceCardSelected,
                ]}
              >
                <View
                  style={[
                    styles.choiceBadge,
                    isSelected && styles.choiceBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceBadgeText,
                      isSelected && styles.choiceBadgeTextSelected,
                    ]}
                  >
                    {opt.id}
                  </Text>
                </View>

                <View style={styles.choiceContent}>
                  <Text style={styles.choiceLabel}>{opt.label}</Text>
                  <Text style={styles.choiceQuote}>"{opt.quote}"</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Action Button or Result Card */}
        {hasConfirmed ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultLabel}>RESULT & LESSON</Text>
              <Text style={styles.resultXp}>+{selectedOption.expReward} XP</Text>
            </View>

            <Text style={styles.resultEffect}>{selectedOption.tacticalEffect}</Text>

            <View style={styles.lessonBox}>
              <Text style={styles.lessonTag}>WHAT ACTUALLY HAPPENED</Text>
              <Text style={styles.lessonForecast}>{selectedOption.forecast}</Text>
            </View>

            <View style={styles.resultActions}>
              <Pressable onPress={handleResetChoice} style={styles.tryAnotherBtn}>
                <Text style={styles.tryAnotherText}>Try Another Choice</Text>
              </Pressable>

              <Pressable onPress={handleNextScenario} style={styles.nextScenarioBtn}>
                <Text style={styles.nextScenarioText}>Next Scenario →</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={handleConfirmChoice}
            disabled={isLoading}
            style={[styles.confirmBtn, isLoading && styles.confirmBtnDisabled]}
          >
            {isLoading ? (
              <LoadingDots size={6} color="#09090B" />
            ) : (
              <Text style={styles.confirmBtnText}>
                Confirm Choice {selectedKey} →
              </Text>
            )}
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 18,
  },
  scenarioSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  pillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  pillPro: {
    borderColor: '#3F3F46',
  },
  pillText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#A1A1AA',
  },
  pillTextActive: {
    color: '#09090B',
    fontFamily: fonts.labelSemiBold,
  },
  situationCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  situationBody: {
    padding: 16,
    gap: 12,
  },
  situationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  situationTag: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1,
  },
  proBadge: {
    backgroundColor: '#27272A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proBadgeText: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: '#FAFAFA',
  },
  situationTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: '#FAFAFA',
  },
  situationNarrative: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 20,
  },
  questionBox: {
    backgroundColor: '#050507',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    padding: 12,
  },
  questionText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: '#FAFAFA',
    lineHeight: 18,
  },
  choicesSection: {
    gap: 10,
  },
  choicesSectionTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  choiceCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  choiceCardSelected: {
    backgroundColor: '#18181B',
    borderColor: '#FFFFFF',
  },
  choiceBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  choiceBadgeSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  choiceBadgeText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#A1A1AA',
  },
  choiceBadgeTextSelected: {
    color: '#09090B',
  },
  choiceContent: {
    flex: 1,
    gap: 4,
  },
  choiceLabel: {
    fontFamily: fonts.headlineMedium,
    fontSize: 14,
    color: '#FAFAFA',
  },
  choiceQuote: {
    fontFamily: fonts.body,
    fontStyle: 'italic',
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 17,
  },
  confirmBtn: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  confirmBtnDisabled: {
    opacity: 0.8,
  },
  confirmBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 13,
    color: '#09090B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  resultCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginTop: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  resultXp: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  resultEffect: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#FAFAFA',
    lineHeight: 19,
  },
  lessonBox: {
    backgroundColor: '#050507',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  lessonTag: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1,
  },
  lessonForecast: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 10,
    color: '#FAFAFA',
    letterSpacing: 0.5,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  tryAnotherBtn: {
    flex: 1,
    height: 46,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryAnotherText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: '#A1A1AA',
  },
  nextScenarioBtn: {
    flex: 1,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextScenarioText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: '#09090B',
  },
});
