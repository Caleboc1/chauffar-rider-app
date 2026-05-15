import { useEffect } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { BrandLogo } from "@/components/ui/brand-logo";

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.88);
  const translateY = useSharedValue(18);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    opacity.value = withTiming(1, { duration: 420, easing: ease });
    scale.value = withSequence(
      withTiming(1.04, { duration: 430, easing: ease }),
      withTiming(1, { duration: 180, easing: ease })
    );
    translateY.value = withDelay(80, withTiming(0, { duration: 460, easing: ease }));

    const timeout = setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 2200);

    return () => clearTimeout(timeout);
  }, [opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-[#0B0B0B]">
      <Animated.View style={animatedStyle}>
        <BrandLogo size="hero" />
      </Animated.View>
      <Text className="absolute opacity-0">Chauffar driver app splash screen</Text>
    </View>
  );
}
