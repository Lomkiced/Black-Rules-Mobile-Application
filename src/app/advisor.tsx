import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { AppIcon } from '../components/ui/AppIcon';
import { LoadingDots } from '../components/ui/LoadingOverlay';
import { fonts } from '../theme/tokens';
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
            'Neutralize emotional anger in public. Let the counterpart fully commit to their claim in front of stakeholders, then calmly request granular operational metrics they cannot answer.',
          script:
            '"I am glad Marcus is aligned with the model I developed. Marcus, walk the committee through the Q3 liquidity stress tests I modeled in Appendix C—how do you propose we absorb that variance?"',
          linkedRuleId: '07',
          linkedRuleNumber: '07',
          linkedRuleTitle: 'Protect Your Reputation',
        };
      } else if (text.includes('discount') || text.includes('client') || text.includes('30%') || text.includes('salary')) {
        result = {
          frameControl:
            'Deploy 4 seconds of unbroken silence. Never meet a percentage demand with an emotional counter-offer. Demand asymmetric reciprocity: reduce scope or increase contractual commitment.',
          script:
            '"We can certainly explore matching that budget figure. Which core deliverables from Phase 2 shall we eliminate from the contract SLA to reflect that reduction?"',
          linkedRuleId: '12',
          linkedRuleNumber: '12',
          linkedRuleTitle: 'Anchor High, Concede Slowly',
        };
      } else if (text.includes('boss') || text.includes('weekend') || text.includes('urgent') || text.includes('favor')) {
        result = {
          frameControl:
            'Never reply impulsively or with irritation. Say no without inventing fake excuses. Polite, firm boundaries train colleagues to respect your perimeter automatically.',
          script:
            '"I am not able to take that on this weekend. I will look at it first thing Monday morning when I am back online."',
          linkedRuleId: '03',
          linkedRuleNumber: '03',
          linkedRuleTitle: 'Say "No" Without Apologies',
        };
      } else {
        result = {
          frameControl:
            'Impose an involuntary 3-second vacuum before responding. Urgency is fabricated theatre. Re-frame the interaction so the counterpart bears the cognitive burden.',
          script:
            '"Help me understand the underlying constraint here: are we optimizing for speed of execution or downside risk protection on this initiative?"',
          linkedRuleId: '01',
          linkedRuleNumber: '01',
          linkedRuleTitle: 'Pause Before You Speak',
        };
      }

      setProtocolResult(result);
      setIsSynthesizing(false);

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // safe fallback
      }
    }, 600);
  };

  return (
    <View style={styles.root}>
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top + 8, 20),
          },
        ]}
      >
        <View style={styles.topBarLeft}>
          <Text style={styles.topBarCode}>AI COACH // TACTICAL ADVICE</Text>
          <Text style={styles.topBarTitle}>Situation Coach</Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={10}
        >
          <AppIcon name="close" size={18} color="#FAFAFA" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Credits Pill */}
        <View style={styles.creditsRow}>
          <Text style={styles.creditsText}>
            {isPro
              ? 'SOVEREIGN PRO // UNLIMITED QUERIES'
              : `${freeAdvisorUsesLeft} FREE QUERY REMAINING`}
          </Text>
        </View>

        {/* Input Box */}
        <View style={styles.inputCard}>
          <Text style={styles.inputCardLabel}>DESCRIBE YOUR DILEMMA</Text>
          <TextInput
            value={dilemmaInput}
            onChangeText={(t) => {
              setDilemmaInput(t);
              setProtocolResult(null);
            }}
            placeholder="e.g. My boss asks for weekend work at 5 PM on Friday..."
            placeholderTextColor="#71717A"
            multiline
            numberOfLines={4}
            style={styles.dilemmaTextInput}
          />
        </View>

        {/* Preset Chips */}
        <View style={styles.presetsSection}>
          <Text style={styles.presetsLabel}>OR SELECT COMMON SCENARIO</Text>
          <View style={styles.presetChipsRow}>
            {PRESET_DILEMMAS.map((preset) => (
              <Pressable
                key={preset}
                onPress={() => handleSelectPreset(preset)}
                style={[
                  styles.presetChip,
                  dilemmaInput === preset && styles.presetChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    dilemmaInput === preset && styles.presetChipTextActive,
                  ]}
                >
                  {preset}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

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
            <LoadingDots size={6} color="#09090B" />
          ) : (
            <Text style={styles.generateBtnText}>Get Advice & Script →</Text>
          )}
        </Pressable>

        {/* Protocol Result Card */}
        {protocolResult && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultBadgeText}>RECOMMENDED RESPONSE SCRIPT</Text>
            </View>

            {/* Strategic Advice */}
            <View style={styles.partBlock}>
              <Text style={styles.partTitle}>PSYCHOLOGICAL APPROACH</Text>
              <Text style={styles.partBody}>{protocolResult.frameControl}</Text>
            </View>

            {/* Script */}
            <View style={styles.scriptBox}>
              <Text style={styles.scriptText}>{protocolResult.script}</Text>
              <Pressable
                onPress={() => handleCopyScript(protocolResult.script)}
                style={styles.copyBtn}
              >
                <AppIcon name="content_copy" size={12} color="#FAFAFA" />
                <Text style={styles.copyBtnText}>
                  {copied ? 'Copied to Clipboard!' : 'Copy Script'}
                </Text>
              </Pressable>
            </View>

            {/* Linked Rule Button */}
            <Pressable
              onPress={() => {
                router.back();
                setTimeout(() => {
                  router.push(`/(tabs)/codex/${protocolResult.linkedRuleId}`);
                }, 150);
              }}
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
              <AppIcon name="arrow_forward" size={14} color="#FAFAFA" />
            </Pressable>
          </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    backgroundColor: 'rgba(9, 9, 11, 0.95)',
  },
  topBarLeft: {
    gap: 2,
  },
  topBarCode: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  topBarTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: '#FAFAFA',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 16,
  },
  creditsRow: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  creditsText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
    letterSpacing: 0.8,
  },
  inputCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  inputCardLabel: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    letterSpacing: 1,
  },
  dilemmaTextInput: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#FAFAFA',
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  presetsSection: {
    gap: 8,
  },
  presetsLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1,
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  presetChipActive: {
    borderColor: '#FFFFFF',
    backgroundColor: '#18181B',
  },
  presetChipText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
  },
  presetChipTextActive: {
    color: '#FAFAFA',
  },
  generateBtn: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  generateBtnDisabled: {
    opacity: 0.4,
  },
  generateBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#09090B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  resultCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    marginTop: 8,
  },
  resultHeader: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  resultBadgeText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  partBlock: {
    gap: 6,
  },
  partTitle: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1,
  },
  partBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#D4D4D8',
    lineHeight: 19,
  },
  scriptBox: {
    backgroundColor: '#050507',
    borderLeftWidth: 3,
    borderLeftColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    padding: 12,
    gap: 10,
  },
  scriptText: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 13,
    color: '#FAFAFA',
    lineHeight: 20,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#18181B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  copyBtnText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#A1A1AA',
  },
  linkedRuleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    padding: 12,
  },
  linkedRuleNumber: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  linkedRuleTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 13,
    color: '#FAFAFA',
    marginTop: 2,
  },
});
