import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandLogo } from "@/components/ui/brand-logo";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";

export default function WelcomeScreen() {
  const logoOpacity = useSharedValue(0);
  const logoY = useSharedValue(24);
  const ctaOpacity = useSharedValue(0);
  const ctaY = useSharedValue(28);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    logoOpacity.value = withTiming(1, { duration: 420, easing: ease });
    logoY.value = withTiming(0, { duration: 460, easing: ease });
    ctaOpacity.value = withDelay(140, withTiming(1, { duration: 420, easing: ease }));
    ctaY.value = withDelay(140, withTiming(0, { duration: 460, easing: ease }));
  }, [ctaOpacity, ctaY, logoOpacity, logoY]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoY.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaY.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0B]">
      <View className="flex-1 justify-between bg-[#0B0B0B] px-5 pb-7 pt-5">
        <Animated.View style={logoStyle}>
          <BrandLogo size="header" />
        </Animated.View>

        <Animated.View style={ctaStyle} className="gap-5">
          <AuthPrimaryButton
            label="Register"
            onPress={() => router.push("/(auth)/create-account")}
            className="h-14 w-full rounded-full items-center justify-center"
          />

          <TouchableOpacity
            activeOpacity={0.82}
            className="items-center"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-base leading-6 text-[#F5F5F5]">
              Already have an account? <Text className="text-[#0DFF85]">Login here</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
