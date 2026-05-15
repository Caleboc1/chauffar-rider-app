import { Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";

export default function PasswordSuccessScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#0D0D0D]" style={{ paddingBottom: insets.bottom }}>
      <StatusBar style="light" />

      <View className="flex-1 items-center justify-center px-8">
        <Image
          source={require("../../../assets/images/LockIcon.png")}
          style={{ width: 220, height: 220 }}
          resizeMode="contain"
        />

        <Text className="mt-10 text-center text-[24px] font-bold leading-8 text-white">
          Password changed{"\n"}successfully
        </Text>
        <Text className="mt-4 text-center text-[14px] leading-6 text-[#F3F3F3]">
          Password reset successfully. You can now log in.
        </Text>
      </View>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <AuthPrimaryButton
          label="Continue to login"
          onPress={() => router.replace("/(auth)/login")}
          className="h-14 w-full rounded-full items-center justify-center"
        />
      </View>
    </View>
  );
}
