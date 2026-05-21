import { Text, TouchableOpacity, View } from "react-native";

import DestinationLocationIcon from "@/assets/svgIcons/DestinationLocationIcon";
import PickupLocationIcon from "@/assets/svgIcons/PickupLocationIcon";
import type { DriverRideRequest } from "@/components/driver/driver-mock-state";

type DriverRideRequestCardProps = {
  request: DriverRideRequest;
  compact?: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

export function DriverRideRequestCard({
  request,
  compact = false,
  onAccept,
  onDecline,
}: DriverRideRequestCardProps) {
  return (
    <View className="rounded-[20px] bg-[#171515] px-4 py-4">
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-row">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#7A3B24]">
            <Text className="text-[20px]">👩🏽</Text>
          </View>
          <View>
            <View className="flex-row items-center">
              <Text className="text-[15px] font-semibold text-white">{request.riderName}</Text>
              {!compact ? <Text className="ml-2 text-[13px] text-[#F7B32B]">★ {request.rating}</Text> : null}
            </View>
            <View className="mt-1 flex-row items-center">
              <Text className="text-[12px] text-[#B3B3B3]">🚕 {request.rideType}</Text>
            </View>
          </View>
        </View>

        {!compact ? (
          <View className="items-end">
            <Text className="text-[12px] text-[#D8D8D8]">{request.scheduledLabel}</Text>
            <Text className="mt-1 text-[14px] font-semibold text-[#0DFF85]">{request.fare}</Text>
          </View>
        ) : null}
      </View>

      {compact ? (
        <Text className="mb-3 text-[14px]">
          <Text className="text-[#11E37C]">Accept within </Text>
          <Text className="text-[#F54848]">60secs</Text>
        </Text>
      ) : null}

      <View className="mb-3 border-t border-[#313131]" />

      <View className="mb-4">
        <View className="flex-row">
          <View className="mr-3 items-center">
            <PickupLocationIcon />
            <View className="my-1 h-7 border-l border-dashed border-[#6C6C6C]" />
            <DestinationLocationIcon />
          </View>
          <View className="flex-1">
            <Text className="mb-4 text-[14px] leading-5 text-[#EFEFEF]">{request.pickup}</Text>
            <Text className="text-[14px] leading-5 text-[#EFEFEF]">{request.destination}</Text>
          </View>
        </View>
      </View>

      <View className="border-t border-[#313131] pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity activeOpacity={0.84} onPress={onDecline} className="flex-1 items-center py-1">
            <Text className="text-[15px] font-semibold text-[#E10A17]">Decline</Text>
          </TouchableOpacity>
          <View className="mx-3 h-8 w-px bg-[#313131]" />
          <TouchableOpacity activeOpacity={0.84} onPress={onAccept} className="flex-1 items-center py-1">
            <Text className="text-[15px] font-semibold text-[#0DFF85]">Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
