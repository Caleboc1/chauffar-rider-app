import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import ConfirmPaymentBankTransferIcon from "@/assets/svgIcons/ConfirmPaymentBankTransferIcon";
import ConfirmPaymentCashIcon from "@/assets/svgIcons/ConfirmPaymentCashIcon";
import ConfirmPaymentOtherIcon from "@/assets/svgIcons/ConfirmPaymentOtherIcon";
import ConfirmPaymentWalletIcon from "@/assets/svgIcons/ConfirmPaymentWalletIcon";
import TripSummaryDestinationMarker from "@/assets/svgIcons/TripSummaryDestinationMarker";
import TripSummaryPolygon from "@/assets/svgIcons/TripSummaryPolygon";
import TripSummaryRouteConnector from "@/assets/svgIcons/TripSummaryRouteConnector";
import type { DriverRideRequest } from "@/components/driver/driver-mock-state";
import { rideMapStyle } from "@/theme/ride-map-style";

export const DRIVER_PAYMENT_METHODS = [
  {
    id: "cash",
    title: "Cash",
    subtitle: "Physical cash payment",
    iconBg: "#25213D",
    icon: ConfirmPaymentCashIcon,
  },
  {
    id: "bank-transfer",
    title: "Bank Transfer",
    subtitle: "Direct to bank account",
    iconBg: "#1C3122",
    icon: ConfirmPaymentBankTransferIcon,
  },
  {
    id: "wallet",
    title: "Wallet",
    subtitle: "In-app wallet balance",
    iconBg: "#30261B",
    icon: ConfirmPaymentWalletIcon,
  },
  {
    id: "other",
    title: "Other",
    subtitle: "Alternative arrangement",
    iconBg: "#2E301D",
    icon: ConfirmPaymentOtherIcon,
  },
] as const;

export const DRIVER_PAYMENT_ISSUE_OPTIONS = [
  { id: "refused", label: "Rider refused to pay" },
  { id: "underpaid", label: "Rider underpaid" },
  { id: "not-received", label: "Payment not received (Transfer/Wallet)" },
  { id: "other", label: "Other" },
] as const;

export type DriverPaymentMethodId = (typeof DRIVER_PAYMENT_METHODS)[number]["id"];
export type DriverPaymentIssueId = (typeof DRIVER_PAYMENT_ISSUE_OPTIONS)[number]["id"];

export function getDriverPaymentMethodDetails(methodId?: string) {
  return (
    DRIVER_PAYMENT_METHODS.find((method) => method.id === methodId) ??
    DRIVER_PAYMENT_METHODS[0]
  );
}

export function DriverPaymentHeader({
  title,
  subtitle,
  onBack,
  onInfoPress,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
  onInfoPress?: () => void;
}) {
  return (
    <View className="relative items-center">
      {onBack ? (
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={onBack}
          className="absolute left-0 top-0 h-10 w-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}

      {onInfoPress ? (
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={onInfoPress}
          className="absolute right-0 top-0 h-10 w-10 items-center justify-center"
        >
          <View className="h-5 w-5 items-center justify-center rounded-full bg-[#373737]">
            <Ionicons name="help" size={12} color="#D8D8D8" />
          </View>
        </TouchableOpacity>
      ) : null}

      <Text className="text-center text-[22px] font-semibold text-white">{title}</Text>
      <Text className="mt-3 max-w-[260px] text-center text-[14px] leading-7 text-[#CACACA]">
        {subtitle}
      </Text>
    </View>
  );
}

export function DriverRideFareCard({
  amount,
  duration,
}: {
  amount: string;
  duration: string;
}) {
  return (
    <View className="rounded-[18px] bg-[#171717] px-5 py-6">
      <Text className="text-center text-[16px] text-[#9A9A9A]">Ride Fare</Text>
      <Text className="mt-2 text-center text-[46px] font-semibold text-white">{amount}</Text>

      <View className="mt-5 items-center">
        <View className="flex-row items-center rounded-full border border-[#41574F] bg-[#27322E] px-4 py-3">
          <Ionicons name="time-outline" size={16} color="#18FF98" />
          <Text className="ml-2 text-[15px] text-[#E7E7E7]">Ride duration: {duration}</Text>
        </View>
      </View>
    </View>
  );
}

export function DriverPaymentMethodCard({
  methodId,
  selected,
  onPress,
}: {
  methodId: DriverPaymentMethodId;
  selected: boolean;
  onPress: () => void;
}) {
  const method = getDriverPaymentMethodDetails(methodId);
  const Icon = method.icon;

  return (
    <TouchableOpacity
      activeOpacity={0.84}
      onPress={onPress}
      className="mb-4 flex-row items-center rounded-[16px] bg-[#171717] px-4 py-5"
      style={{ borderWidth: 1, borderColor: selected ? "#12FF98" : "#171717" }}
    >
      <View
        className="mr-4 h-10 w-10 items-center justify-center rounded-[10px]"
        style={{ backgroundColor: method.iconBg }}
      >
        <Icon />
      </View>

      <View className="flex-1 pr-3">
        <Text className="text-[16px] font-semibold text-white">{method.title}</Text>
        <Text className="mt-1 text-[14px] text-[#A5A5A5]">{method.subtitle}</Text>
      </View>

      <RadioIndicator selected={selected} />
    </TouchableOpacity>
  );
}

export function DriverIssueOptionCard({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.84}
      onPress={onPress}
      className="mb-4 flex-row items-center rounded-[14px] bg-[#171717] px-4 py-6"
      style={{ borderWidth: 1, borderColor: selected ? "#12FF98" : "#171717" }}
    >
      <Text className="flex-1 text-[16px] text-white">{label}</Text>
      <RadioIndicator selected={selected} />
    </TouchableOpacity>
  );
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <View
      className="h-7 w-7 items-center justify-center rounded-full"
      style={{ backgroundColor: selected ? "#12FF98" : "#A6A6A6" }}
    >
      {selected ? <View className="h-5 w-5 rounded-full border border-[#050505] bg-[#12FF98]" /> : null}
    </View>
  );
}

export function DriverDetailCard({
  rows,
}: {
  rows: { label: string; value: string; secondary?: string; leading?: ReactNode }[];
}) {
  return (
    <View className="rounded-[18px] bg-[#171717] px-5 py-1">
      {rows.map((row) => (
        <View key={row.label} className="border-b border-[#343434] py-5 last:border-b-0">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-[16px] text-[#8F8F8F]">{row.label}</Text>
            </View>

            <View className="max-w-[62%] items-end">
              {row.leading ? (
                <View className="mb-2 flex-row items-center">
                  {row.leading}
                  <Text className="ml-3 text-[16px] text-white">{row.value}</Text>
                </View>
              ) : (
                <Text className="text-right text-[16px] text-white">{row.value}</Text>
              )}

              {row.secondary ? (
                <Text className="mt-2 text-right text-[14px] text-[#949494]">{row.secondary}</Text>
              ) : null}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export function DriverPassengerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View className="h-6 w-6 items-center justify-center rounded-full bg-[#8A4C29]">
      <Text className="text-[11px] font-semibold text-white">{initials}</Text>
    </View>
  );
}

export function DriverRoutePreviewCard({ request }: { request: DriverRideRequest }) {
  const startAddress = request.pickup;
  const destinationAddress = request.destination;

  return (
    <View className="rounded-[20px] bg-[#1B1B1B] px-4 py-5">
      <View className="flex-row">
        <View className="mr-4 items-center rounded-full bg-[#2FC52726]">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-[#27FF9E]">
            <TripSummaryPolygon />
          </View>
          <TripSummaryRouteConnector />
          <View className="h-7 w-7 items-center justify-center rounded-full">
            <TripSummaryDestinationMarker />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text className="text-[15px] text-white" numberOfLines={1}>
            {startAddress}
          </Text>
          <View className="my-4 h-px bg-[#555555]" />
          <Text className="text-[15px] text-white" numberOfLines={1}>
            {destinationAddress}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function DriverTripPreviewMap({ request }: { request: DriverRideRequest }) {
  const pickupLocation = request.destinationPreview.routeCoordinates[0];
  const destinationLocation = request.destinationPreview.destinationLocation;

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={request.destinationPreview.region}
        customMapStyle={rideMapStyle}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        showsCompass={false}
        showsBuildings={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
      >
        <Polyline coordinates={request.destinationPreview.routeCoordinates} strokeColors={["#27FF9E"]} strokeWidth={4} />

        <Marker coordinate={pickupLocation} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <View className="h-6 w-6 items-center justify-center rounded-full bg-[#27FF9E]">
            <View className="h-3 w-3 rounded-full bg-[#0D0D0D]" />
          </View>
        </Marker>

        <Marker coordinate={destinationLocation} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
          <View className="items-center">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-[#FC505E]">
              <View className="h-3 w-3 rounded-full bg-[#3D0B11]" />
            </View>
            <View className="mt-[-2px] h-4 w-1 rounded-full bg-[#FC505E]" />
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

export function DriverUploadCard({
  imageUri,
  onAdd,
  helperText,
}: {
  imageUri?: string;
  onAdd: () => void;
  helperText: string;
}) {
  return (
    <View className="rounded-[16px] border border-[#343434] px-4 py-4">
      <View className="flex-row items-start">
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-full border border-dashed border-[#8F8F8F]">
          <Ionicons name="cloud-upload-outline" size={16} color="#EEEEEE" />
        </View>

        <View className="flex-1 pr-2">
          <Text className="text-[14px] text-white">Upload photo</Text>
          <Text className="mt-1 text-[12px] leading-5 text-[#808080]">
            Upload at least 1 picture of either not{"\n"}less than 10MB
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.82}
          onPress={onAdd}
          className="h-8 min-w-[50px] items-center justify-center rounded-md px-3"
          style={{ backgroundColor: "#12FF98" }}
        >
          <Text className="text-[13px] font-semibold text-[#04110A]">+ Add</Text>
        </TouchableOpacity>
      </View>

      <View className="my-3 h-px bg-[#1D1D1D]" />

      <TouchableOpacity
        activeOpacity={0.84}
        onPress={onAdd}
        className="h-[62px] w-[62px] items-center justify-center rounded-[8px] border border-dashed border-[#404040]"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="h-full w-full rounded-[8px]" contentFit="cover" />
        ) : (
          <Ionicons name="add" size={18} color="#5F5F5F" />
        )}
      </TouchableOpacity>

      <Text className="mt-4 text-[12px] text-[#8A8A8A]">{helperText}</Text>
    </View>
  );
}

export function formatDriverPaymentAmount(value: string) {
  const numeric = Number(value.replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric)) {
    return value;
  }

  return `₦${numeric.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}
