import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { AppIcon } from '../components/ui/AppIcon';
import { colors, fonts } from '../theme/tokens';
import { useUserStore } from '../store/useUserStore';
import { BLACK_RULES } from '../store/mockData';

interface ProtocolResult {
  frameControl: string;
  script: string;
  linkedRuleId: string;
  linkedRuleNumber: string;
  linkedRuleTitle: string;
}

const PRESET_DILEMMAS = [
  'Coworker taking credit for my project',
  'Client demanding a 30% discount',
  'Boss texting urgent tasks on weekends',
];

export default function AdvisorModalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { isPro, freeAdvisorUsesLeft, useAdvisorCredit, rules } = useUserStore();

  const [dilemmaInput, setDilemmaInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [protocolResult, setProtocolResult] = useState<ProtocolResult | null>(null);
  const [copied, setCopied] = useState(false);

  const allRules = rules && rules.length > 0 ? rules : BLACK_RULES;

  // Search filter across rules
  const matchingRules =
    dilemmaInput.trim().length > 1 && !protocolResult
      ? allRules.filter(
          (r) =>
            r.title.toLowerCase().includes(dilemmaInput.toLowerCase()) ||
            r.summary.toLowerCase().includes(dilemmaInput.toLowerCase()) ||
            r.category.toLowerCase().includes(dilemmaInput.toLowerCase())
        )
      : [];

  const handleSelectPreset = (preset: string) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    setDilemmaInput(preset);
    setProtocolResult(null);
  };

  const handleCopyScript = async (scriptText: string) => {
    try {
      await Clipboard.setStringAsync(scriptText);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // safe fallback
    }
  };

  const handleGenerateProtocol = () => {
    if (!dilemmaInput.trim() || isSynthesizing) return;

    if (!isPro && freeAdvisorUsesLeft <= 0) {
      router.push('/paywall');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }

    setIsSynthesizing(true);
    setProtocolResult(null);

    setTimeout(() => {
      useAdvisorCredit();

      const text = dilemmaInput.toLowerCase();
      let result: ProtocolResult;

      if (text.includes('credit') || text.includes('coworker')) {
        result = {
          frameControl:
            'Neutralize emotional indignation in public. Let the counterpart fully commit to their claim in front of stakeholders, then calmly request granular architectural metrics they cannot answer.',
          script:
            '"I am glad Marcus is aligned with Phase 1. Marcus, walk the committee through the Q3 liquidity stress tests I modeled in Appendix C—how do you propose we absorb that variance?"',
          linkedRuleId: '19',
          linkedRuleNumber: '19',
          linkedRuleTitle: 'The Architectural Anchor',
        };
      } else if (text.includes('discount') || text.includes('client') || text.includes('30%')) {
        result = {
          frameControl:
            'Deploy 4 seconds of unbroken silence. Never meet a percentage demand with an emotional counter-offer. Demand asymmetric reciprocity: reduce scope or increase contractual commitment.',
          script:
            '"We can certainly explore matching that budget figure. Which core deliverables from Phase 2 and Phase 4 shall we eliminate from the contract SLA to reflect that reduction?"',
          linkedRuleId: '08',
          linkedRuleNumber: '08',
          linkedRuleTitle: 'Never Reveal Your Full Hand',
        };
      } else if (text.includes('boss') || text.includes('weekend') || text.includes('urgent')) {
        result = {
          frameControl:
            'Never reply impulsively or with irritation. Establish velvet procedural friction by scheduling replies for the start of the next operational cycle, letting process absorb the conflict.',
          script:
            '"Received. I am currently offline until Monday 08:00. I have queued this as Priority 1 on our sprint backlog to address first thing upon logging in."',
          linkedRuleId: '24',
          linkedRuleNumber: '24',
          linkedRuleTitle: 'Erect Friction Without Resistance',
        };
      } else {
        result = {
          frameControl:
            'Impose an involuntary 3-second vacuum before responding. Urgency is fabricated theatre. Re-frame the interaction so the counterpart bears the cognitive burden.',
          script:
            '"Help me understand the underlying constraint here: are we optimizing for speed of execution or downside protection on this initiative?"',
          linkedRuleId: '12',
          linkedRuleNumber: '12',
          linkedRuleTitle: 'The Power of the Calculated Pause',
        };
      }

      setProtocolResult(result);
      setIsSynthesizing(false);

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // safe fallback
      }
    }, 800);
  };

  return (
    <View style={styles.root}>
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top, 14),
          },
        ]}
      >
        <View style={styles.topBarLeft}>
          <Text style={styles.topBarTitle}>SOVEREIGN AI COUNSEL</Text>
          <View
            style={[
              styles.clearanceBadge,
              isPro ? styles.clearanceBadgePro : styles.clearanceBadgeFree,
            ]}
          >
            <AppIcon
              name={isPro ? 'verified' : 'bolt'}
              size={11}
              color={colors.primary}
            />
            <Text style={styles.clearanceText}>
              {isPro
                ? 'UNLIMITED CLEARANCE'
                : `${freeAdvisorUsesLeft} FREE DISPATCH LEFT`}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={8}
        >
          <AppIcon name="close" size={20} color={colors.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>LIVE DILEMMA OR CODEX QUERY</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={dilemmaInput}
              onChangeText={(text) => {
                setDilemmaInput(text);
                if (protocolResult) setProtocolResult(null);
              }}
              placeholder="Describe workplace conflict or search axioms..."
              placeholderTextColor="#696459"
              style={styles.textInput}
              multiline
            />
            {dilemmaInput.length > 0 && (
              <Pressable
                onPress={() => {
                  setDilemmaInput('');
                  setProtocolResult(null);
                }}
                hitSlop={8}
              >
                <AppIcon name="cancel" size={16} color={colors.outline} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Preset Dilemma Pills */}
        <View style={styles.presetsSection}>
          <Text style={styles.sectionSubtitle}>HIGH-STAKES DILEMMA PRESETS</Text>
          <View style={styles.presetsList}>
            {PRESET_DILEMMAS.map((preset) => {
              const isSelected = dilemmaInput === preset;
              return (
                <Pressable
                  key={preset}
                  onPress={() => handleSelectPreset(preset)}
                  style={[
                    styles.presetPill,
                    isSelected && styles.presetPillSelected,
                  ]}
                >
                  <AppIcon
                    name="lightbulb"
                    size={12}
                    color={isSelected ? colors.onPrimary : colors.primary}
                  />
                  <Text
                    style={[
                      styles.presetText,
                      isSelected && styles.presetTextSelected,
                    ]}
                  >
                    {preset}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Matching Codex Rules preview if user typed search query */}
        {matchingRules.length > 0 && !protocolResult && (
          <View style={styles.matchingRulesSection}>
            <Text style={styles.sectionSubtitle}>
              MATCHING CODEX AXIOMS ({matchingRules.length})
            </Text>
            {matchingRules.slice(0, 3).map((rule) => (
              <Pressable
                key={rule.id}
                onPress={() => router.push(`/(tabs)/codex/${rule.id}`)}
                style={styles.matchingRuleCard}
              >
                <View style={styles.ruleCardTop}>
                  <Text style={styles.ruleCode}>RULE #{rule.number}</Text>
                  <Text style={styles.ruleCategory}>{rule.category}</Text>
                </View>
                <Text style={styles.matchingRuleTitle}>{rule.title}</Text>
                <Text style={styles.matchingRuleSummary} numberOfLines={2}>
                  {rule.summary}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Generate Button */}
        <Pressable
          onPress={handleGenerateProtocol}
          disabled={!dilemmaInput.trim() || isSynthesizing}
          style={[
            styles.generateBtn,
            (!dilemmaInput.trim() || isSynthesizing) && styles.generateBtnDisabled,
          ]}
        >
          {isSynthesizing ? (
            <View style={styles.btnRow}>
              <ActivityIndicator size="small" color={colors.onPrimary} />
              <Text style={styles.generateBtnText}>SYNTHESIZING PROTOCOL...</Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <AppIcon name="bolt" size={16} color={colors.onPrimary} />
              <Text style={styles.generateBtnText}>Generate Tactical Protocol</Text>
            </View>
          )}
        </Pressable>

        {/* Structured 3-Part Tactical Response Card */}
        {protocolResult && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultHeaderBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.resultHeaderBadgeText}>
                  TACTICAL PROTOCOL SYNTHESIZED
                </Text>
              </View>
              <AppIcon name="shield" size={16} color={colors.primary} />
            </View>

            {/* Part 1: Immediate Frame Control */}
            <View style={styles.partBlock}>
              <View style={styles.partHeaderRow}>
                <Text style={styles.partNumber}>01</Text>
                <Text style={styles.partTitle}>IMMEDIATE FRAME CONTROL</Text>
              </View>
              <Text style={styles.partBody}>
                {protocolResult.frameControl}
              </Text>
            </View>

            {/* Part 2: Verbal Script to Deploy */}
            <View style={styles.partBlock}>
              <View style={styles.partHeaderRow}>
                <Text style={styles.partNumber}>02</Text>
                <Text style={styles.partTitle}>VERBAL SCRIPT TO DEPLOY</Text>
              </View>
              <View style={styles.scriptBox}>
                <Text style={styles.scriptText}>{protocolResult.script}</Text>
                <Pressable
                  onPress={() => handleCopyScript(protocolResult.script)}
                  style={styles.copyBtn}
                >
                  <AppIcon
                    name={copied ? 'check' : 'copy'}
                    size={14}
                    color={copied ? colors.primary : colors.onSurfaceVariant}
                  />
                  <Text style={styles.copyBtnText}>
                    {copied ? 'COPIED TO CLIPBOARD' : 'COPY SCRIPT'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Part 3: Linked Black Rule Axiom */}
            <View style={styles.partBlock}>
              <View style={styles.partHeaderRow}>
                <Text style={styles.partNumber}>03</Text>
                <Text style={styles.partTitle}>LINKED BLACK RULE AXIOM</Text>
              </View>
              <Pressable
                onPress={() => router.push(`/(tabs)/codex/${protocolResult.linkedRuleId}`)}
                style={styles.linkedRuleBtn}
              >
                <View>
                  <Text style={styles.linkedRuleNumber}>
                    BLACK RULE #{protocolResult.linkedRuleNumber}
                  </Text>
                  <Text style={styles.linkedRuleTitle}>
                    {protocolResult.linkedRuleTitle}
                  </Text>
                </View>
                <AppIcon name="arrow_forward" size={16} color={colors.primary} />
              </Pressable>
            </View>
          </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: 'rgba(19, 19, 21, 0.95)',
  },
  topBarLeft: {
    gap: 4,
  },
  topBarTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.onSurface,
  },
  clearanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  clearanceBadgePro: {
    backgroundColor: 'rgba(242, 202, 80, 0.15)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  clearanceBadgeFree: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  clearanceText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  inputCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  inputLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 19,
    minHeight: 48,
  },
  presetsSection: {
    gap: 10,
  },
  sectionSubtitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    letterSpacing: 1.2,
  },
  presetsList: {
    gap: 8,
  },
  presetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  presetPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurface,
  },
  presetTextSelected: {
    color: colors.onPrimary,
    fontFamily: fonts.bodySemiBold,
  },
  matchingRulesSection: {
    gap: 10,
  },
  matchingRuleCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  ruleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleCode: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
  },
  ruleCategory: {
    fontFamily: fonts.label,
    fontSize: 8,
    color: colors.outline,
  },
  matchingRuleTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 14,
    color: colors.onSurface,
  },
  matchingRuleSummary: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
  },
  generateBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  generateBtnDisabled: {
    opacity: 0.5,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  generateBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.onPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  resultCard: {
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.4)',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    marginTop: 6,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  resultHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  resultHeaderBadgeText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1,
  },
  partBlock: {
    gap: 8,
  },
  partHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  partNumber: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 10,
    color: colors.primary,
  },
  partTitle: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    letterSpacing: 1,
  },
  partBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurface,
    lineHeight: 18,
  },
  scriptBox: {
    backgroundColor: colors.surfaceContainerLowest,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  scriptText: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 20,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  copyBtnText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  linkedRuleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: 12,
  },
  linkedRuleNumber: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  linkedRuleTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 14,
    color: colors.onSurface,
    marginTop: 2,
  },
});
