import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DriverRideRequestCard } from "@/components/driver/driver-ride-request-card";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export default function RideRequestsRoute() {
  const {
    visibleRequests,
    acceptRequest,
    declineRequest,
    filter,
    filterMenuOpen,
    setFilter,
    setFilterMenuOpen,
  } = useDriverMockState();

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]">
      <View className="flex-row items-center justify-between px-5 pb-6 pt-2">
        <View className="flex-row items-center">
          <TouchableOpacity activeOpacity={0.82} onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-[18px] font-semibold text-white">Ride Requests</Text>
        </View>

        <TouchableOpacity activeOpacity={0.82} onPress={() => setFilterMenuOpen(!filterMenuOpen)}>
          <Ionicons name="filter" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="px-5">
        {filterMenuOpen ? (
          <View className="absolute right-5 top-[-12px] z-20 w-[182px] overflow-hidden rounded-[18px] bg-[#1D1A1A]">
            {(["All ride", "Regular ride", "Multi-stop ride"] as const).map((option) => (
              <TouchableOpacity
                key={option}
                activeOpacity={0.82}
                onPress={() => {
                  setFilter(option);
                  setFilterMenuOpen(false);
                }}
                className="border-b border-[#322F2F] px-4 py-4"
              >
                <Text className={`text-[16px] ${filter === option ? "text-white" : "text-[#E7E7E7]"}`}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <View className="gap-y-6">
          {visibleRequests.map((request) => (
            <DriverRideRequestCard
              key={request.id}
              request={request}
              compact
              onAccept={() => acceptRequest(request.id)}
              onDecline={() => declineRequest(request.id)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
