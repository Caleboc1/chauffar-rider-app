import { router } from "expo-router";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import ReportPaymentIssueIcon from "@/assets/svgIcons/ReportPaymentIssueIcon";
import {
  DRIVER_PAYMENT_METHODS,
  DriverPaymentHeader,
  DriverPaymentMethodCard,
  DriverRideFareCard,
  formatDriverPaymentAmount,
  getDriverPaymentMethodDetails,
} from "@/components/driver/driver-payment-flow";
import type { DriverRideRequest } from "@/components/driver/driver-mock-state";

type DriverConfirmPaymentScreenProps = {
  request: DriverRideRequest;
};

export function DriverConfirmPaymentScreen({
  request,
}: DriverConfirmPaymentScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const selectedMethod = getDriverPaymentMethodDetails(selectedMethodId ?? undefined);

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-5 pb-6 pt-3">
          <DriverPaymentHeader
            title="Confirm Payment"
            subtitle="Select how the rider paid and confirm receipt."
            onBack={() => router.back()}
            onInfoPress={() => setShowInfo((current) => !current)}
          />

          {showInfo ? (
            <View className="absolute right-5 top-[56px] z-20 max-w-[274px] rounded-[14px] bg-[#171717] px-4 py-4">
              <Text className="text-[14px] leading-7 text-[#D6D6D6]">
                Confirm only after you&apos;ve received the full fare from the rider. For transfers or wallet
                payments, verify the amount reflects before confirming. If payment has not been received, use Report
                Payment Issue instead.
              </Text>
            </View>
          ) : null}

          <View className="mt-8">
            <DriverRideFareCard amount={formatDriverPaymentAmount(request.fare)} duration="45min" />
          </View>

          <Text className="mt-8 text-[17px] font-semibold text-white">Choose how the rider paid you</Text>

          <View className="mt-5">
            {DRIVER_PAYMENT_METHODS.map((method) => (
              <DriverPaymentMethodCard
                key={method.id}
                methodId={method.id}
                selected={selectedMethodId === method.id}
                onPress={() => setSelectedMethodId(method.id)}
              />
            ))}
          </View>

          <View className="mt-auto">
            <TouchableOpacity
              activeOpacity={0.86}
              disabled={!selectedMethodId}
              onPress={() => setShowSuccessSheet(true)}
              className={`h-14 items-center justify-center rounded-full ${selectedMethodId ? "bg-[#12FF98]" : "bg-[#6B6B6B]"}`}
            >
              <Text className={`text-[18px] font-medium ${selectedMethodId ? "text-[#040404]" : "text-[#A1A1A1]"}`}>
                Confirm Payment Received
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() =>
                router.push({
                  pathname: "/(driver)/payment-issue" as never,
                  params: {
                    paymentMethod: selectedMethodId ?? "wallet",
                  },
                })
              }
              className="mt-6 items-center justify-center py-2"
            >
              <View className="flex-row items-center">
                <ReportPaymentIssueIcon />
                <Text className="ml-3 text-[16px] text-[#8E8E8E]">Report Payment Issue</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <Modal
        visible={showSuccessSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessSheet(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={() => setShowSuccessSheet(false)} />

          <View
            className="rounded-t-[28px] bg-[#090909] px-6 pt-4"
            style={{ paddingBottom: Math.max(insets.bottom + 22, 30) }}
          >
            <View className="mb-16 items-center">
              <View className="h-1 w-14 rounded-full bg-white" />
            </View>

            <Text className="text-center text-[20px] font-semibold text-white">Payment Confirmed</Text>
            <Text className="mt-3 text-center text-[16px] text-[#C1C1C1]">
              {formatDriverPaymentAmount(request.fare)} received via {selectedMethod.title}
            </Text>

            <TouchableOpacity
              activeOpacity={0.86}
              onPress={() => {
                setShowSuccessSheet(false);
                router.replace({
                  pathname: "/(driver)/trip-summary" as never,
                  params: {
                    paymentMethod: selectedMethod.id,
                  },
                });
              }}
              className="mt-10 h-14 items-center justify-center rounded-full bg-[#12FF98]"
            >
              <Text className="text-[18px] font-medium text-[#040404]">View Ride Summary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
