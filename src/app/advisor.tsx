import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { AppIcon } from '../components/ui/AppIcon';
import { LoadingDots } from '../components/ui/LoadingOverlay';
import { fonts } from '../theme/tokens';
import { useUserStore } from '../store/useUserStore';
import { analyzeDilemmaWithVectorRag, VectorRagResult } from '../lib/vectorAi';
import { addBreadcrumb } from '../lib/sentry';

const QUICK_CHIPS = [
  'Coworker stole my credit',
  'Low salary offer',
  'Someone disrespected me',
  'Friend keeps asking for favors',
];

export default function AdvisorModalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { isPro, freeAdvisorUsesLeft, useAdvisorCredit } = useUserStore();

  const [dilemmaInput, setDilemmaInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [protocolResult, setProtocolResult] = useState<VectorRagResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectChip = (chip: string) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    setDilemmaInput(chip);
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

  const handleAnalyzeSituation = async () => {
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
    addBreadcrumb('advisor', `User triggered AI RAG analysis: ${dilemmaInput}`);

    try {
      const result = await analyzeDilemmaWithVectorRag(dilemmaInput);
      useAdvisorCredit();
      setProtocolResult(result);

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // safe fallback
      }
    } catch {
      // safe fallback
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleRulePress = (ruleId: string) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // safe fallback
    }
    router.back();
    setTimeout(() => {
      router.push(`/(tabs)/codex/${ruleId}`);
    }, 150);
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
          <Text style={styles.topBarCode}>AI COACH // VECTOR RAG ENGINE</Text>
          <Text style={styles.topBarTitle}>Situation Advisor</Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={styles.closeBtn}
          hitSlop={10}
        >
          <AppIcon name="close" size={18} color="#FAFAFA" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* Usage Pill */}
        <View style={styles.usageRow}>
          <Text style={styles.usageText}>
            {isPro
              ? 'SOVEREIGN PRO // UNLIMITED SESSIONS'
              : `${freeAdvisorUsesLeft} FREE QUERY REMAINING`}
          </Text>
        </View>

        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputCardLabel}>DESCRIBE YOUR SITUATION</Text>
          <TextInput
            value={dilemmaInput}
            onChangeText={(t) => {
              setDilemmaInput(t);
              setProtocolResult(null);
            }}
            placeholder="Type any workplace or personal situation..."
            placeholderTextColor="#71717A"
            multiline
            numberOfLines={3}
            style={styles.textInput}
          />
        </View>

        {/* Quick-Select Chips */}
        <View style={styles.chipsSection}>
          <Text style={styles.chipsLabel}>QUICK SITUATIONS</Text>
          <View style={styles.chipsRow}>
            {QUICK_CHIPS.map((chip) => {
              const isActive = dilemmaInput === chip;
              return (
                <Pressable
                  key={chip}
                  onPress={() => handleSelectChip(chip)}
                  style={[
                    styles.chip,
                    isActive && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isActive && styles.chipTextActive,
                    ]}
                  >
                    {chip}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Analyze Button */}
        <Pressable
          onPress={handleAnalyzeSituation}
          disabled={!dilemmaInput.trim() || isSynthesizing}
          style={[
            styles.analyzeBtn,
            (!dilemmaInput.trim() || isSynthesizing) && styles.analyzeBtnDisabled,
          ]}
        >
          {isSynthesizing ? (
            <LoadingDots size={6} color="#09090B" />
          ) : (
            <Text style={styles.analyzeBtnText}>Analyze Situation →</Text>
          )}
        </Pressable>

        {/* Custom AI Breakdown */}
        {protocolResult && (
          <View style={styles.breakdownContainer}>
            {/* 1. What Is Really Happening */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>WHAT IS REALLY HAPPENING</Text>
              <Text style={styles.bodyText}>{protocolResult.summary}</Text>
            </View>

            {/* 2. Exact Words to Say */}
            <View style={styles.scriptCard}>
              <View style={styles.scriptHeader}>
                <Text style={styles.scriptHeaderLabel}>EXACT WORDS TO SAY</Text>
                <Pressable
                  onPress={() => handleCopyScript(protocolResult.scriptToSay)}
                  style={styles.copyBtn}
                >
                  <AppIcon name="content_copy" size={12} color="#FAFAFA" />
                  <Text style={styles.copyBtnText}>
                    {copied ? 'Copied!' : 'Copy Script'}
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.scriptText}>{protocolResult.scriptToSay}</Text>
            </View>

            {/* 3. 3 Action Steps */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>3 ACTION STEPS</Text>
              <View style={styles.stepsList}>
                {protocolResult.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>0{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 4. Matched Black Rules */}
            <View style={styles.rulesSection}>
              <Text style={styles.cardHeader}>MATCHED BLACK RULES</Text>
              <View style={styles.matchedRulesList}>
                {protocolResult.matchedRules.map((rule) => (
                  <Pressable
                    key={rule.id}
                    onPress={() => handleRulePress(rule.id)}
                    style={styles.ruleCard}
                  >
                    <View style={styles.ruleLeft}>
                      <Text style={styles.ruleNumber}>RULE #{rule.number}</Text>
                      <Text style={styles.ruleTitle}>{rule.title}</Text>
                      <Text style={styles.ruleSummary} numberOfLines={2}>
                        {rule.summary}
                      </Text>
                    </View>
                    <AppIcon name="arrow_forward" size={14} color="#FFFFFF" />
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
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
    width: 32,
    height: 32,
    borderRadius: 16,
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
  usageRow: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  usageText: {
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
  textInput: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#FAFAFA',
    minHeight: 70,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  chipsSection: {
    gap: 8,
  },
  chipsLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipActive: {
    borderColor: '#FFFFFF',
    backgroundColor: '#18181B',
  },
  chipText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#A1A1AA',
  },
  chipTextActive: {
    color: '#FAFAFA',
  },
  analyzeBtn: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  analyzeBtnDisabled: {
    opacity: 0.4,
  },
  analyzeBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: '#09090B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  breakdownContainer: {
    gap: 14,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1.2,
  },
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#D4D4D8',
    lineHeight: 20,
  },
  scriptCard: {
    backgroundColor: '#050507',
    borderLeftWidth: 3,
    borderLeftColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  scriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scriptHeaderLabel: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  scriptText: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 14,
    color: '#FAFAFA',
    lineHeight: 22,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
    color: '#FAFAFA',
  },
  stepsList: {
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 9,
    color: '#A1A1AA',
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#FAFAFA',
    lineHeight: 19,
  },
  rulesSection: {
    gap: 10,
  },
  matchedRulesList: {
    gap: 10,
  },
  ruleCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ruleLeft: {
    flex: 1,
    gap: 3,
  },
  ruleNumber: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  ruleTitle: {
    fontFamily: fonts.headlineMedium,
    fontSize: 14,
    color: '#FAFAFA',
  },
  ruleSummary: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: '#71717A',
    lineHeight: 16,
  },
});
