import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Eye, EyeOff, Fingerprint, ArrowRight } from 'lucide-react-native';
import { colors, fonts } from '../../theme/tokens';

const LOGO_URI =
  'https://lh3.googleusercontent.com/aida/AEtjO1VpScQ8WRCEqUh13NVskeMXCHPhejMae5qEgeSlZJL6dtqTMREW0FF78jRUK6sLlE3lDDAfbuB-Sza74J5XRH0uTQgMS5yz9Pdm0QGJ3-9DQDRhCH_Jc9J_mmJ8-N6x6-iQIYmHESgUkzfrJsN2NnlfUyzlaGskRTcRUxd-UNryPtB4DAR9QiHgtqn4VIHiFhDk8a4fj9-MsyLajODWrmB9t8dknmgAYkg4lxDQ1Kr73DsA7jzD2h4C3OQ';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleAuthenticate = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // safe fallback
      }
      router.replace('/(tabs)');
    }, 900);
  };

  const handleBiometricAuth = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // safe fallback
    }
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      {/* Watermark "00" */}
      <Text style={styles.watermark}>00</Text>

      {/* Top Ambient Gold Glow */}
      <View style={styles.ambientGlow} pointerEvents="none" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + 16, 28),
            paddingBottom: Math.max(insets.bottom + 20, 28),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Status Pill */}
        <View style={styles.statusPill}>
          <View style={styles.pulsingDot} />
          <Text style={styles.statusText}>ENCRYPTED DOSSIER // ACCESS GATEWAY</Text>
        </View>

        {/* Identity Crest & Header */}
        <View style={styles.crestContainer}>
          <View style={styles.crestBox}>
            <Image
              source={{ uri: LOGO_URI }}
              style={styles.crestLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Enter The Sovereign Vault</Text>
          <Text style={styles.subtitle}>
            Authenticate your clearance to synchronize your Codex axioms, Arena simulations, and behavioral radar.
          </Text>
        </View>

        {/* Clearance Mode Switcher */}
        <View style={styles.modeSwitcher}>
          <Pressable
            onPress={() => {
              try {
                Haptics.selectionAsync();
              } catch {
                // fallback
              }
              setMode('signin');
            }}
            style={[
              styles.modeTab,
              mode === 'signin' && styles.modeTabActive,
            ]}
          >
            <Text
              style={[
                styles.modeTabText,
                mode === 'signin' && styles.modeTabTextActive,
              ]}
            >
              Initiate Passkey
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              try {
                Haptics.selectionAsync();
              } catch {
                // fallback
              }
              setMode('register');
            }}
            style={[
              styles.modeTab,
              mode === 'register' && styles.modeTabActive,
            ]}
          >
            <Text
              style={[
                styles.modeTabText,
                mode === 'register' && styles.modeTabTextActive,
              ]}
            >
              Request Dossier
            </Text>
          </Pressable>
        </View>

        {/* Tactical Input Fields */}
        <View style={styles.formSection}>
          {/* Operative Designation */}
          <View
            style={[
              styles.inputCard,
              emailFocused && styles.inputCardFocused,
            ]}
          >
            <Text style={styles.inputLabel}>OPERATIVE DESIGNATION (EMAIL)</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="strategist@blackrules.io"
              placeholderTextColor="#696459"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.textInput}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          {/* Cipher Key */}
          <View
            style={[
              styles.inputCard,
              passwordFocused && styles.inputCardFocused,
            ]}
          >
            <Text style={styles.inputLabel}>CRYPTOGRAPHIC CIPHER</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                placeholderTextColor="#696459"
                secureTextEntry={!showPassword}
                style={[styles.textInput, { flex: 1 }]}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
                style={styles.eyeBtn}
              >
                {showPassword ? (
                  <EyeOff size={18} color={colors.outline} />
                ) : (
                  <Eye size={18} color={colors.outline} />
                )}
              </Pressable>
            </View>
          </View>
        </View>

        {/* Primary CTA & Biometric Row */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleAuthenticate}
            disabled={isVerifying}
            style={[
              styles.submitBtn,
              isVerifying && styles.submitBtnDisabled,
            ]}
          >
            {isVerifying ? (
              <View style={styles.verifyingRow}>
                <ActivityIndicator size="small" color={colors.onPrimary} />
                <Text style={styles.submitBtnText}>VERIFYING CLEARANCE...</Text>
              </View>
            ) : (
              <View style={styles.verifyingRow}>
                <Text style={styles.submitBtnText}>
                  {mode === 'signin' ? 'AUTHENTICATE CLEARANCE' : 'ESTABLISH DOSSIER'}
                </Text>
                <ArrowRight size={16} color={colors.onPrimary} />
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={handleBiometricAuth}
            style={styles.biometricBtn}
            accessibilityLabel="Biometric Authentication"
          >
            <Fingerprint size={26} color={colors.primary} />
          </Pressable>
        </View>

        {/* Discrete OAuth Divider */}
        <View style={styles.dividerSection}>
          <Text style={styles.dividerText}>// OR AUTHENTICATE VIA SOVEREIGN TOKEN //</Text>
          <View style={styles.oauthRow}>
            <Pressable
              onPress={handleAuthenticate}
              style={styles.oauthBtn}
            >
              <Text style={styles.oauthBtnText}>Apple ID</Text>
            </Pressable>
            <Pressable
              onPress={handleAuthenticate}
              style={styles.oauthBtn}
            >
              <Text style={styles.oauthBtnText}>Google Workspace</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Discrete Zero-Knowledge Telemetry • Session Encrypted
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  watermark: {
    position: 'absolute',
    top: 60,
    right: -20,
    fontSize: 180,
    fontFamily: fonts.display,
    color: colors.primary,
    opacity: 0.03,
    zIndex: 0,
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 180,
    backgroundColor: 'rgba(242, 202, 80, 0.07)',
    borderRadius: 9999,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    paddingHorizontal: 24,
    gap: 20,
  },
  statusPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  statusText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.2,
  },
  crestContainer: {
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  crestBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  crestLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.onSurface,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  modeTabText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.6,
  },
  modeTabTextActive: {
    color: colors.primary,
    fontFamily: fonts.labelSemiBold,
  },
  formSection: {
    gap: 14,
  },
  inputCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  inputCardFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainer,
  },
  inputLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  textInput: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurface,
    paddingVertical: 4,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    padding: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtn: {
    flex: 1,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  submitBtnDisabled: {
    opacity: 0.8,
  },
  verifyingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 12,
    color: colors.onPrimary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  biometricBtn: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerSection: {
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  dividerText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.outline,
    letterSpacing: 1,
  },
  oauthRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  oauthBtn: {
    flex: 1,
    height: 48,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.onSurface,
  },
  footerText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 8,
  },
});
