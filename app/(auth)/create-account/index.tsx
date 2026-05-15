import { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

export default function CreateAccountScreen() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<DeliveryOption>("sms");

  const normalizedPhone = normalizePhoneNumber(phone);
  const isValid = normalizedPhone.length >= 10;

  const handleContinue = () => {
    if (!isValid) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/(auth)/otp",
      params: {
        phone,
        dialCode: selectedCountry.dial,
        method: selectedMethod,
      },
    });
  };

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-5" style={{ paddingTop: insets.top + 12 }}>
          <AuthBackButton
            className="mb-6"
            onPress={() => router.replace("/(auth)/welcome")}
          />

          <View className="mb-11 items-center">
            <BrandLogo size="auth" />
          </View>

          <Text className="mb-3 text-[32px] font-bold leading-10 tracking-tight text-white">
            Enter your mobile{"\n"}number.
          </Text>
          <Text className="mb-8 text-[14px] leading-7 text-[#B1B1B1]">
            Enter your phone number so we can send you a verification code to start your
            driving experience
          </Text>

          <AuthPhoneInput
            label=""
            value={phone}
            onChangeText={setPhone}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            inputRef={inputRef}
            isFocused={isFocused}
            onFocusChange={setIsFocused}
            placeholder=""
            bottomInset={insets.bottom}
            borderColor={isFocused ? AUTH_GREEN : "#3A3A3A"}
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
                  <View
                    className={`h-7 w-7 items-center justify-center rounded-full border ${
                      active ? "border-[#0DFF85]" : "border-[#7A7A7A]"
                    }`}
                  >
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
            disabled={!isValid}
            className="mb-5 h-14 w-full rounded-full items-center justify-center"
          />

          <Text className="mb-10 text-[13px] leading-6 text-[#D7D7D7]">
            By continuing you agree with to Chauffer{" "}
            <Text style={{ color: AUTH_GREEN }}>Terms of Use</Text> and{" "}
            <Text style={{ color: AUTH_GREEN }}>Privacy Policy</Text>
          </Text>

          <Text
            className="text-[13px] text-[#D7D7D7]"
            onPress={() => router.push("/(auth)/login")}
          >
            Already have an account? <Text style={{ color: AUTH_GREEN }}>Login</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
