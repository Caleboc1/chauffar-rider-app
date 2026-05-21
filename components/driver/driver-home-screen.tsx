import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import SliderChevronIcon from "@/assets/svgIcons/SliderChevronIcon";
import { DriverHomeMap } from "@/components/driver/driver-home-map";

type DriverHomeMode = "offline" | "online" | "stats";

type DriverHomeScreenProps = {
  mode: DriverHomeMode;
};

const summaryItems = [
  { label: "Total ride", value: "11", icon: "car-sport" as const },
  { label: "Today’s ride", value: "5", icon: "car-sport" as const },
  { label: "Wallet balance", value: "N12,000", icon: "wallet" as const },
];

export function DriverHomeScreen({ mode }: DriverHomeScreenProps) {
  const insets = useSafeAreaInsets();
  const isOffline = mode === "offline";
  const isExpandedOnline = mode === "stats";
  const bottomSheetPadding = Math.max(insets.bottom + 14, 22);

  return (
    <View className="flex-1 bg-[#0B0B0B]">
      <StatusBar style="light" />
      <DriverHomeMap />

      <SafeAreaView className="flex-1" edges={["top"]} pointerEvents="box-none">
        <View className="flex-1 px-5 pt-2" pointerEvents="box-none">
          <View className="flex-row items-center justify-between" pointerEvents="box-none">
            <RoundIconButton icon="menu" onPress={() => {}} />
            {isOffline ? <View className="h-12" /> : <AvailabilityChip label="Available" tone="neutral" />}
            <RoundIconButton icon="notifications" onPress={() => {}} />
          </View>

          <View className="flex-1 justify-end" pointerEvents="box-none">
            {!isOffline ? (
              <View className="mb-6 items-end">
                <RoundIconButton icon="locate" onPress={() => {}} />
              </View>
            ) : null}

            {isOffline ? (
              <View
                className="bg-[#111111]"
                style={{
                  marginHorizontal: -20,
                  paddingTop: 18,
                  paddingHorizontal: 18,
                  paddingBottom: bottomSheetPadding,
                  borderTopLeftRadius: 28,
                  borderTopRightRadius: 28,
                  shadowColor: "#000000",
                  shadowOpacity: 0.38,
                  shadowRadius: 18,
                  elevation: 10,
                }}
              >
                <BottomSheetHeader tone="offline" />
                <GoOnlineSlider />
              </View>
            ) : (
              <OnlineBottomSheet
                bottomInset={bottomSheetPadding}
                initiallyExpanded={isExpandedOnline}
              />
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
  onPress: () => void;
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

function AvailabilityChip({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "online" | "offline";
}) {
  const dotColor = tone === "offline" ? "#FF4B5F" : "#0DFF85";
  const textColor = tone === "neutral" ? "#67E785" : dotColor;

  return (
    <View className="flex-row items-center rounded-full bg-[#2A2A2A] px-5 py-3">
      <View
        className="mr-3 h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: dotColor,
          shadowColor: dotColor,
          shadowOpacity: 0.55,
          shadowRadius: 6,
          elevation: 2,
        }}
      />
      <Text className="text-[14px] font-medium" style={{ color: textColor }}>
        {label}
      </Text>
    </View>
  );
}

function StatsCard() {
  return (
    <View className="overflow-hidden rounded-[18px] border border-[#2A2A2A] bg-[#171515]">
      <View className="flex-row px-3 py-3.5">
        {summaryItems.map((item, index) => (
          <View key={item.label} className="flex-1 items-center justify-center">
            {index > 0 ? (
              <View className="absolute left-0 top-1 bottom-1 w-px bg-[#3A3131]" />
            ) : null}
            <Text className="mb-1.5 text-center text-[12px] text-[#B8B1B1]">{item.label}</Text>
            <View className="flex-row items-center">
              <Ionicons name={item.icon} size={13} color="#0DFF85" />
              <Text className="ml-1 text-[12px] font-semibold text-[#0DFF85]">{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="items-center border-t border-[#2A2A2A] px-6 py-12">
        <Text className="text-[15px] font-medium text-[#C6C0C0]">No pickup status</Text>
      </View>
    </View>
  );
}

function BottomSheetHeader({ tone }: { tone: "online" | "offline" }) {
  return (
    <View className="mb-5 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-[#FFD7B8]">
          <Text className="text-[22px]">🧑🏽‍✈️</Text>
        </View>

        <View>
          <Text className="text-[18px] font-semibold text-white">Welcome Kelvin</Text>
          <Text className="mt-0.5 text-[12px] text-[#8F8F8F]">Let&apos;s get you moving</Text>
        </View>
      </View>

      <AvailabilityChip
        label={tone === "offline" ? "You’re offline" : "You’re Online"}
        tone={tone}
      />
    </View>
  );
}

function OnlineBottomSheet({
  bottomInset,
  initiallyExpanded,
}: {
  bottomInset: number;
  initiallyExpanded: boolean;
}) {
  const maxDetailsHeight = 182;
  const [detailsHeight, setDetailsHeight] = useState(initiallyExpanded ? maxDetailsHeight : 0);
  const detailsHeightRef = useRef(detailsHeight);
  const dragStartRef = useRef(detailsHeight);

  const updateHeight = (value: number) => {
    detailsHeightRef.current = value;
    setDetailsHeight(value);
  };

  useEffect(() => {
    updateHeight(initiallyExpanded ? maxDetailsHeight : 0);
  }, [initiallyExpanded]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 3 && Math.abs(gesture.dx) < 12,
      onPanResponderGrant: () => {
        dragStartRef.current = detailsHeightRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        const nextValue = Math.min(Math.max(dragStartRef.current - gesture.dy, 0), maxDetailsHeight);
        updateHeight(nextValue);
      },
      onPanResponderRelease: (_, gesture) => {
        const finalValue = Math.min(Math.max(dragStartRef.current - gesture.dy, 0), maxDetailsHeight);
        const shouldExpand = finalValue > maxDetailsHeight * 0.38;
        updateHeight(shouldExpand ? maxDetailsHeight : 0);
      },
      onPanResponderTerminate: () => {
        const shouldExpand = detailsHeightRef.current > maxDetailsHeight * 0.38;
        updateHeight(shouldExpand ? maxDetailsHeight : 0);
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      className="bg-[#111111]"
      style={{
        marginHorizontal: -20,
        paddingTop: 18,
        paddingHorizontal: 18,
        paddingBottom: bottomInset,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: "#000000",
        shadowOpacity: 0.38,
        shadowRadius: 18,
        elevation: 10,
      }}
    >
      <SheetHandle />
      <BottomSheetHeader tone="online" />
      <View style={{ height: detailsHeight, overflow: "hidden" }}>
        <StatsCard />
      </View>
    </View>
  );
}

function SheetHandle() {
  return (
    <View className="mb-5 items-center">
      <View className="h-1 w-12 rounded-full bg-white" />
    </View>
  );
}

function GoOnlineSlider() {
  const knobSize = 72;
  const horizontalPadding = 8;
  const [trackWidth, setTrackWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const trackWidthRef = useRef(0);
  const positionRef = useRef(0);
  const dragStartRef = useRef(0);

  const updatePosition = (value: number) => {
    positionRef.current = value;
    setPosition(value);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    trackWidthRef.current = nextWidth;
    setTrackWidth(nextWidth);
    updatePosition(
      Math.min(positionRef.current, Math.max(nextWidth - knobSize - horizontalPadding * 2, 0))
    );
  };

  const getMaxTranslate = () => Math.max(trackWidthRef.current - knobSize - horizontalPadding * 2, 0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 3 && Math.abs(gesture.dy) < 10,
      onPanResponderGrant: () => {
        dragStartRef.current = positionRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        const maxTranslate = getMaxTranslate();
        const nextValue = Math.min(Math.max(dragStartRef.current + gesture.dx, 0), maxTranslate);
        updatePosition(nextValue);
      },
      onPanResponderRelease: (_, gesture) => {
        const maxTranslate = getMaxTranslate();
        const finalPosition = Math.min(Math.max(dragStartRef.current + gesture.dx, 0), maxTranslate);
        const shouldComplete = maxTranslate > 0 && finalPosition >= maxTranslate * 0.82;

        if (shouldComplete) {
          updatePosition(maxTranslate);
          router.replace("/(driver)/home-online");
          return;
        }

        updatePosition(0);
      },
      onPanResponderTerminate: () => {
        updatePosition(0);
      },
    })
  ).current;

  const fillWidth = trackWidth > 0 ? Math.min(position + knobSize + horizontalPadding * 2, trackWidth) : 0;
  const maxTranslate = getMaxTranslate();
  const labelOpacity = maxTranslate > 0 ? Math.max(0, 1 - position / (maxTranslate * 0.8)) : 1;

  return (
    <View
      className="h-[72px] overflow-hidden rounded-full bg-[#343434]"
      onLayout={handleLayout}
      style={styles.sliderTrack}
    >
      <View
        pointerEvents="none"
        style={[
          styles.sliderFill,
          {
            width: fillWidth,
          },
        ]}
      />
      <View pointerEvents="none" style={[styles.sliderLabel, { opacity: labelOpacity }]}>
        <Text className="text-[18px] font-semibold text-[#AFAFAF]">Go online</Text>
      </View>
      <View
        {...panResponder.panHandlers}
        style={[
          styles.sliderKnobGesture,
          {
            width: knobSize,
            left: horizontalPadding + position,
          },
        ]}
      >
        <View
          style={[
            styles.sliderKnob,
            {
              width: knobSize,
            },
          ]}
        >
          <SliderChevronIcon />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderTrack: {
    padding: 8,
    position: "relative",
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: "#0DFF91",
  },
  sliderLabel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderKnobGesture: {
    position: "absolute",
    top: 8,
    bottom: 8,
    left: 8,
  },
  sliderKnob: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 999,
    backgroundColor: "#0DFF85",
    alignItems: "center",
    justifyContent: "center",
  },
});
