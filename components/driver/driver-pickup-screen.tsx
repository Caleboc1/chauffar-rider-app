import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PanResponder, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import ArrivalNoticeIcon from "@/assets/svgIcons/ArrivalNoticeIcon";
import CashPaymentIcon from "@/assets/svgIcons/CashPaymentIcon";
import PickupHeaderIcon from "@/assets/svgIcons/PickupHeaderIcon";
import PickupTripConnector from "@/assets/svgIcons/PickupTripConnector";
import PickupTripDestinationIcon from "@/assets/svgIcons/PickupTripDestinationIcon";
import PickupTripOriginIcon from "@/assets/svgIcons/PickupTripOriginIcon";
import type { DriverRideRequest } from "@/components/driver/driver-mock-state";
import { DriverPickupMap } from "@/components/driver/driver-pickup-map";

type DriverPickupScreenProps = {
  request: DriverRideRequest;
};

export function DriverPickupScreen({ request }: DriverPickupScreenProps) {
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);
  const [waitingForPassenger, setWaitingForPassenger] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(120);
  const dragStartRef = useRef(0);
  const sheetHeightRef = useRef(sheetExpanded ? 270 : 120);
  const [sheetExtraHeight, setSheetExtraHeight] = useState(sheetExpanded ? 270 : 120);

  const distanceKm = waitingForPassenger ? 0 : Math.max(0, Number(((1 - progress) * 3.5).toFixed(1)));
  const canArrive = hasArrived || waitingForPassenger;

  const handleArrival = useCallback(() => {
    setHasArrived(true);
  }, []);

  const handleProgressChange = useCallback((nextProgress: number) => {
    setProgress(nextProgress);
  }, []);

  const updateSheetHeight = useCallback((value: number) => {
    sheetHeightRef.current = value;
    setSheetExtraHeight(value);
  }, []);

  const snapSheet = useCallback((expanded: boolean) => {
    setSheetExpanded(expanded);
    updateSheetHeight(expanded ? 270 : 120);
  }, [updateSheetHeight]);

  useEffect(() => {
    if (!waitingForPassenger) return;
    if (waitSeconds <= 0) return;

    const timer = setTimeout(() => {
      setWaitSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [waitSeconds, waitingForPassenger]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 3 && Math.abs(gesture.dx) < 12,
        onPanResponderGrant: () => {
          dragStartRef.current = sheetHeightRef.current;
        },
        onPanResponderMove: (_, gesture) => {
          const nextValue = Math.min(Math.max(dragStartRef.current - gesture.dy, 120), 270);
          updateSheetHeight(nextValue);
        },
        onPanResponderRelease: (_, gesture) => {
          const finalValue = Math.min(Math.max(dragStartRef.current - gesture.dy, 120), 270);
          snapSheet(finalValue > 190);
        },
      }),
    [snapSheet, updateSheetHeight]
  );

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      <DriverPickupMap
        request={request}
        waitingForPassenger={waitingForPassenger}
        onArrival={handleArrival}
        onProgressChange={handleProgressChange}
      />

      <SafeAreaView className="flex-1" edges={["top"]} pointerEvents="box-none">
        <View className="flex-1 px-5 pt-2" pointerEvents="box-none">
          <View className="flex-row items-center justify-between">
            <RoundIconButton icon="menu" />
            <AvailabilityChip />
            <RoundIconButton icon="notifications" />
          </View>

          <View className="flex-1 justify-end" pointerEvents="box-none">
            <View className="mb-6 items-end">
              <RoundIconButton icon="locate" />
            </View>

            <View
              {...panResponder.panHandlers}
              className="bg-[#111111]"
              style={{
                marginHorizontal: -20,
                paddingTop: 12,
                paddingHorizontal: 20,
                paddingBottom: Math.max(insets.bottom + 14, 22),
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                minHeight: sheetExtraHeight + Math.max(insets.bottom + 14, 22),
              }}
            >
              <View className="mb-5 items-center">
                <View className="h-1 w-12 rounded-full bg-white" />
              </View>

              {!waitingForPassenger ? (
                <PickupCollapsedHeader distanceKm={distanceKm} />
              ) : null}

              {waitingForPassenger ? (
                <WaitingCollapsedHeader waitSeconds={waitSeconds} />
              ) : null}

              <TouchableOpacity
                activeOpacity={0.86}
                disabled={!canArrive && !waitingForPassenger}
                onPress={() => {
                  if (!waitingForPassenger && canArrive) {
                    setWaitingForPassenger(true);
                    snapSheet(false);
                    return;
                  }
                  if (waitingForPassenger) {
                    router.replace("/(driver)/destination");
                  }
                }}
                className={`mb-5 h-14 items-center justify-center rounded-full ${
                  canArrive || waitingForPassenger ? "bg-[#0DFF85]" : "bg-[#5A5A5A]"
                }`}
              >
                <Text className={`text-[18px] font-semibold ${canArrive || waitingForPassenger ? "text-[#050505]" : "text-[#D7D7D7]"}`}>
                  {waitingForPassenger ? "Start ride" : "I have arrived"}
                </Text>
              </TouchableOpacity>

              {sheetExpanded && canArrive && !waitingForPassenger ? (
                <View className="mb-6 flex-row rounded-[18px] bg-[#283831] px-6 py-5">
                  <View className="mr-4 mt-0.5">
                    <ArrivalNoticeIcon />
                  </View>
                  <Text className="flex-1 text-[14px] leading-6 text-[#E7E7E7]">
                    Please confirm arrival only when vehicle is stopped
                  </Text>
                </View>
              ) : null}

              {sheetExpanded ? (
                <>
                  <View className="mb-5 border-t border-[#2C2C2C]" />

                  <View className="mb-8 flex-row items-center rounded-[18px] bg-[#171717] px-4 py-4">
                    <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-[#6A6A6A]">
                      <Text className="text-[20px]">🧔🏽</Text>
                    </View>
                    <Text className="flex-1 text-[18px] font-medium text-white">Jude Zach</Text>
                    <TouchableOpacity className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#252525]">
                      <Ionicons name="call" size={20} color="#0DFF85" />
                    </TouchableOpacity>
                    <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-full bg-[#252525]">
                      <Ionicons name="chatbubble" size={18} color="#0DFF85" />
                    </TouchableOpacity>
                  </View>

                  <TripSummaryCard pickup={request.pickup} destination={request.destination} />

                  <View className="mt-7 border-t border-[#2C2C2C] pt-6">
                    <Text className="mb-4 text-[18px] font-bold text-white">Payment method</Text>
                    <View className="flex-row items-center justify-between py-2">
                      <View className="flex-row items-center">
                        <View className="mr-3">
                          <CashPaymentIcon />
                        </View>
                        <Text className="text-[18px] text-white font-semibold">Cash</Text>
                      </View>
                      <Text className="text-[18px] font-bold text-white">N2,600</Text>
                    </View>
                    <View className="mt-5 border-b border-[#2C2C2C]" />
                  </View>

                  <TouchableOpacity className="mt-6 self-start rounded-[14px] bg-[#2A1618] px-4 py-3">
                    <Text className="text-[16px] text-[#FF5A5F]">Cancel Ride</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function RoundIconButton({ icon }: { icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <TouchableOpacity activeOpacity={0.82} className="h-12 w-12 items-center justify-center rounded-full bg-[#2A2A2A]">
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

function PickupCollapsedHeader({ distanceKm }: { distanceKm: number }) {
  return (
    <View className="mb-4 flex-row items-start justify-between">
      <View>
        <View className="mb-2 flex-row items-center">
          <View className="mr-2">
            <PickupHeaderIcon />
          </View>
          <Text className="text-[14px] text-[#A8A8A8]">Pickup Location</Text>
        </View>
        <Text className="text-[18px] font-medium text-white">Onu-Asata Junction</Text>
      </View>
      <Text className="text-[18px] font-semibold text-white">{distanceKm.toFixed(1)}KM</Text>
    </View>
  );
}

function WaitingCollapsedHeader({ waitSeconds }: { waitSeconds: number }) {
  const minutes = Math.floor(waitSeconds / 60);
  const seconds = waitSeconds % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, "0")}min`;

  return (
    <View className="mb-4 flex-row items-start justify-between">
      <Text className="text-[18px] font-medium text-white">Waiting for passenger</Text>
      <Text className="text-[18px] font-semibold text-white">{display}</Text>
    </View>
  );
}

function TripSummaryCard({ pickup, destination }: { pickup: string; destination: string }) {
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
          <Text className="mt-1 text-[13px] text-[#7F7F7F]">KM 19 Lekki-Epe Expressway...</Text>
          <View className="my-4 h-px bg-[#555555]" />
          <Text className="text-[15px] font-semibold text-white">{destination}</Text>
          <Text className="mt-1 text-[13px] text-[#7F7F7F]">KM 19 Lekki-Epe Expressway...</Text>
        </View>
      </View>
    </View>
  );
}
