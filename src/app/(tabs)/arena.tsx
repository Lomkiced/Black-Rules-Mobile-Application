import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { AppIcon } from '../../components/ui/AppIcon';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';
import { ARENA_SCENARIOS } from '../../store/mockData';
import { TraitKey } from '../../types';

const ELENA_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrGG84acRosCC5hZ-eL73H6Ptl9iHaPEf11DlKHKInScqxXhEFhGr8i9juFcJ7DB94XJHaeaxtvvOGqxATmJpa27fMA5cLBS4uk6ad6HrkmqlTHg3i1H1ttqwCJ5vKuU5GzZVvrH2wIlfG1By_lv4bMOAJKWkqCauXwPKMBnuCqiWcJvwHIWyFlkDXEMC5blfRMcecNVJfYeVVxmDDQ8pWpKzok8P7BICPAMVqQygiXIZ8nF6W-e6z2w';

const MARCUS_AVATAR =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80';

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
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLockedIn, setIsLockedIn] = useState(false);

  const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];
  const isCompleted = completedScenarioIds?.includes(currentScenario.id) || false;
  const isProRoom = currentScenario.isPro && !isPro;

  const selectedOption =
    currentScenario.options.find((opt) => opt.id === selectedKey) ||
    currentScenario.options[0];

  const handleSelectRoom = (index: number) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }

    const targetScenario = scenarios[index];
    if (targetScenario.isPro && !isPro) {
      router.push('/paywall');
      return;
    }

    setCurrentScenarioIndex(index);
    setIsLockedIn(completedScenarioIds?.includes(targetScenario.id) || false);
    setIsExecuting(false);
    setSelectedKey(targetScenario.options.find((o) => o.isRecommended)?.id || 'A');
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C') => {
    if (isLockedIn) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    setSelectedKey(key);
  };

  const handleExecute = () => {
    if (isLockedIn || isExecuting) return;

    if (currentScenario.isPro && !isPro) {
      router.push('/paywall');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }

    setIsExecuting(true);

    setTimeout(() => {
      setIsExecuting(false);
      setIsLockedIn(true);
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
    }, 900);
  };

  const handleNextRoom = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }

    const nextIndex = (currentScenarioIndex + 1) % scenarios.length;
    const nextScenario = scenarios[nextIndex];
    if (nextScenario.isPro && !isPro) {
      router.push('/paywall');
      return;
    }

    setCurrentScenarioIndex(nextIndex);
    setIsLockedIn(completedScenarioIds?.includes(nextScenario.id) || false);
    setIsExecuting(false);
    setSelectedKey(nextScenario.options.find((o) => o.isRecommended)?.id || 'A');
  };

  const formatTraitDeltas = (deltas: Partial<Record<TraitKey, number>>) => {
    return Object.entries(deltas)
      .map(([key, val]) => `${key.toUpperCase()} ${val && val > 0 ? `+${val}` : val}`)
      .join(' • ');
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="The Arena" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Room Selector Horizontal Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.roomSelectorRow}
        >
          {scenarios.map((sc, idx) => {
            const isActive = idx === currentScenarioIndex;
            const isScCompleted = completedScenarioIds?.includes(sc.id);

            return (
              <Pressable
                key={sc.id}
                onPress={() => handleSelectRoom(idx)}
                style={[
                  styles.roomPill,
                  isActive && styles.roomPillActive,
                  sc.isPro && !isPro && styles.roomPillPro,
                ]}
              >
                <Text
                  style={[
                    styles.roomPillText,
                    isActive && styles.roomPillTextActive,
                  ]}
                >
                  {sc.roomNumber}
                </Text>

                {sc.isPro && !isPro ? (
                  <View style={styles.proTagSmall}>
                    <AppIcon name="lock" size={9} color={colors.primary} />
                    <Text style={styles.proTagSmallText}>PRO</Text>
                  </View>
                ) : isScCompleted ? (
                  <AppIcon
                    name="check_circle"
                    size={11}
                    color={isActive ? colors.onPrimary : colors.primary}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Top Banner: Active Simulation Room Header */}
        <View style={styles.topBanner}>
          <View style={styles.bannerRow}>
            <Text style={styles.roomCode}>
              {currentScenario.roomNumber} // {currentScenario.difficulty.toUpperCase()}
            </Text>
            <View style={styles.timerTag}>
              <AppIcon name="timer" size={13} color={colors.primary} />
              <Text style={styles.timerText}>Live Pressure • 90s to Decide</Text>
            </View>
          </View>

          <View style={styles.scenarioTitleRow}>
            <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
            {/* Gold stars */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <AppIcon
                  key={s}
                  name="star"
                  size={12}
                  color={s <= currentScenario.stars ? colors.primary : colors.outlineVariant}
                  filled={s <= currentScenario.stars}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Narrative Context Card */}
        <View style={styles.contextCard}>
          <View style={styles.contextHeader}>
            <Text style={styles.contextLabel}>{currentScenario.contextTag}</Text>
            <View style={styles.attentionTag}>
              <Text style={styles.attentionText}>ATTENTION: 100%</Text>
            </View>
          </View>

          {/* Overlapping circular avatars */}
          <View style={styles.avatarsRow}>
            <View style={styles.avatarOverlapContainer}>
              <Image
                source={{ uri: ELENA_AVATAR }}
                style={[styles.avatarCircle, styles.avatarElena]}
              />
              <Image
                source={{ uri: MARCUS_AVATAR }}
                style={[styles.avatarCircle, styles.avatarMarcus]}
              />
            </View>
            <View style={styles.participantsTextContainer}>
              <Text style={styles.participantName}>{currentScenario.stakeholders}</Text>
              <Text style={styles.participantSub}>High-Stakes Arena Dilemma</Text>
            </View>
          </View>

          {/* Narrative text */}
          <Text style={styles.narrativeBody}>{currentScenario.narrative}</Text>

          <View style={styles.dilemmaBox}>
            <AppIcon name="help_outline" size={14} color={colors.primary} />
            <Text style={styles.dilemmaText}>{currentScenario.question}</Text>
          </View>
        </View>

        {/* 3 Interactive Response Cards */}
        <View style={styles.optionsSection}>
          <Text style={styles.optionsSectionTitle}>SELECT TACTICAL RESPONSE</Text>

          {currentScenario.options.map((opt) => {
            const isSelected = selectedKey === opt.id;
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
                      styles.optionKeyCircle,
                      isSelected && styles.optionKeyCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionKeyText,
                        isSelected && styles.optionKeyTextSelected,
                      ]}
                    >
                      {opt.id}
                    </Text>
                  </View>

                  <View style={styles.optionTagBox}>
                    <Text style={styles.optionRiskTag}>{opt.riskTag}</Text>
                    {opt.isRecommended && (
                      <View style={styles.recommendedBadge}>
                        <AppIcon name="bolt" size={9} color={colors.primary} />
                        <Text style={styles.recommendedText}>OPTIMAL FRAME</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.optionTitle}>{opt.label}</Text>
                <Text style={styles.optionQuote}>{opt.quote}</Text>

                <View style={styles.optionPostureRow}>
                  <Text style={styles.postureDesc}>{opt.tacticalEffect}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Dynamic Tactical Simulation Forecast Bar */}
        <View style={styles.forecastBar}>
          <View style={styles.forecastHeaderRow}>
            <View style={styles.forecastLeft}>
              <AppIcon name="bolt" size={15} color={colors.primary} />
              <Text style={styles.forecastText}>Tactical Simulation Forecast</Text>
            </View>
            <Text style={styles.forecastXp}>+{selectedOption.expReward} EXP</Text>
          </View>

          <Text style={styles.forecastOutcome}>{selectedOption.forecast}</Text>

          {selectedOption.traitDeltas && (
            <View style={styles.traitDeltaRow}>
              <Text style={styles.traitDeltaText}>
                {formatTraitDeltas(selectedOption.traitDeltas)}
              </Text>
            </View>
          )}
        </View>

        {/* Action Button: Execute or Next Room */}
        {isLockedIn ? (
          <View style={styles.lockedContainer}>
            <View style={styles.lockedInBanner}>
              <AppIcon name="shield" size={16} color={colors.onSecondaryContainer} />
              <Text style={styles.lockedInText}>
                PROTOCOL EXECUTED • {selectedOption.expReward} EXP SECURED
              </Text>
            </View>

            <Pressable onPress={handleNextRoom} style={styles.nextRoomBtn}>
              <Text style={styles.nextRoomBtnText}>Next Simulation Room</Text>
              <AppIcon name="arrow_forward" size={16} color={colors.onPrimary} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handleExecute}
            disabled={isExecuting}
            style={[
              styles.executeBtn,
              isExecuting && styles.executeBtnDisabled,
            ]}
          >
            {isExecuting ? (
              <View style={styles.executingRow}>
                <ActivityIndicator size="small" color={colors.onPrimary} />
                <Text style={styles.executeBtnText}>
                  ANALYZING TACTICAL IMPACT...
                </Text>
              </View>
            ) : (
              <View style={styles.executingRow}>
                <Text style={styles.executeBtnText}>
                  Execute Response {selectedKey}
                </Text>
                <AppIcon name="arrow_forward" size={16} color={colors.onPrimary} />
              </View>
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
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 120,
    gap: 16,
  },
  roomSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 2,
  },
  roomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  roomPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roomPillPro: {
    borderColor: 'rgba(242, 202, 80, 0.4)',
  },
  roomPillText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  roomPillTextActive: {
    fontFamily: fonts.labelSemiBold,
    color: colors.onPrimary,
  },
  proTagSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(242, 202, 80, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proTagSmallText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: colors.primary,
  },
  topBanner: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomCode: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.4,
  },
  timerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onSurfaceVariant,
  },
  scenarioTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scenarioTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 15,
    color: colors.onSurface,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  contextCard: {
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  contextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contextLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.outline,
    letterSpacing: 1,
  },
  attentionTag: {
    backgroundColor: 'rgba(242, 202, 80, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  attentionText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarOverlapContainer: {
    flexDirection: 'row',
    width: 58,
    height: 36,
    position: 'relative',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  avatarElena: {
    position: 'absolute',
    left: 0,
    zIndex: 2,
  },
  avatarMarcus: {
    position: 'absolute',
    left: 22,
    zIndex: 1,
  },
  participantsTextContainer: {
    gap: 2,
    flex: 1,
  },
  participantName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.onSurface,
  },
  participantSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  narrativeBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  dilemmaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 10,
    padding: 10,
  },
  dilemmaText: {
    flex: 1,
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.onSurface,
    lineHeight: 16,
  },
  optionsSection: {
    gap: 10,
  },
  optionsSectionTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    letterSpacing: 1.2,
  },
  optionCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
    gap: 8,
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
    alignItems: 'center',
    gap: 10,
  },
  optionKeyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionKeyCircleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionKeyText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.primary,
  },
  optionKeyTextSelected: {
    color: colors.onPrimary,
  },
  optionTagBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionRiskTag: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(242, 202, 80, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 8,
    color: colors.primary,
  },
  optionTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 15,
    color: colors.onSurface,
  },
  optionQuote: {
    fontFamily: fonts.body,
    fontStyle: 'italic',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  optionPostureRow: {
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingTop: 6,
    marginTop: 2,
  },
  postureDesc: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.outline,
    lineHeight: 14,
  },
  forecastBar: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  forecastHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  forecastText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  forecastXp: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.primary,
  },
  forecastOutcome: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.6,
  },
  traitDeltaRow: {
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  traitDeltaText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  lockedContainer: {
    gap: 10,
  },
  lockedInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondaryContainer,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  lockedInText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.onSecondaryContainer,
    letterSpacing: 0.8,
  },
  nextRoomBtn: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextRoomBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.onPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  executeBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  executeBtnDisabled: {
    opacity: 0.8,
  },
  executingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  executeBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.onPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
