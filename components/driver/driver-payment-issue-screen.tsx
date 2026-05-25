import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DRIVER_PAYMENT_ISSUE_OPTIONS,
  DriverDetailCard,
  DriverIssueOptionCard,
  DriverPassengerAvatar,
  DriverPaymentHeader,
  DriverUploadCard,
  DriverPaymentIssueId,
  formatDriverPaymentAmount,
  getDriverPaymentMethodDetails,
} from "@/components/driver/driver-payment-flow";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export function DriverPaymentIssueScreen() {
  const insets = useSafeAreaInsets();
  const { activeRide, completeActiveRide } = useDriverMockState();
  const params = useLocalSearchParams<{ paymentMethod?: string }>();
  const [selectedIssueId, setSelectedIssueId] = useState<DriverPaymentIssueId | null>(null);
  const [amountReceived, setAmountReceived] = useState("");
  const [customIssue, setCustomIssue] = useState("");
  const [note, setNote] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();

  if (!activeRide) {
    return null;
  }

  const selectedPaymentMethod = getDriverPaymentMethodDetails(params.paymentMethod);

  const handleAddProof = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const canSubmit =
    !!selectedIssueId &&
    (selectedIssueId !== "underpaid" || amountReceived.trim().length > 0) &&
    (selectedIssueId !== "other" || customIssue.trim().length > 0);

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 14,
            paddingTop: 8,
            paddingBottom: insets.bottom + 28,
          }}
        >
          <DriverPaymentHeader
            title="Report Payment Issue"
            subtitle="Tell us what happened so we can assist you with this ride."
            onBack={() => router.back()}
          />

          <View className="mt-8">
            <DriverDetailCard
              rows={[
                {
                  label: "Passenger",
                  value: activeRide.riderName,
                  leading: <DriverPassengerAvatar name={activeRide.riderName} />,
                },
                {
                  label: "Date and Time",
                  value: "Mon, 14th Nov, 2026",
                  secondary: "12:30pm",
                },
                {
                  label: "Trip Fare",
                  value: formatDriverPaymentAmount(activeRide.fare),
                },
                {
                  label: "Payment Method",
                  value: selectedPaymentMethod.title,
                },
              ]}
            />
          </View>

          <Text className="mt-8 text-[17px] font-semibold text-white">
            What happened with the payment? <Text className="text-[#FF3131]">*</Text>
          </Text>

          <View className="mt-4">
            {DRIVER_PAYMENT_ISSUE_OPTIONS.map((option) => (
              <View key={option.id}>
                <DriverIssueOptionCard
                  label={option.label}
                  selected={selectedIssueId === option.id}
                  onPress={() => setSelectedIssueId(option.id)}
                />

                {selectedIssueId === "underpaid" && option.id === "underpaid" ? (
                  <View className="mb-5 mt-[-4px]">
                    <Text className="mb-3 text-[15px] text-white">Amount received</Text>
                    <TextInput
                      value={amountReceived}
                      onChangeText={setAmountReceived}
                      placeholder="₦ 0.00"
                      placeholderTextColor="#929292"
                      keyboardType="numeric"
                      className="h-14 rounded-[12px] border border-[#343434] bg-[#171717] px-4 text-[16px] text-white"
                    />
                    <Text className="mt-2 text-[12px] text-[#7D7D7D]">Enter the exact amount the rider paid you</Text>
                  </View>
                ) : null}

                {selectedIssueId === "other" && option.id === "other" ? (
                  <View className="mb-5 mt-[-4px]">
                    <Text className="mb-3 text-[15px] text-white">Describe the issue</Text>
                    <TextInput
                      value={customIssue}
                      onChangeText={setCustomIssue}
                      placeholder="Please provide details about what happened"
                      placeholderTextColor="#7A7A7A"
                      multiline
                      textAlignVertical="top"
                      className="min-h-[142px] rounded-[12px] border border-[#343434] bg-[#111111] px-4 py-4 text-[15px] text-white"
                    />
                  </View>
                ) : null}
              </View>
            ))}
          </View>

          <Text className="mt-2 text-[17px] font-semibold text-white">
            Add proof <Text className="text-[#9A9A9A]">(Optional)</Text>
          </Text>
          <Text className="mt-6 text-[16px] text-white">Upload screenshot</Text>

          <View className="mt-4">
            <DriverUploadCard
              imageUri={imageUri}
              onAdd={handleAddProof}
              helperText="Useful for transfer receipts or conversation history."
            />
          </View>

          <Text className="mt-8 text-[17px] font-semibold text-white">Add a note</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Any additional details that might help us resolve this"
            placeholderTextColor="#787878"
            multiline
            textAlignVertical="top"
            className="mt-5 min-h-[142px] rounded-[12px] border border-[#343434] bg-[#111111] px-4 py-4 text-[15px] text-white"
          />

          <View className="mt-8 flex-row rounded-[14px] bg-[#150709] px-4 py-4">
            <Ionicons name="information-circle" size={18} color="#FF1C28" />
            <Text className="ml-4 flex-1 text-[13px] leading-5 text-[#FF232F]">
              Important: Submitting a false report is a violation of our community guidelines and may result in an
              account review or suspension.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            disabled={!canSubmit}
            onPress={completeActiveRide}
            className={`mt-12 h-14 items-center justify-center rounded-full ${canSubmit ? "bg-[#12FF98]" : "bg-[#6B6B6B]"}`}
          >
            <Text className={`text-[18px] font-medium ${canSubmit ? "text-[#040404]" : "text-[#A1A1A1]"}`}>
              Submit report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.82}
            onPress={completeActiveRide}
            className="mt-6 items-center py-2"
          >
            <Text className="text-[17px] text-white">Go back to home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
