import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { PanResponder, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import CashPaymentIcon from "@/assets/svgIcons/CashPaymentIcon";
import DirectionDestinationIcon from "@/assets/svgIcons/DirectionDestinationIcon";
import DirectionOriginIcon from "@/assets/svgIcons/DirectionOriginIcon";
import PickupTripConnector from "@/assets/svgIcons/PickupTripConnector";
import PickupTripDestinationIcon from "@/assets/svgIcons/PickupTripDestinationIcon";
import PickupTripOriginIcon from "@/assets/svgIcons/PickupTripOriginIcon";
import RideCompletedIcon from "@/assets/svgIcons/RideCompletedIcon";
import { DriverCancelModal } from "@/components/driver/driver-cancel-modal";
import type { DriverRideRequest } from "@/components/driver/driver-mock-state";
import { DriverDestinationMap } from "@/components/driver/driver-destination-map";
import { DriverSideDrawer } from "@/components/driver/driver-side-drawer";
import { useDriverNotificationsNavigation } from "@/components/driver/use-driver-notifications";

type DriverDestinationScreenProps = {
  request: DriverRideRequest;
};

const DIRECTIONS = [
  { icon: "arrow-up", title: "Head toward Ugwuoye road", subtitle: "Pass by the Havirl Internation School Enugu (on the right)" },
  { icon: "arrow-back", title: "Turn left onto head bridge", subtitle: "Pass by the Havirl Internation School Enugu (on the right)" },
  { icon: "return-down-forward", title: "Turn left onto head bridge", subtitle: "Pass by the Havirl Internation School Enugu (on the right)" },
  { icon: "arrow-back", title: "Turn left onto head bridge", subtitle: "Pass by the Havirl Internation School Enugu (on the right)" },
  { icon: "arrow-up", title: "Head toward Ugwuoye road", subtitle: "Pass by the Havirl Internation School Enugu (on the right)" },
];

export function DriverDestinationScreen({ request }: DriverDestinationScreenProps) {
  const insets = useSafeAreaInsets();
  const [showDrawer, setShowDrawer] = useState(false);
  const { openNotifications } = useDriverNotificationsNavigation();
  const [arrived, setArrived] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const collapsedHeight = 170;
  const expandedHeight = 640;
  const [sheetHeight, setSheetHeight] = useState(collapsedHeight);
  const sheetHeightRef = useRef(collapsedHeight);
  const dragStartRef = useRef(collapsedHeight);

  const updateSheetHeight = useCallback((value: number) => {
    sheetHeightRef.current = value;
    setSheetHeight(value);
  }, []);

  const snapSheet = useCallback(
    (expanded: boolean) => {
      setSheetExpanded(expanded);
      updateSheetHeight(expanded ? expandedHeight : collapsedHeight);
    },
    [collapsedHeight, expandedHeight, updateSheetHeight]
  );

  const handleArrival = useCallback(() => {
    setArrived(true);
    snapSheet(false);
  }, [snapSheet]);

  const handleProgressChange = useCallback(() => {}, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 3 && Math.abs(gesture.dx) < 12,
        onPanResponderGrant: () => {
          dragStartRef.current = sheetHeightRef.current;
        },
        onPanResponderMove: (_, gesture) => {
          const nextValue = Math.min(Math.max(dragStartRef.current - gesture.dy, collapsedHeight), expandedHeight);
          updateSheetHeight(nextValue);
        },
        onPanResponderRelease: (_, gesture) => {
          const finalValue = Math.min(Math.max(dragStartRef.current - gesture.dy, collapsedHeight), expandedHeight);
          snapSheet(finalValue > 330);
        },
      }),
    [collapsedHeight, expandedHeight, snapSheet, updateSheetHeight]
  );

  const currentDistanceText = arrived ? "0km" : "23min (34km)";

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      <DriverDestinationMap request={request} onArrival={handleArrival} onProgressChange={handleProgressChange} />
      <DriverSideDrawer visible={showDrawer} onClose={() => setShowDrawer(false)} />

      {showCompletedModal ? <View className="absolute inset-0 bg-black/55" /> : null}

      <SafeAreaView className="flex-1" edges={["top"]} pointerEvents="box-none">
        <View className="flex-1 px-5 pt-2" pointerEvents="box-none">
          <View className="flex-row items-center justify-between">
            <RoundIconButton icon="menu" onPress={() => setShowDrawer(true)} />
            <AvailabilityChip />
            <RoundIconButton icon="notifications" onPress={openNotifications} />
          </View>

          <View className="flex-1 justify-end" pointerEvents="box-none">
            <View className="mb-6 items-end">
              <RoundIconButton icon="locate" />
            </View>

            {showCancelModal ? (
              <DriverCancelModal
                onKeepRide={() => setShowCancelModal(false)}
                onConfirmCancel={() => {
                  setShowCancelModal(false);
                  setShowCompletedModal(false);
                  setSheetExpanded(false);
                  router.replace("/(driver)/cancel-ride?from=destination");
                }}
              />
            ) : showCompletedModal ? (
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
                  <RideCompletedIcon />
                  <Text className="mt-6 text-center text-[24px] font-semibold text-white">Ride Completed</Text>
                  <Text className="mt-4 text-center text-[16px] leading-7 text-[#B8B8B8]">
                    You&apos;ve successfully reached the destination. Confirm the rider&apos;s payment to finish this trip.
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.86}
                  onPress={() => {
                    setShowCompletedModal(false);
                    router.push("/(driver)/confirm-payment" as never);
                  }}
                  className="mt-10 h-14 items-center justify-center rounded-full bg-[#0DFF85]"
                >
                  <Text className="text-[18px] font-semibold text-[#050505]">Proceed to Confirm Payment</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                className="bg-[#111111]"
                style={{
                  marginHorizontal: -20,
                  height: sheetHeight + Math.max(insets.bottom + 16, 24),
                  borderTopLeftRadius: 28,
                  borderTopRightRadius: 28,
                  overflow: "hidden",
                }}
              >
                <View {...panResponder.panHandlers} className="px-5 pt-3">
                  <View className="mb-5 items-center">
                    <View className="h-1 w-12 rounded-full bg-white" />
                  </View>

                  <View className="mb-5 flex-row items-start justify-between">
                    <Text className="text-[18px] font-semibold text-white">
                      {arrived ? "Arrived at Destination" : "Heading to Destination"}
                    </Text>
                    <Text className={`text-[18px] font-semibold ${arrived ? "text-white" : "text-[#FFD154]"}`}>
                      {currentDistanceText}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.86}
                    disabled={!arrived}
                    onPress={() => {
                      if (arrived) setShowCompletedModal(true);
                    }}
                    className={`mb-5 h-14 items-center justify-center rounded-full ${arrived ? "bg-[#0DFF85]" : "bg-[#5A5A5A]"}`}
                  >
                    <Text className={`text-[18px] font-semibold ${arrived ? "text-[#050505]" : "text-[#333333]"}`}>End trip</Text>
                  </TouchableOpacity>
                </View>

                {sheetExpanded ? (
                  <View className="flex-1 border-t border-[#2C2C2C] px-5 pt-7">
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 36, 48) }}
                    >
                      <Text className="mb-5 text-[18px] font-semibold text-white">Directions</Text>

                      <View className="mb-5 flex-row items-center">
                        <View className="mr-4">
                          <DirectionOriginIcon />
                        </View>
                        <Text className="text-[16px] text-white">Your location</Text>
                      </View>

                      {DIRECTIONS.map((direction, index) => (
                        <View key={`${direction.title}-${index}`} className="border-t border-[#2C2C2C] py-5">
                          <View className="flex-row">
                            <View className="mr-4 mt-1 w-6 items-center">
                              <Ionicons name={direction.icon as keyof typeof Ionicons.glyphMap} size={20} color="#FFFFFF" />
                            </View>
                            <View className="flex-1">
                              <Text className="text-[16px] text-white">{direction.title}</Text>
                              <Text className="mt-1 text-[14px] leading-6 text-[#A6A6A6]">{direction.subtitle}</Text>
                            </View>
                          </View>
                        </View>
                      ))}

                      <View className="border-t border-[#2C2C2C] py-5">
                        <View className="flex-row">
                          <View className="mr-4 mt-0.5 w-6 items-center">
                            <DirectionDestinationIcon />
                          </View>
                          <View className="flex-1">
                            <Text className="text-[16px] text-white">Final Destination</Text>
                            <Text className="mt-1 text-[14px] leading-6 text-[#A6A6A6]">
                              {request.destination}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View className="mt-6 mb-8 flex-row items-center rounded-[18px] bg-[#171717] px-4 py-4">
                        <View className="mr-3 h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#6A6A6A]">
                          <Text className="text-[20px]">🧔🏽</Text>
                        </View>
                        <Text className="flex-1 text-[18px] font-medium text-white">{request.riderName}</Text>
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => router.push("/(driver)/call" as never)}
                          className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#252525]"
                        >
                          <Ionicons name="call" size={20} color="#0DFF85" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() =>
                            router.push({
                              pathname: "/(driver)/chat" as never,
                              params: { mode: "active" },
                            })
                          }
                          className="h-12 w-12 items-center justify-center rounded-full bg-[#252525]"
                        >
                          <Ionicons name="chatbubble" size={18} color="#0DFF85" />
                        </TouchableOpacity>
                      </View>

                      <DestinationTripSummaryCard pickup={request.pickup} destination={request.destination} />

                      <View className="mt-7 border-t border-[#2C2C2C] pt-6">
                        <Text className="mb-4 text-[18px] font-bold text-white">Payment method</Text>
                        <View className="flex-row items-center justify-between py-3">
                          <View className="flex-row items-center">
                            <View className="mr-3">
                              <CashPaymentIcon />
                            </View>
                            <Text className="text-[18px] font-semibold text-white">Cash</Text>
                          </View>
                          <Text className="text-[18px] font-bold text-white">{request.fare}</Text>
                        </View>
                        <View className="mt-5 border-b border-[#2C2C2C]" />
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.86}
                        onPress={() => setShowCancelModal(true)}
                        className="mt-6 self-start rounded-[14px] bg-[#2A1618] px-4 py-3"
                      >
                        <Text className="text-[16px] text-[#FF5A5F]">Cancel Ride</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function RoundIconButton({
  icon,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-full bg-[#2A2A2A]"
    >
      <Ionicons name={icon} size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

function AvailabilityChip() {
  return (
    <View className="flex-row items-center rounded-full bg-[#2A2A2A] px-5 py-3">
      <View className="mr-3 h-2.5 w-2.5 rounded-full bg-[#0DFF85]" />
      <Text className="text-[14px] font-medium text-[#67E785]">Available</Text>
    </View>
  );
}

function DestinationTripSummaryCard({ pickup, destination }: { pickup: string; destination: string }) {
  return (
    <View className="rounded-[18px] bg-[#171717] p-4">
      <View className="flex-row">
        <View className="mr-3 items-center rounded-full bg-[#2FC52726]">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-[#27FF9E]">
            <PickupTripOriginIcon />
          </View>
          <PickupTripConnector />
          <View className="h-7 w-7 items-center justify-center rounded-full">
            <PickupTripDestinationIcon />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text className="text-[15px] font-semibold text-white">{pickup}</Text>
          <Text className="mt-1 text-[13px] text-[#7F7F7F]">KM 19 Lekki-Epe Expressway,...</Text>
          <View className="my-4 h-px bg-[#555555]" />
          <Text className="text-[15px] font-semibold text-white">{destination}</Text>
          <Text className="mt-1 text-[13px] text-[#7F7F7F]">KM 19 Lekki-Epe Expressway,...</Text>
        </View>
      </View>
    </View>
  );
}
