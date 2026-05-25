import { Image } from "expo-image";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useDriverMockState } from "@/components/driver/driver-mock-state";

export function DriverNotificationsPermissionScreen() {
  const insets = useSafeAreaInsets();
  const { enableNotifications, dismissNotificationsPrompt } = useDriverMockState();

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      <SafeAreaView className="flex-1">
        <View
          className="flex-1 items-center px-5"
          style={{
            paddingTop: Math.max(insets.top + 24, 38),
            paddingBottom: Math.max(insets.bottom + 20, 28),
          }}
        >
          <Image
            source={require("@/assets/images/notifications.png")}
            style={{ width: 323, height: 323 }}
            contentFit="contain"
          />

          <Text className="mt-10 text-center text-[27px] font-semibold text-white">
            Stay in the loop!
          </Text>
          <Text className="mt-5 max-w-[300px] text-center text-[16px] leading-8 text-[#D0D0D0]">
            Get real-time updates on your rides, trip confirmations, riders, and
            special offers.
          </Text>

          <View className="mt-auto w-full">
            <TouchableOpacity
              activeOpacity={0.86}
              onPress={() => {
                enableNotifications();
                router.replace("/(driver)/notifications" as never);
              }}
              className="h-14 items-center justify-center rounded-full bg-[#12FF98]"
            >
              <Text className="text-[18px] font-medium text-[#040404]">
                Turn on notification
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => {
                dismissNotificationsPrompt();
                router.replace("/(driver)/notifications" as never);
              }}
              className="mt-5 items-center py-2"
            >
              <Text className="text-[17px] text-white">Not now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
