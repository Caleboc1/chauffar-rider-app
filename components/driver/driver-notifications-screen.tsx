import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { DriverSideDrawer } from "@/components/driver/driver-side-drawer";

const NOTIFICATIONS = [
  {
    id: "ride-confirmed",
    title: "Ride Confirmed",
    message: "Your ride with John is confirmed. He’ll arrive in 5 minutes.",
    time: "2 min",
    unread: true,
  },
  {
    id: "special-offer",
    title: "Special Offer Alert",
    message: "Get 10% off your next trip, use code Chauffer20 at checkout",
    time: "2 min",
    unread: true,
  },
  {
    id: "service-update",
    title: "Service Update",
    message:
      "We’ve extended our service hours in your area. Book a ride anytime from 6 AM to midnight!",
    time: "2 min",
    unread: false,
  },
  {
    id: "withdrawal",
    title: "Withdrawal Successful🎉",
    message:
      "We’ve extended our service hours in your area. Book a ride anytime from 6 AM to midnight!",
    time: "2 min",
    unread: false,
  },
] as const;

export function DriverNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      <DriverSideDrawer visible={showDrawer} onClose={() => setShowDrawer(false)} />

      <SafeAreaView className="flex-1">
        <View
          className="border-b border-[#232323] px-5"
          style={{ paddingTop: 8, paddingBottom: 18 }}
        >
          <View className="relative items-center justify-center">
            <TouchableOpacity
              activeOpacity={0.84}
              onPress={() => setShowDrawer(true)}
              className="absolute left-0 h-12 w-12 items-center justify-center rounded-full bg-[#2B2B2B]"
            >
              <Ionicons name="menu" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <Text className="text-[18px] font-semibold text-white">Notifications</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          {NOTIFICATIONS.map((item, index) => (
            <View
              key={item.id}
              className={`px-6 py-6 ${index < 2 ? "bg-[#1C1C1C]" : "bg-transparent"}`}
            >
              <View className="flex-row items-start">
                <View className="mr-3 h-8 w-8 rounded-full bg-white" />

                <View className="flex-1 pr-3">
                  <Text className="text-[16px] font-semibold text-white">{item.title}</Text>
                  <Text className="mt-2 text-[15px] leading-7 text-[#D0D0D0]">
                    {item.message}
                  </Text>
                </View>

                <View className="flex-row items-center pt-0.5">
                  <Text className="text-[14px] text-[#9E9E9E]">{item.time}</Text>
                  {item.unread ? (
                    <View className="ml-2 h-2.5 w-2.5 rounded-full bg-[#FF4A4A]" />
                  ) : null}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
