import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import RatingStarFilledIcon from "@/assets/svgIcons/RatingStarFilledIcon";
import RatingStarOutlineIcon from "@/assets/svgIcons/RatingStarOutlineIcon";
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
  const [showRatingSheet, setShowRatingSheet] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

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
            <TouchableOpacity
              activeOpacity={0.84}
              onPress={() => setShowRatingSheet(true)}
              className="mr-3 h-14 flex-1 flex-row items-center justify-center rounded-full bg-[#343434]"
            >
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

      <Modal
        visible={showRatingSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRatingSheet(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={() => setShowRatingSheet(false)} />

          <View
            className="rounded-t-[28px] bg-[#090909] px-5 pt-3"
            style={{ paddingBottom: Math.max(insets.bottom + 24, 30) }}
          >
            <View className="mb-8 items-center">
              <View className="h-1 w-14 rounded-full bg-white" />
            </View>

            <View className="items-center">
              <View className="h-[82px] w-[82px] items-center justify-center rounded-full border border-[#DFDFDF] bg-white">
                <Ionicons name="thumbs-up" size={38} color="#AEB7C0" />
              </View>

              <Text className="mt-8 text-center text-[21px] font-semibold text-white">Share Your Ride Experience</Text>
              <Text className="mt-3 max-w-[290px] text-center text-[15px] leading-7 text-[#C3C3C3]">
                A quick rating helps us reward great riders and identify any issues
              </Text>

              <View className="mt-6 flex-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    activeOpacity={0.85}
                    onPress={() => setRating(star)}
                    className={star === 1 ? "" : "ml-3"}
                  >
                    {star <= rating ? <RatingStarFilledIcon /> : <RatingStarOutlineIcon />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              value={review}
              onChangeText={setReview}
              placeholder="Share your experience"
              placeholderTextColor="#7A7A7A"
              multiline
              textAlignVertical="top"
              className="mt-8 min-h-[184px] rounded-[16px] bg-[#171717] px-4 py-4 text-[16px] text-white"
            />

            <Text className="mt-3 text-[14px] text-[#8D8D8D]">Your review will be private and anonymous</Text>

            <TouchableOpacity
              activeOpacity={0.86}
              onPress={() => setShowRatingSheet(false)}
              className="mt-12 h-14 items-center justify-center rounded-full bg-[#12FF98]"
            >
              <Text className="text-[18px] font-medium text-[#040404]">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
