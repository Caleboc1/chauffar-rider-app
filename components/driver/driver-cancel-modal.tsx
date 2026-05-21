import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CancelRideIcon from "@/assets/svgIcons/CancelRideIcon";

type DriverCancelModalProps = {
  onKeepRide: () => void;
  onConfirmCancel: () => void;
};

export function DriverCancelModal({ onKeepRide, onConfirmCancel }: DriverCancelModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <View className="absolute inset-0 bg-black/55" />
      <View
        className="bg-[#111111] px-6 pt-4"
        style={{
          marginHorizontal: -20,
          paddingBottom: Math.max(insets.bottom + 18, 26),
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <View className="mb-4 items-center">
          <View className="h-1 w-12 rounded-full bg-white" />
        </View>
        <View className="items-center">
          <CancelRideIcon />
          <Text className="mt-6 text-center text-[24px] font-semibold leading-9 text-white">
            Are you sure you{"\n"}want to cancel this ride?
          </Text>
          <Text className="mt-4 text-center text-[16px] leading-7 text-[#B8B8B8]">
            You&apos;re about to cancel this trip. This may affect your cancellation rate.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={onKeepRide}
          className="mt-10 h-14 items-center justify-center rounded-full bg-[#0DFF85]"
        >
          <Text className="text-[18px] font-semibold text-[#050505]">Keep Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={onConfirmCancel}
          className="mt-4 h-14 items-center justify-center rounded-full bg-[#393939]"
        >
          <Text className="text-[18px] font-medium text-white">Yes, Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
