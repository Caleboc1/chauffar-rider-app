import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";

type EmergencyContactSuccessParams = {
  fullName?: string;
  relationship?: string;
};

export default function EmergencyContactSuccessScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<EmergencyContactSuccessParams>();
  const fullName = params.fullName?.trim() || "Contact";
  const relationship = params.relationship?.trim() || "Emergency Contact";

  function handleDone() {
    router.replace("/(driver)/settings-emergency-contacts");
  }

  return (
    <View className="flex-1 bg-[#0F0F0F] px-5">
      <StatusBar style="light" />

      <View style={{ paddingTop: insets.top + 14 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleDone}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 pt-14">
        <View className="items-center">
          <View className="h-28 w-28 items-center justify-center rounded-full bg-[#16F58D]/20">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#16F58D]">
              <Ionicons name="checkmark" size={42} color="#07110C" />
            </View>
          </View>

          <Text className="mt-10 text-center text-[28px] font-semibold leading-[40px] text-white">
            {fullName} added as an{"\n"}Emergency Contact
          </Text>
          <Text className="mt-4 max-w-[320px] text-center text-[16px] leading-[28px] text-[#8D8D8D]">
            Your emergency contact has been successfully saved to your professional profile.
          </Text>
        </View>

        <View className="mt-12 rounded-[18px] bg-[#1E1E1E] px-4 py-4">
          <View className="flex-row items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[#1E4E2E]">
              <Ionicons name="person" size={22} color="#16F58D" />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-[16px] font-semibold text-white">{fullName}</Text>
              <Text className="mt-1 text-[14px] text-[#8D8D8D]">{relationship}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingBottom: insets.bottom + 16 }}>
        <AuthPrimaryButton label="Done" onPress={handleDone} />
      </View>
    </View>
  );
}
