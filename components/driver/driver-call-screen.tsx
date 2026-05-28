import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import DriverAvatar from "@/assets/svgIcons/DriverAvatar";
import DriverCar from "@/assets/svgIcons/DriverCar";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export function DriverCallScreen() {
  const insets = useSafeAreaInsets();
  const { activeRide } = useDriverMockState();

  if (!activeRide) {
    return null;
  }

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />

      <View className="absolute inset-0">
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="callBackground" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#0A2117" />
              <Stop offset="34%" stopColor="#08160F" />
              <Stop offset="68%" stopColor="#060906" />
              <Stop offset="100%" stopColor="#050505" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="100" fill="url(#callBackground)" />
        </Svg>
      </View>

      <View className="flex-1 px-5" style={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 22 }}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} className="h-12 w-12 items-center justify-center rounded-full bg-[#1C2A23]">
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

       

        <View className="flex-1 items-center justify-center">
          <View className="overflow-hidden rounded-full">
            <DriverAvatar size={88} />
          </View>
          <Text className="mt-6 text-[26px] font-semibold text-white">{activeRide.riderName}</Text>
          <Text className="mt-3 text-[20px] text-white">2:45s</Text>
        </View>

        <View className="flex-row items-end justify-between px-4">
          <View className="items-center">
            <TouchableOpacity activeOpacity={0.85} className="h-20 w-20 items-center justify-center rounded-full bg-[#343434]">
              <Ionicons name="volume-high" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="mt-4 text-[16px] text-white">Speaker</Text>
          </View>

          <View className="items-center">
            <TouchableOpacity activeOpacity={0.85} className="h-20 w-20 items-center justify-center rounded-full bg-[#343434]">
              <Ionicons name="mic" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="mt-4 text-[16px] text-white">Mute</Text>
          </View>

          <View className="items-center">
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} className="h-20 w-20 items-center justify-center rounded-full bg-[#FB3E30]">
              <Ionicons name="call" size={28} color="#FFFFFF" style={{ transform: [{ rotate: "135deg" }] }} />
            </TouchableOpacity>
            <Text className="mt-4 text-[16px] text-white">End Call</Text>
          </View>
        </View>
      </View>
    </View>
  );
}