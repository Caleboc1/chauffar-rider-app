import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthBackButton } from "@/components/auth/auth-back-button";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { AuthStatusRow } from "@/components/auth/auth-status-row";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function PasswordScreen() {
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const rules = useMemo(
    () => ({
      minLength: password.length >= 6,
      hasDigit: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }),
    [password]
  );

  const touchedPassword = password.length > 0;
  const touchedConfirm = confirmPassword.length > 0;
  const passwordsMatch = touchedConfirm && password === confirmPassword;
  const showMismatch = touchedConfirm && password !== confirmPassword;

  const canContinue =
    rules.minLength && rules.hasDigit && rules.hasSpecial && password.length > 0 && passwordsMatch;

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-5" style={{ paddingTop: insets.top + 12 }}>
          <AuthBackButton className="mb-6" />

          <View className="mb-11 items-center">
            <BrandLogo size="auth" />
          </View>

          <Text className="mb-3 text-[32px] font-bold leading-10 tracking-tight text-white">
            Choose a password to{"\n"}continue
          </Text>
          <Text className="mb-8 text-[14px] leading-7 text-[#B1B1B1]">
            Secure your driver account by creating a password.
          </Text>

          <View className="gap-y-5">
            <AuthPasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
            />

            <AuthPasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
            />
          </View>

          <View className="mt-5 min-h-[92px] gap-y-2.5">
            {showMismatch ? (
              <AuthStatusRow label="Doesn't match password above" tone="error" />
            ) : (
              <>
                <AuthStatusRow
                  label="Minimum 6 characters"
                  tone={rules.minLength ? "success" : "error"}
                  className={touchedPassword ? "mt-1.5 flex-row items-center gap-x-2" : "hidden"}
                />
                <AuthStatusRow
                  label="Has one digit"
                  tone={rules.hasDigit ? "success" : "error"}
                  className={touchedPassword ? "mt-1.5 flex-row items-center gap-x-2" : "hidden"}
                />
                <AuthStatusRow
                  label="Has one special Character"
                  tone={rules.hasSpecial ? "success" : "error"}
                  className={touchedPassword ? "mt-1.5 flex-row items-center gap-x-2" : "hidden"}
                />
              </>
            )}
          </View>
        </View>

        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <AuthPrimaryButton
            label="Continue"
            onPress={() => {}}
            disabled={!canContinue}
            className="h-14 w-full rounded-full items-center justify-center"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
