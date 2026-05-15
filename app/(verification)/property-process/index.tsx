import { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { PrimaryButton } from "@/components/ui/primary-button";

export default function PropertyProcessScreen() {
  const insets = useSafeAreaInsets();

  const mapOpacity = useSharedValue(0);
  const mapScale = useSharedValue(1.08);
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.7);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(20);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(16);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    const spring = Easing.out(Easing.back(1.3));

    mapOpacity.value = withTiming(1, { duration: 700, easing: ease });
    mapScale.value = withTiming(1, { duration: 900, easing: ease });

    iconOpacity.value = withDelay(350, withTiming(1, { duration: 500, easing: ease }));
    iconScale.value = withDelay(
      350,
      withSequence(
        withTiming(1.1, { duration: 400, easing: ease }),
        withTiming(1.0, { duration: 200, easing: spring })
      )
    );

    textOpacity.value = withDelay(550, withTiming(1, { duration: 500, easing: ease }));
    textY.value = withDelay(550, withTiming(0, { duration: 500, easing: ease }));

    btnOpacity.value = withDelay(700, withTiming(1, { duration: 400, easing: ease }));
    btnY.value = withDelay(700, withTiming(0, { duration: 400, easing: ease }));
  }, [btnOpacity, btnY, iconOpacity, iconScale, mapOpacity, mapScale, textOpacity, textY]);

  const mapStyle = useAnimatedStyle(() => ({
    opacity: mapOpacity.value,
    transform: [{ scale: mapScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnY.value }],
  }));

  const handleAllow = async () => {
    await Location.requestForegroundPermissionsAsync();
  };

  return (
    <View className="flex-1 bg-[#0F0F0F]" style={{ paddingBottom: insets.bottom }}>
      <StatusBar style="light" />

      <View className="flex-1 items-center justify-center">
        <Animated.View style={[mapStyle, { position: "absolute", width: "100%", height: "100%" }]}>
          <Image
            source={require("../../../assets/images/maps.png")}
            className="h-full w-full"
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View style={iconStyle}>
          <Image
            source={require("../../../assets/images/LocationIcon.png")}
            style={{ width: 160, height: 160 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View className="px-6 pb-2">
        <Animated.View style={textStyle} className="mb-10 items-center">
          <Text className="mb-3 text-center text-[32px] leading-9 tracking-tight text-white">
            We&apos;ll need your{"\n"}location permission
          </Text>
          <Text className="px-2 text-center text-[14px] leading-6 text-[#8A8A8A]">
            To book rides and track your driver in real{"\n"}
            time, Chauffar needs access to your location.
          </Text>
        </Animated.View>

        <Animated.View style={btnStyle} className="mb-4">
          <PrimaryButton label="Allow location access" onPress={handleAllow} />
        </Animated.View>

        <Animated.View style={btnStyle} className="mb-2 items-center">
          <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
            <Text className="text-[13px] text-[#555]">Maybe later</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
