import { useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthBackButton } from "@/components/auth/auth-back-button";
import { SmsIcon, WhatsappIcon } from "@/components/auth/auth-icons";
import { AuthPhoneInput } from "@/components/auth/auth-phone-input";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { AUTH_GREEN, COUNTRIES, type Country } from "@/features/auth/constants";
import { normalizePhoneNumber } from "@/features/auth/utils";

const DELIVERY_OPTIONS = [
  { key: "sms", label: "Send using SMS", icon: <SmsIcon /> },
  { key: "whatsapp", label: "Send using Whatsapp", icon: <WhatsappIcon /> },
] as const;

type DeliveryOption = (typeof DELIVERY_OPTIONS)[number]["key"];

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const phoneInputRef = useRef<TextInput>(null);

  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<DeliveryOption>("sms");

  const canContinue = normalizePhoneNumber(phone).length >= 7;

  const handleContinue = () => {
    if (!canContinue) return;
    Keyboard.dismiss();
    router.push({
      pathname: "/(auth)/otp",
      params: {
        phone,
        dialCode: selectedCountry.dial,
        method: selectedMethod,
        mode: "forgot-password",
      },
    });
  };

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      <StatusBar style="light" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-5" style={{ paddingTop: insets.top + 12 }}>
          <AuthBackButton className="mb-6" onPress={() => router.back()} />

          <View className="mb-11 items-center">
            <BrandLogo size="auth" />
          </View>

          <Text className="mb-2 text-[32px] font-bold leading-10 tracking-tight text-white">
            Reset your password
          </Text>
          <Text className="mb-8 text-[14px] leading-7 text-[#B1B1B1]">
            Enter your phone number to receive a verification code.
          </Text>

          <AuthPhoneInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            inputRef={phoneInputRef}
            isFocused={isPhoneFocused}
            onFocusChange={setIsPhoneFocused}
            placeholder=""
            bottomInset={insets.bottom}
            borderColor={isPhoneFocused ? AUTH_GREEN : "#3A3A3A"}
            variant="split"
          />

          <Text className="mb-4 mt-8 text-[15px] text-[#D6D6D6]">
            Choose how to receive your code
          </Text>

          <View className="mb-4 gap-y-5">
            {DELIVERY_OPTIONS.map((option) => {
              const active = selectedMethod === option.key;

              return (
                <TouchableOpacity
                  key={option.key}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMethod(option.key)}
                  className="flex-row items-center"
                >
                  <View className="mr-4">{option.icon}</View>
                  <Text className="flex-1 text-[17px] font-medium text-white">{option.label}</Text>
                  <View className={`h-7 w-7 items-center justify-center rounded-full border ${active ? "border-[#0DFF85]" : "border-[#7A7A7A]"}`}>
                    {active ? <View className="h-5 w-5 rounded-full bg-[#0DFF85]" /> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="mb-10 text-[13px] leading-6 text-[#A0A0A0]">
            Chauffeur will never send you promotional or spam messages{"\n"}
            Your number is only used for login
          </Text>
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
