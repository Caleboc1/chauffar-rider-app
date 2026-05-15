import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthBackButton } from "@/components/auth/auth-back-button";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { OTP_LENGTH } from "@/features/auth/constants";
import { maskPhoneNumber } from "@/features/auth/utils";

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone: string; dialCode: string; method: string; mode: string }>();
  const dialCode = params.dialCode ?? "+234";
  const phone = params.phone ?? "91 2434 8190";
  const mode = params.mode ?? "signup";
  const maskedPhone = maskPhoneNumber(phone);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    const focusTimeout = setTimeout(() => inputRefs.current[0]?.focus(), 300);
    return () => clearTimeout(focusTimeout);
  }, []);

  const canContinue = otp.join("").length === OTP_LENGTH;

  const handleChange = (value: string, index: number) => {
    const char = value.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = char;
    setOtp(nextOtp);

    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: { nativeEvent: { key: string } }, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    if (!canContinue) return;
    if (mode === "forgot-password") {
      router.push({
        pathname: "/(auth)/reset-password",
        params: { phone, dialCode },
      });
      return;
    }
    router.push("/(auth)/password");
  };

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      <StatusBar style="light" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-5" style={{ paddingTop: insets.top + 12 }}>
          <AuthBackButton className="mb-6" />

          <View className="mb-11 items-center">
            <BrandLogo size="auth" />
          </View>

          <Text className="mb-3 text-[32px] font-bold leading-10 tracking-tight text-white">
            {mode === "forgot-password"
              ? "Enter verification code"
              : "We’ve sent you a code—\nenter it below"}
          </Text>
          <Text className="mb-8 text-[14px] leading-7 text-[#B1B1B1]">
            {mode === "forgot-password" ? "Enter the code sent to " : "Enter the code sent to "}
            <Text className="text-white">
              {dialCode} {mode === "forgot-password" ? maskedPhone : phone}
            </Text>
            {mode === "forgot-password" ? "" : " to continue setting up your driver account."}
          </Text>

          <View className="mb-7 flex-row justify-between">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                keyboardType="number-pad"
                maxLength={1}
                caretHidden
                className="h-[48px] w-[48px] rounded-[4px] border border-[#494949] bg-transparent text-center text-[22px] font-semibold text-white"
              />
            ))}
          </View>

          <View className="flex-row items-center gap-x-1.5">
            <Text className="text-[13px] text-[#D7D7D7]">Haven’t received the code yet?</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text className="text-[13px] text-[#0DFF85]">Resend code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <AuthPrimaryButton
            label="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
            className="h-14 w-full rounded-full items-center justify-center"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
