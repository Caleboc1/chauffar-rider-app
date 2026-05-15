import { useRef, useState, useCallback } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthBackButton } from "@/components/auth/auth-back-button";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { AuthPhoneInput } from "@/components/auth/auth-phone-input";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { AUTH_GREEN, COUNTRIES, type Country } from "@/features/auth/constants";
import { normalizePhoneNumber } from "@/features/auth/utils";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const phoneInputRef = useRef<TextInput>(null);

  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const canContinue = normalizePhoneNumber(phone).length >= 7 && password.length >= 6;

  const handlePhoneChange = useCallback((value: string) => setPhone(value), []);
  const handlePasswordChange = useCallback((value: string) => setPassword(value), []);
  const handleCountrySelect = useCallback((country: Country) => setSelectedCountry(country), []);
  const handlePhoneFocusChange = useCallback((focused: boolean) => setIsPhoneFocused(focused), []);
  const handleRememberMe = useCallback(() => setRememberMe((c) => !c), []);

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      <StatusBar style="light" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-5" style={{ paddingTop: insets.top + 12 }}>
          <AuthBackButton className="mb-6" onPress={() => router.replace("/(auth)/welcome")} />

          <View className="mb-11 items-center">
            <BrandLogo size="auth" />
          </View>

          <Text className="mb-2 text-[32px] font-bold leading-10 tracking-tight text-white">
            Welcome back
          </Text>
          <Text className="mb-8 text-[14px] leading-7 text-[#B1B1B1]">
            Log in to continue driving and earning.
          </Text>

          <View className="gap-y-5">
            <AuthPhoneInput
              label="Phone Number"
              value={phone}
              onChangeText={handlePhoneChange}
              selectedCountry={selectedCountry}
              onSelectCountry={handleCountrySelect}
              inputRef={phoneInputRef}
              isFocused={isPhoneFocused}
              onFocusChange={handlePhoneFocusChange}
              placeholder=""
              bottomInset={insets.bottom}
              borderColor={isPhoneFocused ? AUTH_GREEN : "#3A3A3A"}
              variant="split"
            />

            <AuthPasswordInput
              label="Password"
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Password"
            />
          </View>

          <View className="mt-6 flex-row items-center justify-between">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRememberMe}
              className="flex-row items-center"
            >
              <View className={`mr-3 h-5 w-5 border ${rememberMe ? "border-[#0DFF85] bg-[#0DFF85]" : "border-[#6B6B6B] bg-transparent"}`} />
              <Text className="text-[14px] text-[#D7D7D7]">Remember me</Text>
            </TouchableOpacity>

            <Text
              className="text-[14px]"
              style={{ color: AUTH_GREEN }}
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              Forgot Password?
            </Text>
          </View>
        </View>

        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <AuthPrimaryButton
            label="Login"
            onPress={() => router.replace("/(verification)/driver-info")}
            disabled={!canContinue}
            className="mb-6 h-14 w-full rounded-full items-center justify-center"
          />

          <Text
            className="text-center text-[13px] text-[#D7D7D7]"
            onPress={() => router.push("/(auth)/create-account")}
          >
            Don&apos;t have an account? <Text style={{ color: AUTH_GREEN }}>Sign up</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
