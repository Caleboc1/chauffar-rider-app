import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import TripSummaryDownloadIcon from "@/assets/svgIcons/TripSummaryDownloadIcon";
import TripSummaryGiveRatingIcon from "@/assets/svgIcons/TripSummaryGiveRatingIcon";
import {
  DriverDetailCard,
  DriverRoutePreviewCard,
  DriverTripPreviewMap,
  formatDriverPaymentAmount,
  getDriverPaymentMethodDetails,
} from "@/components/driver/driver-payment-flow";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export function DriverTripSummaryScreen() {
  const insets = useSafeAreaInsets();
  const { activeRide, completeActiveRide } = useDriverMockState();
  const params = useLocalSearchParams<{ paymentMethod?: string }>();

  if (!activeRide) {
    return null;
  }

  const paymentMethod = getDriverPaymentMethodDetails(params.paymentMethod);

  return (
    <View className="flex-1 bg-[#0C0C0C]">
      <SafeAreaView className="flex-1">
        <View
          className="border-b border-[#232323] px-5"
          style={{ paddingTop: 8, paddingBottom: 18 }}
        >
          <View className="relative items-center justify-center">
            <Text className="text-[18px] font-semibold text-white">Trip Summary</Text>
          </View>
        </View>

        <View className="flex-1 px-5 pt-6">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View className="mt-2 overflow-hidden rounded-[18px] border border-[#333333]" style={{ height: 184 }}>
              <DriverTripPreviewMap request={activeRide} />
            </View>

            <View className="mt-4">
              <DriverRoutePreviewCard request={activeRide} />
            </View>

            <View className="mt-4">
            <DriverDetailCard
              rows={[
                {
                  label: "Date and Time",
                  value: "Mon, 14th Nov, 2026",
                  secondary: "12:30pm",
                },
                {
                  label: "Vehicle",
                  value: "Toyota Camry",
                  secondary: "AS23XZ  •  Blue",
                },
                {
                  label: "Rider",
                  value: activeRide.riderName,
                },
                {
                  label: "Passenger",
                  value: "Kelivin Uche",
                },
                {
                  label: "Distance",
                  value: "1.5KM",
                },
                {
                  label: "Duration",
                  value: "00h 30m",
                },
                {
                  label: "Ride Category",
                  value: activeRide.rideType.replace(" ride", ""),
                },
                {
                  label: "Trip Fare",
                  value: formatDriverPaymentAmount(activeRide.fare),
                },
                {
                  label: "Payment Method",
                  value: paymentMethod.title,
                },
              ]}
            />
            </View>
          </ScrollView>

          <View className="flex-row pb-6 pt-4" style={{ paddingBottom: insets.bottom + 6 }}>
            <TouchableOpacity activeOpacity={0.84} className="mr-3 h-14 flex-1 flex-row items-center justify-center rounded-full bg-[#343434]">
              <Text className="text-[17px] font-medium text-white">Give rating</Text>
              <View className="ml-2.5">
                <TripSummaryGiveRatingIcon />
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.84} className="h-14 flex-1 flex-row items-center justify-center rounded-full bg-white">
              <Text className="text-[17px] font-medium text-[#121212]">Download</Text>
              <View className="ml-2.5">
                <TripSummaryDownloadIcon />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={completeActiveRide}
            className="h-14 items-center justify-center rounded-full bg-[#12FF98]"
            style={{ marginBottom: 8 }}
          >
            <Text className="text-[18px] font-medium text-[#040404]">Go back to home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
