import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Eye, EyeOff } from 'lucide-react-native';
import { BMonogram } from '../../components/ui/BMonogram';
import { LoadingDots } from '../../components/ui/LoadingOverlay';
import { colors, fonts } from '../../theme/tokens';
import { useUserStore } from '../../store/useUserStore';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { loginOperative, hasCompletedDiagnostic } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSignIn = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // safe fallback
    }
    setIsLoading(true);
    setTimeout(() => {
      loginOperative(email.trim() || 'user@blackrules.io');
      setIsLoading(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // safe fallback
      }
      if (hasCompletedDiagnostic) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/diagnostic' as any);
      }
    }, 700);
  };

  const handleContinueAsGuest = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback
    }
    setIsGuestLoading(true);
    setTimeout(() => {
      loginOperative('guest@blackrules.io', 'Guest Strategist');
      setIsGuestLoading(false);
      if (hasCompletedDiagnostic) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/diagnostic' as any);
      }
    }, 400);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + 24, 36),
            paddingBottom: Math.max(insets.bottom + 20, 28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Monogram & Header */}
        <View style={styles.header}>
          <BMonogram size={56} />
          <Text style={styles.title}>Welcome to Black Rules</Text>
          <Text style={styles.subtitle}>
            Sign in to save your daily streak, mastered rules, and character progress.
          </Text>
        </View>

        {/* Input Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#71717A"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#71717A"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
                style={styles.eyeBtn}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#71717A" />
                ) : (
                  <Eye size={18} color="#71717A" />
                )}
              </Pressable>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Primary Crisp White Sign In Button */}
          <Pressable
            onPress={handleSignIn}
            disabled={isLoading || isGuestLoading}
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          >
            {isLoading ? (
              <LoadingDots size={6} color="#09090B" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </Pressable>

          {/* Prominent Continue as Guest Button */}
          <Pressable
            onPress={handleContinueAsGuest}
            disabled={isLoading || isGuestLoading}
            style={styles.guestButton}
          >
            {isGuestLoading ? (
              <LoadingDots size={6} color="#FAFAFA" />
            ) : (
              <Text style={styles.guestButtonText}>Continue as Guest →</Text>
            )}
          </Pressable>
        </View>

        {/* Privacy Note */}
        <Text style={styles.footerNote}>
          Your progress is stored privately on your device.
        </Text>
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
    paddingHorizontal: 24,
    gap: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#FAFAFA',
    textAlign: 'center',
    marginTop: 6,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  form: {
    gap: 14,
    marginTop: 8,
  },
  inputContainer: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputFocused: {
    borderColor: '#FFFFFF',
    backgroundColor: '#18181B',
  },
  inputLabel: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#FAFAFA',
    paddingVertical: 4,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    padding: 4,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  primaryButtonText: {
    fontFamily: fonts.labelSemiBold,
    fontSize: 13,
    color: '#09090B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  guestButton: {
    height: 50,
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: '#FAFAFA',
    letterSpacing: 0.6,
  },
  footerNote: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 10,
  },
});
