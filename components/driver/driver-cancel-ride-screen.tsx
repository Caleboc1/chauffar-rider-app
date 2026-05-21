import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useDriverMockState } from "@/components/driver/driver-mock-state";

const REASONS = [
  "Rider did not show up",
  "Rider requested cancellation",
  "Unable to reach rider",
  "Incorrect pickup location",
  "Vehicle issue",
  "Personal emergency",
  "Rider behavior made me uncomfortable",
  "Other",
] as const;

type DriverCancelRideScreenProps = {
  from: "pickup" | "destination";
};

export function DriverCancelRideScreen({ from }: DriverCancelRideScreenProps) {
  const insets = useSafeAreaInsets();
  const { cancelActiveRide } = useDriverMockState();
  const [selectedReason, setSelectedReason] = useState<(typeof REASONS)[number]>("Rider did not show up");
  const [issueNote, setIssueNote] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");

  const backRoute = useMemo(() => (from === "destination" ? "/(driver)/destination" : "/(driver)/pickup"), [from]);
  const showIssueField = selectedReason === "Other";

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]" edges={["top", "bottom"]}>
      <View className="flex-1 px-5 pt-2">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => router.replace(backRoute)}
            className="h-12 w-12 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-[18px] font-semibold text-white">Cancel Ride</Text>
          <View className="w-12" />
        </View>

        <ScrollView
          className="mt-8 flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Text className="text-[18px] font-semibold text-white">Select a reason for cancelling</Text>
          <Text className="mt-3 text-[16px] leading-7 text-[#B8B8B8]">
            Please let us know why you are cancelling this ride.
          </Text>

          <View className="mt-8 gap-y-4">
            {REASONS.map((reason) => {
              const active = reason === selectedReason;
              return (
                <TouchableOpacity
                  key={reason}
                  activeOpacity={0.86}
                  onPress={() => setSelectedReason(reason)}
                  className={`flex-row items-center justify-between rounded-[16px] bg-[#1C1C1C] px-4 py-6 ${
                    active ? "border border-[#0DFF91]" : "border border-transparent"
                  }`}
                >
                  <Text className="flex-1 pr-4 text-[16px] text-white">{reason}</Text>
                  <View
                    className={`h-6 w-6 rounded-full border ${
                      active ? "border-[#0DFF91]" : "border-[#474747]"
                    } items-center justify-center`}
                  >
                    {active ? <View className="h-4 w-4 rounded-full bg-[#0DFF91]" /> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {showIssueField ? (
            <View className="mt-6">
              <Text className="text-[16px] font-medium text-white">Describe the issue</Text>
              <TextInput
                value={issueNote}
                onChangeText={setIssueNote}
                multiline
                textAlignVertical="top"
                placeholder="Please provide details about what happened"
                placeholderTextColor="#6F6F6F"
                className="mt-4 rounded-[14px] border border-[#343434] bg-transparent px-4 py-5 text-[14px] text-white"
                style={{ minHeight: 140 }}
              />
            </View>
          ) : null}

          <View className="mt-6">
            <Text className="text-[16px] font-medium text-white">Add a note</Text>
            <TextInput
              value={additionalNote}
              onChangeText={setAdditionalNote}
              multiline
              textAlignVertical="top"
              placeholder="Any additional details that might help us resolve this"
              placeholderTextColor="#6F6F6F"
              className="mt-4 rounded-[14px] border border-[#343434] bg-transparent px-4 py-5 text-[14px] text-white"
              style={{ minHeight: 140 }}
            />
          </View>
        </ScrollView>

        <View className="pt-4" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={cancelActiveRide}
            className="h-14 items-center justify-center rounded-full bg-[#0DFF85]"
          >
            <Text className="text-[18px] font-semibold text-[#050505]">Confirm Cancelation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => router.replace(backRoute)}
            className="mt-4 h-14 items-center justify-center rounded-full bg-[#393939]"
          >
            <Text className="text-[18px] font-medium text-white">Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
