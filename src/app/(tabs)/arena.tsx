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
import * as Haptics from 'expo-haptics';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { AppIcon } from '../../components/ui/AppIcon';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';

const ELENA_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrGG84acRosCC5hZ-eL73H6Ptl9iHaPEf11DlKHKInScqxXhEFhGr8i9juFcJ7DB94XJHaeaxtvvOGqxATmJpa27fMA5cLBS4uk6ad6HrkmqlTHg3i1H1ttqwCJ5vKuU5GzZVvrH2wIlfG1By_lv4bMOAJKWkqCauXwPKMBnuCqiWcJvwHIWyFlkDXEMC5blfRMcecNVJfYeVVxmDDQ8pWpKzok8P7BICPAMVqQygiXIZ8nF6W-e6z2w';

const MARCUS_AVATAR =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80';

type ChoiceKey = 'A' | 'B' | 'C';

interface ArenaOption {
  key: ChoiceKey;
  code: string;
  title: string;
  desc: string;
  posture: string;
}

const ARENA_OPTIONS: ArenaOption[] = [
  {
    key: 'A',
    code: 'REACTIONARY // OVERT OPPOSITION',
    title: 'Direct Confrontational Repudiation',
    desc: 'Publicly interrupt Marcus and cite your private email chain as chronological proof of ownership.',
    posture: 'High Emotional Risk • Subordinates View as Defensive',
  },
  {
    key: 'B',
    code: 'DEFENSIVE // CONCESSIONARY',
    title: 'Submissive Protocol Deference',
    desc: 'Nod along to avoid conflict during the session, planning to send an explanatory memo post-meeting.',
    posture: 'Loss of Territorial Standing • Precedent Established',
  },
  {
    key: 'C',
    code: 'BLACK RULE #19: ARCHITECTURAL ANCHOR',
    title: 'The Calibrated Anchor Inquiry',
    desc: 'Acknowledge Marcus’ enthusiasm, then ask him to detail Phase 3 implementation metrics which only you engineered.',
    posture: 'Total Sovereignty • Trap Sprung Gracefully',
  },
];

export default function ArenaScreen() {
  const insets = useSafeAreaInsets();
  const { applyStatDelta } = useUserStore();

  const [selectedKey, setSelectedKey] = useState<ChoiceKey>('C');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLockedIn, setIsLockedIn] = useState(false);

  const handleSelectOption = (key: ChoiceKey) => {
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

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }

    setIsExecuting(true);

    setTimeout(() => {
      setIsExecuting(false);
      setIsLockedIn(true);
      applyStatDelta({ stoicism: 4, awareness: 3, negotiation: 2 }, 42);

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // safe fallback
      }
    }, 1200);
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="The Arena" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 94,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Banner: Simulation Room 04 */}
        <View style={styles.topBanner}>
          <View style={styles.bannerRow}>
            <Text style={styles.roomCode}>SIMULATION ROOM 04</Text>
            <View style={styles.timerTag}>
              <AppIcon name="timer" size={13} color={colors.primary} />
              <Text style={styles.timerText}>Live Pressure • 90s to Decide</Text>
            </View>
          </View>

          <View style={styles.scenarioTitleRow}>
            <Text style={styles.scenarioTitle}>SCENARIO: THE CREDIT THIEF</Text>
            {/* 3/5 gold stars */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <AppIcon
                  key={s}
                  name="star"
                  size={12}
                  color={s <= 3 ? colors.primary : colors.outlineVariant}
                  filled={s <= 3}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Narrative Context Card */}
        <View style={styles.contextCard}>
          <View style={styles.contextHeader}>
            <Text style={styles.contextLabel}>CONTEXT: EXECUTIVE STRATEGY REVIEW</Text>
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
              <Text style={styles.participantName}>Elena Vance (MD) vs Marcus Reed</Text>
              <Text style={styles.participantSub}>Boardroom Pressure Simulation</Text>
            </View>
          </View>

          {/* Narrative text */}
          <Text style={styles.narrativeBody}>
            Marcus just presented your 6-month growth thesis as his own initiative to the Managing Committee. He turns to you with an easy smile and asks:{' '}
            <Text style={styles.narrativeHighlight}>
              “Elena, as lead researcher on this, do you agree with this direction?”
            </Text>
          </Text>
        </View>

        {/* 3 Interactive Response Cards */}
        <View style={styles.optionsSection}>
          <Text style={styles.optionsSectionTitle}>SELECT TACTICAL RESPONSE</Text>

          {ARENA_OPTIONS.map((opt) => {
            const isSelected = selectedKey === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => handleSelectOption(opt.key)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
              >
                <View style={styles.optionTopRow}>
                  <View style={styles.optionKeyCircle}>
                    <Text style={styles.optionKeyText}>{opt.key}</Text>
                  </View>
                  <Text style={styles.optionCode}>{opt.code}</Text>
                </View>

                <Text style={styles.optionTitle}>{opt.title}</Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>

                <View style={styles.optionPostureRow}>
                  <Text style={styles.postureDesc}>{opt.posture}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Tactical Simulation Forecast Bar */}
        <View style={styles.forecastBar}>
          <View style={styles.forecastLeft}>
            <AppIcon name="bolt" size={15} color={colors.primary} />
            <Text style={styles.forecastText}>Simulation Reward Forecast</Text>
          </View>
          <Text style={styles.forecastXp}>+42 EXP</Text>
        </View>

        {/* Execute Button */}
        {isLockedIn ? (
          <View style={styles.lockedInBanner}>
            <AppIcon name="shield" size={16} color={colors.onSecondaryContainer} />
            <Text style={styles.lockedInText}>
              PROTOCOL LOCKED • STATUS PRESERVED (+42 EXP)
            </Text>
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
    paddingTop: 16,
    gap: 18,
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
  narrativeHighlight: {
    fontFamily: fonts.headlineMedium,
    fontStyle: 'italic',
    color: colors.onSurface,
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
  optionKeyText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.primary,
  },
  optionCode: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  optionTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 15,
    color: colors.onSurface,
  },
  optionDesc: {
    fontFamily: fonts.body,
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
  },
  forecastBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
  lockedInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondaryContainer,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  lockedInText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 11,
    color: colors.onSecondaryContainer,
    letterSpacing: 1,
  },
});
