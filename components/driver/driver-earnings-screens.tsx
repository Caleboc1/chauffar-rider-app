import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import BlockRiderIcon from "@/assets/svgIcons/BlockRiderIcon";
import EarningBonusesIcon from "@/assets/svgIcons/EarningBonusesIcon";
import EarningCalendarIcon from "@/assets/svgIcons/EarningCalendarIcon";
import EarningLocationMarkerIcon from "@/assets/svgIcons/EarningLocationMarkerIcon";
import EarningRatingReviewsIcon from "@/assets/svgIcons/EarningRatingReviewsIcon";
import EarningRideEarningIcon from "@/assets/svgIcons/EarningRideEarningIcon";
import EarningTransactionRideIcon from "@/assets/svgIcons/EarningTransactionRideIcon";
import EarningWalletIcon from "@/assets/svgIcons/EarningWalletIcon";
import EarningWithdrawalArrowIcon from "@/assets/svgIcons/EarningWithdrawalArrowIcon";
import ReportRiderFlagIcon from "@/assets/svgIcons/ReportRiderFlagIcon";
import RideDetailsRatingStarIcon from "@/assets/svgIcons/RideDetailsRatingStarIcon";
import RiderVerifiedBadgeIcon from "@/assets/svgIcons/RiderVerifiedBadgeIcon";
import TripSummaryDestinationMarker from "@/assets/svgIcons/TripSummaryDestinationMarker";
import TripSummaryPolygon from "@/assets/svgIcons/TripSummaryPolygon";
import TripSummaryRouteConnector from "@/assets/svgIcons/TripSummaryRouteConnector";
import WithdrawBankIcon from "@/assets/svgIcons/WithdrawBankIcon";
import WithdrawalSuccessBadgeIcon from "@/assets/svgIcons/WithdrawalSuccessBadgeIcon";
import { DriverSideDrawer } from "@/components/driver/driver-side-drawer";
import { EarningTrendChart } from "@/components/driver/earning-trend-chart";
import { AUTH_GREEN } from "@/features/auth/constants";
import type { DriverRideRequest } from "@/components/driver/driver-mock-state";
import { useDriverMockState } from "@/components/driver/driver-mock-state";
import {
  DriverDetailCard,
  DriverPassengerAvatar,
  DriverRoutePreviewCard,
  DriverTripPreviewMap,
  DriverUploadCard,
  formatDriverPaymentAmount,
} from "@/components/driver/driver-payment-flow";

const BG = "#0B0B0B";
const CARD = "#1B1B1B";
const LINE = "#353535";
const PURPLE = "#1430FF";
const ORANGE = "#E58D00";
const RIDER_AVATAR = require("@/assets/images/avatar.png");

const rides = [
  { id: "1", time: "Today, 10:23 AM", method: "Wallet", color: "#BDF5C9" },
  { id: "2", time: "Yesterday, 4:15 PM", method: "Transfer", color: "#D8D4FF" },
  { id: "3", time: "Yesterday, 4:15 PM", method: "Cash", color: "#FFE4C7" },
];

const rideHistory = [
  { id: "completed", status: "Completed", totalFare: "₦6500", netEarnings: "₦5000", detailsEarning: "₦3,600" },
  { id: "multi-stop", status: "Completed", totalFare: "₦6500", netEarnings: "₦5000", detailsEarning: "₦10,000", stop: "Lekki Conservation Center" },
  { id: "cancelled", status: "Cancelled", totalFare: "₦6500", netEarnings: "₦5000", detailsEarning: "₦3,600" },
];

const transactions = [
  { id: "1", title: "Ride Earning", time: "Today, 10:23AM", amount: "₦4500", type: "received" },
  { id: "2", title: "Amount Withdrawal", time: "Today, 10:23AM", amount: "₦105,000", type: "withdrawn" },
  { id: "3", title: "System Adjustment", time: "2days ago", amount: "₦50,000", type: "withdrawn" },
  { id: "4", title: "Ride Earning", time: "Today, 10:23AM", amount: "₦4500", type: "received" },
];

const banks = [
  { id: "gtbank", name: "GTBank", suffix: "2947", isDefault: true },
  { id: "access", name: "Access Bank", suffix: "2947", isDefault: false },
  { id: "zenith", name: "Zenith Bank", suffix: "8821", isDefault: false },
];

const rideDetailsRide: DriverRideRequest = {
  id: "earnings-rq-1",
  riderName: "Ebuka Johnson",
  rideType: "Regular ride",
  pickup: "14 Adeola Odeku St, Victoria Island, Lagos",
  destination: "Lekki Conservation Centre",
  fare: "N3,500",
  scheduledLabel: "12:30pm",
  rating: 4.5,
  marker: { latitude: 6.4281, longitude: 3.4219 },
  pickupPreview: {
    region: {
      latitude: 6.438,
      longitude: 3.422,
      latitudeDelta: 0.018,
      longitudeDelta: 0.016,
    },
    routeCoordinates: [
      { latitude: 6.4337, longitude: 3.4173 },
      { latitude: 6.4372, longitude: 3.4186 },
      { latitude: 6.4408, longitude: 3.4211 },
      { latitude: 6.4435, longitude: 3.4268 },
    ],
    passengerLocation: { latitude: 6.4337, longitude: 3.4173 },
  },
  destinationPreview: {
    region: {
      latitude: 6.438,
      longitude: 3.422,
      latitudeDelta: 0.018,
      longitudeDelta: 0.016,
    },
    routeCoordinates: [
      { latitude: 6.4337, longitude: 3.4173 },
      { latitude: 6.4372, longitude: 3.4186 },
      { latitude: 6.4408, longitude: 3.4211 },
      { latitude: 6.4435, longitude: 3.4268 },
    ],
    destinationLocation: { latitude: 6.4435, longitude: 3.4268 },
  },
};

type AppRoute =
  | "/(driver)/earning"
  | "/(driver)/ride-history"
  | "/(driver)/ride-history-details"
  | "/(driver)/rider-profile"
  | "/(driver)/report-rider"
  | "/(driver)/ride-earning"
  | "/(driver)/ride-details"
  | "/(driver)/wallet"
  | "/(driver)/withdraw-earnings"
  | "/(driver)/bank-destination"
  | "/(driver)/withdrawal-transaction-pin"
  | "/(driver)/withdrawal-success";

function goTo(pathname: AppRoute, params?: Record<string, string>) {
  if (params) {
    router.push({ pathname, params });
    return;
  }

  router.push(pathname);
}

function Header({
  title,
  menu = false,
  onMenu,
}: {
  title: string;
  menu?: boolean;
  onMenu?: () => void;
}) {
  return (
    <View className="relative mb-8 min-h-12 items-center justify-center">
      <TouchableOpacity
        activeOpacity={0.84}
        onPress={menu ? onMenu : () => router.back()}
        className="absolute left-0 h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: menu ? "#252525" : "transparent" }}
      >
        <Ionicons name={menu ? "menu" : "arrow-back"} size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Text className="text-[21px] font-semibold text-white">{title}</Text>
    </View>
  );
}

function Page({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: insets.bottom + 28,
          }}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function IconTile({ icon, color = AUTH_GREEN }: { icon: keyof typeof Ionicons.glyphMap; color?: string }) {
  return (
    <View className="h-10 w-10 items-center justify-center rounded-[3px] bg-[#252525]">
      <Ionicons name={icon} size={18} color={color} />
    </View>
  );
}

function SvgIconTile({ children }: { children: ReactNode }) {
  return (
    <View className="h-10 w-10 items-center justify-center rounded-[3px] bg-[#252525]">
      {children}
    </View>
  );
}

export function DriverEarningScreen() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <DriverSideDrawer visible={showDrawer} onClose={() => setShowDrawer(false)} />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34 }}
        >
          <Header title="Earning" menu onMenu={() => setShowDrawer(true)} />

          <View className="rounded-[10px] p-4" style={{ backgroundColor: CARD }}>
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-[15px] text-[#BDBDBD]">Total earning</Text>
                <View className="mt-7 flex-row items-center">
                  <Text className="text-[29px] font-bold text-white">₦125,400</Text>
                  <Ionicons name="eye-off-outline" size={18} color="#8F8F8F" style={{ marginLeft: 14 }} />
                </View>
              </View>
              <TouchableOpacity className="h-11 flex-row items-center rounded-[4px] border border-[#2D2D2D] px-3">
                <Text className="mr-4 text-[15px] text-white">Today</Text>
                <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View className="mt-8 flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.84}
                onPress={() => goTo("/(driver)/withdraw-earnings")}
                className="h-12 flex-1 flex-row items-center justify-center rounded-full"
                style={{ backgroundColor: AUTH_GREEN }}
              >
                <WithdrawBankIcon />
                <Text className="ml-2 text-[15px] font-semibold text-[#07110C]">Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.84}
                onPress={() => goTo("/(driver)/ride-earning")}
                className="h-12 flex-1 flex-row items-center justify-center rounded-full border border-[#303030]"
              >
                <Text className="mr-3 text-[15px] font-semibold text-white">View details</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="mt-8 text-[17px] font-semibold text-white">Quick actions</Text>
          <View className="mt-5 flex-row justify-around">
            <QuickAction label="Ride Earning" icon={<EarningRideEarningIcon />} onPress={() => goTo("/(driver)/ride-earning")} />
            <QuickAction label="Wallet" icon={<EarningWalletIcon />} onPress={() => goTo("/(driver)/wallet")} />
            <QuickAction label="Rating & Reviews" icon={<EarningRatingReviewsIcon />} onPress={() => undefined} />
          </View>

          <View className="mt-8 flex-row items-center justify-between">
            <Text className="text-[18px] font-semibold text-white">Earning Trends</Text>
            <TouchableOpacity className="h-10 flex-row items-center border border-[#2D2D2D] px-3">
              <Text className="mr-5 text-[15px] text-white">Today</Text>
              <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View className="mt-6 rounded-[10px] p-4" style={{ backgroundColor: CARD }}>
            <EarningTrendChart />
          </View>

          <View className="mt-8 flex-row gap-4">
            <MetricCard icon={<EarningWalletIcon />} label="Wallet Balance" value="₦125,400" />
            <MetricCard icon={<EarningRatingReviewsIcon />} label="Rating & Reviews" value="4.8/5.0" />
          </View>
          <View className="mt-5 flex-row gap-4">
            <MetricCard icon="car-sport" iconColor={AUTH_GREEN} label="Completed Rides" value="200" />
            <MetricCard icon={<EarningBonusesIcon />} label="Bonuses" value="₦60,000" />
          </View>

          <SectionTitle title="Recent Rides" onViewAll={() => goTo("/(driver)/ride-history")} />
          <View className="rounded-[10px] px-3 py-2" style={{ backgroundColor: CARD }}>
            {["Trip to lekki phase one", "Trip to Ago palace way", "Trip to Ikeja City Mall"].map((title, index) => (
              <ListRow
                key={title}
                title={title}
                subtitle="Today, 10:23AM"
                amount={index === 1 ? "₦15,000" : index === 2 ? "₦5100" : "₦4500"}
                icon={<EarningLocationMarkerIcon />}
                onPress={() => goTo("/(driver)/ride-details")}
                bordered={index < 2}
              />
            ))}
          </View>

          <SectionTitle title="Recent Transactions" onViewAll={() => goTo("/(driver)/wallet")} />
          <View className="rounded-[10px] px-3 py-2" style={{ backgroundColor: CARD }}>
            {transactions.slice(0, 3).map((item, index) => (
              <ListRow
                key={item.id}
                title={item.title}
                subtitle={item.time}
                amount={item.amount}
                icon={item.type === "received" ? <EarningTransactionRideIcon /> : <EarningWithdrawalArrowIcon />}
                iconColor={item.type === "received" ? AUTH_GREEN : "#E80038"}
                bordered={index < 2}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function QuickAction({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: ReactNode;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.84} onPress={onPress} className="items-center">
      <SvgIconTile>{icon}</SvgIconTile>
      <Text className="mt-3 text-[11px] text-white">{label}</Text>
    </TouchableOpacity>
  );
}

function MetricCard({
  icon,
  iconColor = AUTH_GREEN,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap | ReactNode;
  iconColor?: string;
  label: string;
  value: string;
}) {
  return (
    <View className="min-h-[126px] flex-1 rounded-[8px] p-3" style={{ backgroundColor: CARD }}>
      {typeof icon === "string" ? <IconTile icon={icon} color={iconColor} /> : <SvgIconTile>{icon}</SvgIconTile>}
      <Text className="mt-4 text-[12px] text-[#B7B7B7]">{label}</Text>
      <Text className="mt-4 text-[22px] font-bold text-white">{value}</Text>
    </View>
  );
}

function SectionTitle({ title, onViewAll }: { title: string; onViewAll: () => void }) {
  return (
    <View className="mb-4 mt-8 flex-row items-center justify-between">
      <Text className="text-[18px] font-semibold text-white">{title}</Text>
      <TouchableOpacity activeOpacity={0.84} onPress={onViewAll}>
        <Text className="text-[16px] font-semibold" style={{ color: AUTH_GREEN }}>View all</Text>
      </TouchableOpacity>
    </View>
  );
}

function ListRow({
  title,
  subtitle,
  amount,
  icon,
  iconColor = AUTH_GREEN,
  bordered = true,
  onPress,
}: {
  title: string;
  subtitle: string;
  amount: string;
  icon: keyof typeof Ionicons.glyphMap | ReactNode;
  iconColor?: string;
  bordered?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.84} onPress={onPress} className="py-4">
      <View className="flex-row items-center">
        {typeof icon === "string" ? <IconTile icon={icon} color={iconColor} /> : <SvgIconTile>{icon}</SvgIconTile>}
        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-semibold text-white">{title}</Text>
          <Text className="mt-1 text-[13px] text-[#A0A0A0]">{subtitle}</Text>
        </View>
        <Text className="text-[17px] font-semibold text-white">{amount}</Text>
      </View>
      {bordered ? <View className="ml-[52px] mt-4 h-px" style={{ backgroundColor: LINE }} /> : null}
    </TouchableOpacity>
  );
}

export function DriverRideEarningScreen() {
  return (
    <Page>
      <Header title="Ride Earning" />
      <TouchableOpacity className="h-[44px] w-[225px] flex-row items-center rounded-[10px] border border-[#333333] px-3">
        <EarningCalendarIcon />
        <Text className="ml-3 text-[15px] text-white">1 Jan, 2025 - 7 Jan, 2025</Text>
      </TouchableOpacity>

      <View className="mt-6 flex-row gap-4">
        <View className="min-h-[132px] flex-1 rounded-[10px] p-3" style={{ backgroundColor: ORANGE }}>
          <Text className="text-[14px] text-white">Total Earnings</Text>
          <Text className="mt-5 text-[22px] font-bold text-white">₦125,400</Text>
          <View className="mt-4 self-start rounded-[3px] bg-[#C8F5C8] px-2 py-1">
            <Text className="text-[12px] font-semibold text-[#107A34]">↗ +12%</Text>
          </View>
        </View>
        <View className="min-h-[132px] flex-1 rounded-[10px] p-3" style={{ backgroundColor: PURPLE }}>
          <Text className="text-[14px] text-white">Total Rides</Text>
          <Text className="mt-5 text-[22px] font-bold text-white">24</Text>
          <View className="mt-4 self-start rounded-[3px] bg-[#C8F5C8] px-2 py-1">
            <Text className="text-[12px] font-semibold text-[#107A34]">Active</Text>
          </View>
        </View>
      </View>

      <Text className="mb-5 mt-8 text-[18px] font-semibold text-white">Recent rides</Text>
      {rides.map((ride) => (
        <RideCard key={ride.id} method={ride.method} methodColor={ride.color} onPress={() => goTo("/(driver)/ride-details")} />
      ))}
    </Page>
  );
}

function RideCard({
  method,
  methodColor,
  onPress,
}: {
  method: string;
  methodColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} className="mb-7 rounded-[10px] p-3" style={{ backgroundColor: CARD }}>
      <View className="flex-row items-center">
        <SvgIconTile>
          <EarningTransactionRideIcon />
        </SvgIconTile>
        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-semibold text-white">{method === "Wallet" ? "Today, 10:23 AM" : "Yesterday, 4:15 PM"}</Text>
          <Text className="mt-1 text-[13px] text-[#909090]">Ride #88291</Text>
        </View>
        <View className="flex-row items-center rounded-[4px] px-2 py-1" style={{ backgroundColor: methodColor }}>
          <Ionicons name={method === "Wallet" ? "wallet" : method === "Transfer" ? "business" : "cash"} size={14} color={method === "Cash" ? "#D76500" : method === "Transfer" ? "#1E26D6" : "#167A31"} />
          <Text className="ml-1 text-[12px] font-semibold" style={{ color: method === "Cash" ? "#D76500" : method === "Transfer" ? "#1E26D6" : "#167A31" }}>{method}</Text>
        </View>
      </View>
      <View className="my-5 h-px" style={{ backgroundColor: LINE }} />
      <RouteSummary
        pickup="14 Adeola Odeku St, Victoria Island, Lagos"
        destination="Lekki Conservation Center"
      />
      <View className="my-5 h-px" style={{ backgroundColor: LINE }} />
      <View className="flex-row justify-between">
        <AmountBlock label="Total Fare" value="₦6500" />
        <AmountBlock label="Commission" value="₦1500" />
        <AmountBlock label="Net Earnings" value="₦5000" alignRight />
      </View>
    </TouchableOpacity>
  );
}

function RouteSummary({
  pickup,
  stop,
  destination,
}: {
  pickup: string;
  stop?: string;
  destination: string;
}) {
  return (
    <View className="flex-row">
      <View className="mr-4 items-center rounded-full bg-[#2FC52726]">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#27FF9E]">
          <TripSummaryPolygon />
        </View>
        <TripSummaryRouteConnector />
        {stop ? (
          <>
            <View className="h-7 w-7 items-center justify-center rounded-full">
              <TripSummaryDestinationMarker />
            </View>
            <TripSummaryRouteConnector />
          </>
        ) : null}
        <View className="h-7 w-7 items-center justify-center rounded-full">
          <TripSummaryDestinationMarker />
        </View>
      </View>
      <View className="flex-1">
        <Text className="text-[17px] font-semibold text-white">Pickup</Text>
        <Text className="mt-2 text-[13px] text-white" numberOfLines={2}>
          {pickup}
        </Text>
        {stop ? (
          <>
            <View className="my-4 h-px bg-[#383838]" />
            <Text className="text-[17px] font-semibold text-white">Stop 1</Text>
            <Text className="mt-2 text-[13px] text-white" numberOfLines={2}>
              {stop}
            </Text>
          </>
        ) : null}
        <View className={stop ? "my-4 h-px bg-[#383838]" : "mt-7"} />
        <Text className="text-[17px] font-semibold text-white">Dropoff</Text>
        <Text className="mt-2 text-[13px] text-white" numberOfLines={2}>
          {destination}
        </Text>
      </View>
    </View>
  );
}

function AmountBlock({ label, value, alignRight = false }: { label: string; value: string; alignRight?: boolean }) {
  return (
    <View className={alignRight ? "items-end" : ""}>
      <Text className="text-[13px] text-[#9A9A9A]">{label}</Text>
      <Text className="mt-3 text-[17px] font-semibold text-white">{value}</Text>
    </View>
  );
}

export function DriverRideHistoryScreen() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <DriverSideDrawer visible={showDrawer} onClose={() => setShowDrawer(false)} />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34 }}
        >
          <Header title="Ride History" menu onMenu={() => setShowDrawer(true)} />

          <View className="h-[86px] flex-row items-center justify-around rounded-[8px] border border-[#2D2D2D] bg-[#111111]">
            <HistoryStat label="Completed" value="9" />
            <View className="h-4 w-px bg-[#4B4B4B]" />
            <HistoryStat label="Cancelled" value="3" />
            <View className="h-4 w-px bg-[#4B4B4B]" />
            <HistoryStat label="Total rides" value="3" />
          </View>

          <TouchableOpacity
            activeOpacity={0.84}
            onPress={() => setShowMonthPicker(true)}
            className="mt-9 flex-row items-center self-start"
          >
            <Text className="text-[17px] font-semibold text-white">Jun 2025</Text>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" style={{ marginLeft: 10 }} />
          </TouchableOpacity>

          <View className="mt-8">
            {rideHistory.map((ride) => (
              <HistoryRideCard
                key={ride.id}
                ride={ride}
                onPress={() => goTo("/(driver)/ride-history-details", { id: ride.id })}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <MonthPickerSheet visible={showMonthPicker} onClose={() => setShowMonthPicker(false)} />
    </View>
  );
}

function HistoryStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center">
      <Text className="text-[13px] text-[#A0A0A0]">{label}</Text>
      <Text className="mt-2 text-[25px] font-medium text-white">{value}</Text>
    </View>
  );
}

function HistoryStatusPill({ status }: { status: string }) {
  const completed = status === "Completed";

  return (
    <View className="rounded-[4px] px-2 py-1" style={{ backgroundColor: completed ? "#D7F6DB" : "#FFD8DE" }}>
      <Text className="text-[12px] font-semibold" style={{ color: completed ? "#188230" : "#9E1E2C" }}>{status}</Text>
    </View>
  );
}

function HistoryRideCard({
  ride,
  onPress,
}: {
  ride: (typeof rideHistory)[number];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} className="mb-6 rounded-[10px] p-3" style={{ backgroundColor: CARD }}>
      <View className="flex-row items-center">
        <SvgIconTile>
          <EarningTransactionRideIcon />
        </SvgIconTile>
        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-semibold text-white">Yesterday, 4:15 PM</Text>
          <Text className="mt-1 text-[13px] text-[#909090]">Ride #88291</Text>
        </View>
        <HistoryStatusPill status={ride.status} />
      </View>
      <View className="my-5 h-px" style={{ backgroundColor: LINE }} />
      <RouteSummary
        pickup="14 Adeola Odeku St, Victoria Island, Lagos"
        stop={ride.stop}
        destination="Lekki Conservation Center"
      />
      <View className="my-5 h-px" style={{ backgroundColor: LINE }} />
      <View className="flex-row justify-between">
        <AmountBlock label="Total Fare" value={ride.totalFare} />
        <AmountBlock label="Commission" value="₦1500" />
        <AmountBlock label="Net Earnings" value={ride.netEarnings} alignRight />
      </View>
    </TouchableOpacity>
  );
}

function MonthPickerSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/45" onPress={onClose}>
        <Pressable
          className="rounded-t-[24px] px-5 pt-4"
          style={{ backgroundColor: CARD, paddingBottom: insets.bottom + 24 }}
        >
          <View className="mb-7 h-1 w-14 self-center rounded-full bg-white" />
          <Text className="text-center text-[16px] text-white">Select Month</Text>
          <View className="mt-7 h-px bg-[#303030]" />
          <View className="h-[128px] items-center justify-center">
            <View className="flex-row items-center">
              <View className="w-[130px] items-center">
                <Text className="text-[13px] font-semibold uppercase text-[#4E4E4E]">February</Text>
                <Text className="mt-6 text-[16px] font-medium uppercase text-white">March</Text>
                <Text className="mt-6 text-[13px] font-semibold uppercase text-[#4E4E4E]">April</Text>
              </View>
              <View className="w-[130px] items-center">
                <Text className="text-[13px] font-semibold text-[#4E4E4E]">2024</Text>
                <Text className="mt-6 text-[16px] font-medium text-white">2025</Text>
                <Text className="mt-6 text-[13px] font-semibold text-[#4E4E4E]">2026</Text>
              </View>
            </View>
          </View>
          <View className="mb-7 h-px bg-[#303030]" />
          <TouchableOpacity activeOpacity={0.84} onPress={onClose} className="h-[58px] items-center justify-center rounded-full" style={{ backgroundColor: AUTH_GREEN }}>
            <Text className="text-[16px] font-medium text-[#050505]">Confirm</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DriverRideHistoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const ride = rideHistory.find((item) => item.id === id) ?? rideHistory[0];
  const tripFare = ride.id === "multi-stop" ? "₦10,000" : "₦3,500";
  const netEarnings = ride.id === "multi-stop" ? "₦8,400" : "₦3,000";

  return (
    <Page>
      <Header title="Ride History" />
      <View className="rounded-[8px] p-5" style={{ backgroundColor: CARD }}>
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-[15px] text-[#B0B0B0]">Your earnings</Text>
            <Text className="mt-4 text-[34px] font-bold text-white">{ride.detailsEarning}</Text>
            <Text className="mt-4 text-[14px] text-[#9A9A9A]">Yesterday, 4:15 PM</Text>
          </View>
          <HistoryStatusPill status={ride.status} />
        </View>
      </View>

      <Text className="mt-9 text-[21px] font-semibold text-white">Dropoff Locations</Text>
      <View className="mt-4 rounded-[8px] p-4" style={{ backgroundColor: CARD }}>
        <RouteSummary
          pickup="14 Adeola Odeku St, Victoria Island, Lagos"
          stop={ride.stop}
          destination="Lekki Conservation Center"
        />
      </View>

      <View className="mt-8 rounded-[8px] p-4" style={{ backgroundColor: CARD }}>
        <DetailRow label="Date and Time" value="Mon, 14th Nov, 2026" secondary="12:30pm" />
        <DetailRow label="Vehicle" value="Toyota Camry" secondary="AS23XZ  •  Blue" />
        <DetailRow label="Rider" value="Ebuka Johnson" />
        <DetailRow label="Passenger" value="Kelivin Uche" />
        <DetailRow label="Distance" value="1.5KM" />
        <DetailRow label="Duration" value="00h 30m" />
        <DetailRow label="Ride Category" value="Standard" />
        <DetailRow label="Trip Fare" value={tripFare} />
        <DetailRow label="Payment Method" value="Wallet" />
        <DetailRow label="Status" value="Paid" badge last />
      </View>

      <Text className="mt-8 text-[21px] font-semibold text-white">Your Earnings</Text>
      <View className="mt-5 rounded-[8px] p-4" style={{ backgroundColor: CARD }}>
        <FareRow label="Trip Fare" value={tripFare} />
        <FareRow label="Platform commission" value="-₦1,500" danger />
        <FareRow label="Tax/Levies" value="-₦100" danger />
        <View className="my-5 h-px" style={{ backgroundColor: LINE }} />
        <FareRow label="Net Earnings" value={netEarnings} total />
      </View>
    </Page>
  );
}

function DetailRow({
  label,
  value,
  secondary,
  badge = false,
  last = false,
}: {
  label: string;
  value: string;
  secondary?: string;
  badge?: boolean;
  last?: boolean;
}) {
  return (
    <View>
      <View className="flex-row items-start justify-between py-3">
        <Text className="text-[15px] text-[#919191]">{label}</Text>
        <View className="items-end">
          {badge ? (
            <View className="rounded-[4px] bg-[#123F18] px-2 py-1">
              <Text className="text-[13px] font-semibold text-[#27FF9E]">{value}</Text>
            </View>
          ) : (
            <Text className="text-right text-[15px] text-white">{value}</Text>
          )}
          {secondary ? <Text className="mt-2 text-right text-[14px] text-[#949494]">{secondary}</Text> : null}
        </View>
      </View>
      {!last ? <View className="h-px" style={{ backgroundColor: LINE }} /> : null}
    </View>
  );
}

export function DriverRiderProfileScreen() {
  const [showActions, setShowActions] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48 }}
        >
          <View className="relative min-h-12 items-center justify-center">
            <TouchableOpacity activeOpacity={0.84} onPress={() => router.back()} className="absolute left-0 h-12 w-12 items-center justify-center">
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-[21px] font-semibold text-white">Rider Profile</Text>
            <TouchableOpacity activeOpacity={0.84} onPress={() => setShowActions(true)} className="absolute right-0 h-12 w-12 items-center justify-center">
              <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View className="mt-14 items-center">
            <View className="h-[88px] w-[88px] overflow-hidden rounded-full bg-[#241F1D]">
              <Image source={RIDER_AVATAR} style={{ width: 88, height: 88 }} contentFit="cover" />
            </View>
            <View className="mt-5 flex-row items-center">
              <Text className="text-[22px] font-semibold text-white">Michael A.</Text>
              <View className="ml-3">
                <RiderVerifiedBadgeIcon />
              </View>
            </View>
            <View className="mt-3 flex-row items-center">
              <RideDetailsRatingStarIcon />
              <Text className="ml-2 text-[15px] text-[#B8B8B8]">4.5</Text>
            </View>
          </View>

          <View className="mt-8 flex-row gap-3">
            <TouchableOpacity activeOpacity={0.84} onPress={() => router.push("/(driver)/chat")} className="h-12 flex-1 flex-row items-center justify-center rounded-full" style={{ backgroundColor: CARD }}>
              <Ionicons name="chatbubble-ellipses-outline" size={21} color={AUTH_GREEN} />
              <Text className="ml-2 text-[16px] text-white">Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.84} onPress={() => router.push("/(driver)/call")} className="h-12 flex-1 flex-row items-center justify-center rounded-full bg-[#9C9C9C]">
              <Ionicons name="call" size={18} color="#323232" />
              <Text className="ml-2 text-[16px] text-[#222222]">Call</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 flex-row gap-4">
            <ProfileMetric label="Rides Taken" value="20" />
            <ProfileMetric label="Joined" value="2022" />
            <ProfileMetric label="Cancel Rate" value="2%" />
          </View>

          <Text className="mt-8 text-[18px] font-semibold text-white">Rating</Text>
          <View className="mt-5 flex-row items-center">
            <View className="w-[100px] items-center">
              <Text className="text-[37px] font-bold text-white">4.5</Text>
              <View className="mt-3 flex-row">
                {Array.from({ length: 5 }).map((_, index) => (
                  <View key={index} className={index === 0 ? "" : "ml-1"}>
                    <RideDetailsRatingStarIcon />
                  </View>
                ))}
              </View>
              <Text className="mt-3 text-[11px] uppercase text-[#A1A1A1]">Avg.Rating</Text>
            </View>
            <View className="ml-5 flex-1">
              <RatingDistributionRow rating="5" percent="30%" width="30%" />
              <RatingDistributionRow rating="4" percent="90%" width="86%" />
              <RatingDistributionRow rating="3" percent="20%" width="22%" />
              <RatingDistributionRow rating="2" percent="15%" width="15%" />
              <RatingDistributionRow rating="1" percent="1%" width="5%" />
            </View>
          </View>

          <View className="mt-9 flex-row items-center rounded-[7px] bg-[#181607] px-5 py-3">
            <Ionicons name="lock-closed" size={14} color="#FFD400" />
            <Text className="ml-4 flex-1 text-[11px] font-semibold leading-4 text-[#FFD400]">
              For your safety, all calls and chats are recorded for service quality and dispute resolution.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <RiderProfileActionSheet visible={showActions} onClose={() => setShowActions(false)} />
    </View>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <View className="h-[75px] flex-1 items-center justify-center rounded-[7px]" style={{ backgroundColor: CARD }}>
      <Text className="text-[12px] text-[#777777]">{label}</Text>
      <Text className="mt-3 text-[22px] font-semibold text-white">{value}</Text>
    </View>
  );
}

function RatingDistributionRow({ rating, percent, width }: { rating: string; percent: string; width: string }) {
  return (
    <View className="mb-4 flex-row items-center">
      <RideDetailsRatingStarIcon />
      <Text className="ml-2 w-4 text-[15px] text-white">{rating}</Text>
      <View className="mx-3 h-2 flex-1 overflow-hidden rounded-full bg-[#4A4A4A]">
        <View className="h-full rounded-full" style={{ width, backgroundColor: AUTH_GREEN }} />
      </View>
      <Text className="w-9 text-right text-[14px] text-[#CFCFCF]">{percent}</Text>
    </View>
  );
}

function RiderProfileActionSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/45" onPress={onClose}>
        <Pressable className="rounded-t-[24px] px-5 pt-4" style={{ backgroundColor: BG, paddingBottom: insets.bottom + 24 }}>
          <View className="mb-16 h-1 w-14 self-center rounded-full bg-white" />
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={() => {
              onClose();
              goTo("/(driver)/report-rider");
            }}
            className="mb-10 flex-row items-center"
          >
            <ReportRiderFlagIcon />
            <Text className="ml-4 text-[20px] font-semibold text-[#FFD400]">Report rider</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.84} onPress={onClose} className="mb-14 flex-row items-center">
            <BlockRiderIcon />
            <Text className="ml-4 text-[20px] font-semibold text-[#FF001D]">Block Rider</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.84} onPress={onClose} className="h-[58px] items-center justify-center rounded-full border border-[#8C8C8C]">
            <Text className="text-[17px] font-semibold text-white">Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const RIDER_REPORT_OPTIONS = [
  "Rider was rude or disrespectful",
  "Rider made me feel unsafe",
  "Rider refused to pay",
  "Rider requested an off app ride",
  "Rider damaged my vehicle",
  "Rider had an inappropriate behavior",
];

export function DriverReportRiderScreen() {
  const insets = useSafeAreaInsets();
  const [selectedIssue, setSelectedIssue] = useState(RIDER_REPORT_OPTIONS[0]);
  const [details, setDetails] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();

  const handleAddEvidence = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 36 }}
        >
          <Header title="Report Rider" />
          <Text className="text-[14px] leading-5 text-[#9D9D9D]">Tell us what happened so we can review the situation and improve safety for everyone.</Text>
          <Text className="mt-7 text-[17px] font-semibold text-white">What issue did you experience</Text>

          <View className="mt-8">
            {RIDER_REPORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                activeOpacity={0.84}
                onPress={() => setSelectedIssue(option)}
                className="mb-5 h-[54px] flex-row items-center rounded-[7px] border px-4"
                style={{
                  backgroundColor: CARD,
                  borderColor: selectedIssue === option ? AUTH_GREEN : CARD,
                }}
              >
                <View className="h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: selectedIssue === option ? AUTH_GREEN : "#A1A1A1" }}>
                  {selectedIssue === option ? <View className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: AUTH_GREEN }} /> : null}
                </View>
                <Text className="ml-3 text-[16px] text-white">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="mt-4 text-[16px] text-white">Add more details</Text>
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Describe what happened"
            placeholderTextColor="#777777"
            multiline
            textAlignVertical="top"
            className="mt-4 min-h-[142px] rounded-[7px] border border-[#343434] px-4 py-4 text-[14px] text-white"
          />

          <Text className="mt-7 text-[16px] text-white">Upload evidence <Text className="text-[#858585]">(optional)</Text></Text>
          <View className="mt-4">
            <DriverUploadCard
              imageUri={imageUri}
              onAdd={handleAddEvidence}
              helperText="Upload at least 1 picture of either not less than 10MB"
            />
          </View>

          <TouchableOpacity activeOpacity={0.84} onPress={() => router.back()} className="mt-16 h-[58px] items-center justify-center rounded-full" style={{ backgroundColor: AUTH_GREEN }}>
            <Text className="text-[16px] font-medium text-[#050505]">Submit report</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export function DriverRideDetailsScreen() {
  const { activeRide } = useDriverMockState();
  const ride = activeRide ?? rideDetailsRide;

  return (
    <Page>
      <Header title="Ride Details" />
      <Text className="mb-8 text-[16px] leading-6 text-white">View complete financial breakdown and trip information.</Text>
      <View className="h-[182px] overflow-hidden rounded-[8px] border border-[#303030] bg-[#111111]">
        <DriverTripPreviewMap request={ride} />
      </View>
      <View className="mt-4">
        <DriverRoutePreviewCard request={ride} />
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
              secondary: "AS23XZ  ·  Blue",
            },
            {
              label: "Rider",
              value: ride.riderName,
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
              value: ride.rideType.replace(" ride", ""),
            },
            {
              label: "Trip Fare",
              value: formatDriverPaymentAmount(ride.fare),
            },
            {
              label: "Payment Method",
              value: "Wallet",
            },
          ]}
        />
      </View>
      <Text className="mt-7 text-[18px] font-semibold text-white">Passenger Details</Text>
      <View className="mt-5 flex-row items-center rounded-[6px] p-4" style={{ backgroundColor: CARD }}>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#C78039]">
          <DriverPassengerAvatar name="Jane Anigbo" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-semibold text-white">Jane Anigbo</Text>
          <View className="mt-1 flex-row items-center">
            <RideDetailsRatingStarIcon />
            <Text className="ml-1 text-[12px] text-white">4.5  ·  10 rides</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.84} onPress={() => goTo("/(driver)/rider-profile")}>
          <Text className="text-[15px] font-semibold" style={{ color: AUTH_GREEN }}>View profile</Text>
        </TouchableOpacity>
      </View>
      <Text className="mt-8 text-[18px] font-semibold text-white">Fare breakdown</Text>
      <View className="mt-5 rounded-[8px] p-4" style={{ backgroundColor: CARD }}>
        <FareRow label="Trip Fare" value="₦3,500" />
        <FareRow label="Platform commission" value="-₦1,500" danger />
        <FareRow label="Tax/Levies" value="-₦100" danger />
        <View className="my-5 h-px" style={{ backgroundColor: LINE }} />
        <FareRow label="Net Earnings" value="₦3,000" total />
      </View>
      <TouchableOpacity className="mt-12 h-[58px] flex-row items-center justify-center rounded-full bg-white">
        <Text className="mr-4 text-[16px] font-medium text-[#090909]">Download receipt</Text>
        <Ionicons name="download-outline" size={22} color="#090909" />
      </TouchableOpacity>
    </Page>
  );
}

function FareRow({ label, value, danger = false, total = false }: { label: string; value: string; danger?: boolean; total?: boolean }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className={`${total ? "text-[15px] font-semibold text-white" : "text-[15px] text-[#9C9C9C]"}`}>{label}</Text>
      <Text className={`${total ? "text-[23px] font-bold text-white" : "text-[15px]"}`} style={{ color: danger ? "#D20A3A" : "#FFFFFF" }}>{value}</Text>
    </View>
  );
}

export function DriverWalletScreen() {
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState("All transactions");
  const visibleTransactions = useMemo(() => {
    if (sort === "Only Received") {
      return transactions.filter((item) => item.type === "received");
    }
    if (sort === "Only Withdrawn") {
      return transactions.filter((item) => item.type === "withdrawn");
    }
    return transactions;
  }, [sort]);

  return (
    <Page>
      <Header title="Wallet" />
      <View className="rounded-[8px] p-4" style={{ backgroundColor: "#4530B8" }}>
        <Text className="text-[15px] text-[#CFCBFF]">Balance</Text>
        <Text className="mt-7 text-[36px] font-bold text-white">₦125,400</Text>
        <TouchableOpacity
          activeOpacity={0.84}
          onPress={() => goTo("/(driver)/withdraw-earnings")}
          className="mt-12 h-[50px] flex-row items-center justify-center rounded-full bg-white"
        >
          <WithdrawBankIcon />
          <Text className="ml-3 text-[15px] font-semibold text-[#050505]">Withdraw</Text>
        </TouchableOpacity>
      </View>
      <View className="mb-7 mt-14 flex-row items-center justify-between">
        <Text className="text-[18px] font-semibold text-white">Recent Transactions</Text>
        <TouchableOpacity
          activeOpacity={0.84}
          onPress={() => setShowSort(true)}
          className="h-10 flex-row items-center rounded-full border border-[#6A6A6A] px-3"
        >
          <Text className="mr-2 text-[15px] text-white">Sort by</Text>
          <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View className="px-1">
        {visibleTransactions.map((item, index) => (
          <ListRow
            key={item.id}
            title={item.title}
            subtitle={item.time}
            amount={item.amount}
            icon={item.type === "received" ? <EarningTransactionRideIcon /> : <EarningWithdrawalArrowIcon />}
            iconColor={item.type === "received" ? AUTH_GREEN : "#E80038"}
            bordered={index < visibleTransactions.length - 1}
          />
        ))}
      </View>
      <SortSheet visible={showSort} value={sort} onSelect={setSort} onClose={() => setShowSort(false)} />
    </Page>
  );
}

function SortSheet({
  visible,
  value,
  onSelect,
  onClose,
}: {
  visible: boolean;
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const options = ["All transactions", "Only Received", "Only Withdrawn"];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/45" onPress={onClose}>
        <Pressable
          className="rounded-t-[24px] px-5 pt-3"
          style={{ backgroundColor: CARD, paddingBottom: insets.bottom + 24 }}
        >
          <View className="mb-5 h-1 w-14 self-center rounded-full bg-white" />
          <Text className="mb-6 text-[24px] font-bold text-white">Sort by</Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option}
              activeOpacity={0.84}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
              className="flex-row items-center justify-between py-4"
            >
              <Text className="text-[16px] text-white">{option}</Text>
              {value === option ? <Ionicons name="checkmark" size={23} color={AUTH_GREEN} /> : null}
              {index < options.length - 1 ? <View className="absolute bottom-0 left-0 right-0 h-px bg-[#353535]" /> : null}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DriverWithdrawEarningsScreen() {
  const inputRef = useRef<TextInput>(null);
  const [amount, setAmount] = useState("");
  const canContinue = amount.length > 0;

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <Pressable className="flex-1 px-5 pt-3" onPress={() => inputRef.current?.focus()}>
          <Header title="Withdraw Earnings" />
          <View className="min-h-[150px] rounded-[8px] border border-[#333333] p-4" style={{ backgroundColor: CARD }}>
            <Text className="text-[15px] text-[#777777]">Enter Amount</Text>
            <View className="mt-8 flex-row items-center">
              <Text className="mr-2 text-[22px] font-bold text-[#343434]">₦</Text>
              <TextInput
                ref={inputRef}
                value={amount}
                onChangeText={(value) => setAmount(value.replace(/\D/g, ""))}
                keyboardType="number-pad"
                placeholder="0.00"
                placeholderTextColor="#343434"
                className="flex-1 text-[34px] font-bold text-white"
              />
            </View>
          </View>
          <View className="mt-5 flex-row items-center">
            <Ionicons name="alert-circle-outline" size={18} color="#B7B7B7" />
            <Text className="ml-2 text-[15px] text-[#B7B7B7]">A 1.5% processing fee applies</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-8">
            {["₦2,000", "₦5,000", "₦10,000", "₦20,000"].map((chip) => (
              <TouchableOpacity
                key={chip}
                activeOpacity={0.84}
                onPress={() => setAmount(chip.replace(/\D/g, ""))}
                className="mr-3 h-11 items-center justify-center rounded-[10px] bg-[#191919] px-7"
              >
                <Text className="text-[15px] font-semibold text-white">{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View className="mt-auto pb-[34px]">
            <TouchableOpacity
              activeOpacity={0.84}
              disabled={!canContinue}
              onPress={() => goTo("/(driver)/bank-destination", { amount })}
              className="h-[58px] items-center justify-center rounded-full"
              style={{ backgroundColor: canContinue ? AUTH_GREEN : "#24583A" }}
            >
              <Text className="text-[16px] font-medium text-[#050505]">Next</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

export function DriverBankDestinationScreen() {
  const { amount } = useLocalSearchParams<{ amount?: string }>();
  const [selectedBank, setSelectedBank] = useState("gtbank");
  const [menuBank, setMenuBank] = useState<string | null>(null);
  const [showAddAccount, setShowAddAccount] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-5 pt-3">
          <Header title="Bank Destination" />
          {banks.map((bank) => (
            <TouchableOpacity
              key={bank.id}
              activeOpacity={0.84}
              onPress={() => setSelectedBank(bank.id)}
              className="mb-8 flex-row items-center rounded-[8px] border p-3"
              style={{
                backgroundColor: CARD,
                borderColor: selectedBank === bank.id ? AUTH_GREEN : CARD,
              }}
            >
              <IconTile icon="wallet" color="#FF9700" />
              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text className="text-[16px] font-semibold text-white">{bank.name}</Text>
                  {bank.isDefault ? (
                    <View className="ml-4 rounded-[2px] bg-[#0C4E20] px-2 py-0.5">
                      <Text className="text-[10px] font-semibold" style={{ color: AUTH_GREEN }}>Default</Text>
                    </View>
                  ) : null}
                </View>
                <Text className="mt-1 text-[12px] text-[#A2A2A2]">Savings --- {bank.suffix}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.84} onPress={() => setMenuBank(menuBank === bank.id ? null : bank.id)} className="h-8 w-8 items-center justify-center">
                <Ionicons name="ellipsis-vertical" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              {menuBank === bank.id ? (
                <TouchableOpacity
                  activeOpacity={0.84}
                  onPress={() => setMenuBank(null)}
                  className="absolute right-2 top-12 rounded-[5px] bg-[#2A2A2A] px-5 py-4"
                >
                  <Text className="text-[14px] font-semibold text-white">Remove</Text>
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={() => setShowAddAccount(true)}
            className="h-[68px] flex-row items-center rounded-[8px] border border-dashed px-3"
            style={{ borderColor: AUTH_GREEN, backgroundColor: CARD }}
          >
            <IconTile icon="add" color={AUTH_GREEN} />
            <Text className="ml-3 text-[15px] font-semibold" style={{ color: AUTH_GREEN }}>Add new bank account</Text>
          </TouchableOpacity>
          <View className="mt-auto pb-[28px]">
            <TouchableOpacity
              activeOpacity={0.84}
              onPress={() => goTo("/(driver)/withdrawal-transaction-pin", { amount: amount ?? "" })}
              className="h-[58px] items-center justify-center rounded-full"
              style={{ backgroundColor: AUTH_GREEN }}
            >
              <Text className="text-[16px] font-medium text-[#050505]">Request withdrawal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <AddAccountSheet visible={showAddAccount} onClose={() => setShowAddAccount(false)} />
    </View>
  );
}

function AddAccountSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const hasAccount = accountNumber.length > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/45" onPress={onClose}>
        <Pressable
          className="rounded-t-[24px] px-5 pt-3"
          style={{ backgroundColor: CARD, paddingBottom: insets.bottom + 24 }}
        >
          <View className="mb-6 h-1 w-14 self-center rounded-full bg-white" />
          <Text className="text-[22px] font-bold text-white">Add bank account</Text>
          <Text className="mt-8 text-[15px] font-semibold text-white">Bank</Text>
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={() => setBank(bank ? "" : "Opay NG")}
            className="mt-3 h-[50px] flex-row items-center rounded-[14px] border border-[#333333] px-3"
          >
            <Text className="flex-1 text-[14px]" style={{ color: bank ? "#FFFFFF" : "#666666" }}>{bank || "Select bank"}</Text>
            <Ionicons name="chevron-down" size={18} color="#9C9C9C" />
          </TouchableOpacity>
          <Text className="mt-6 text-[15px] font-semibold text-white">Account number</Text>
          <TextInput
            value={accountNumber}
            onChangeText={(value) => {
              setBank("Opay NG");
              setAccountNumber(value.replace(/\D/g, "").slice(0, 10));
            }}
            keyboardType="number-pad"
            placeholder="Account number"
            placeholderTextColor="#666666"
            className="mt-3 h-[50px] rounded-[14px] border px-3 text-white"
            style={{ borderColor: hasAccount ? AUTH_GREEN : "#333333" }}
          />
          {hasAccount ? (
            <>
              <Text className="mt-6 text-[15px] font-semibold text-white">Account name</Text>
              <View className="mt-3 h-[50px] justify-center rounded-[14px] bg-[#191919] px-3">
                <Text className="text-[14px] text-white">Onyebuchi Pascal</Text>
              </View>
            </>
          ) : null}
          <TouchableOpacity activeOpacity={0.84} onPress={onClose} className="mt-10 h-[58px] items-center justify-center rounded-full" style={{ backgroundColor: AUTH_GREEN }}>
            <Text className="text-[16px] font-medium text-[#050505]">Add account number</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.84} onPress={onClose} className="mt-4 h-[58px] items-center justify-center rounded-full border border-[#868686]">
            <Text className="text-[16px] font-semibold text-white">Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DriverWithdrawalTransactionPinScreen() {
  const inputRef = useRef<TextInput>(null);
  const [pin, setPin] = useState("");
  const canConfirm = pin.length === 4;

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <Pressable className="flex-1 px-5 pt-3" onPress={() => inputRef.current?.focus()}>
            <Header title="Transaction Pin" />
            <Text className="text-[16px] leading-6 text-[#CFCFCF]">Please, enter your four digit pin to continue{"\n"}with the withdrawal</Text>
            <View className="mt-[58px] items-center">
              <View className="flex-row gap-3">
                {Array.from({ length: 4 }).map((_, index) => {
                  const isFilled = index < pin.length;
                  const isActive = index === pin.length && pin.length < 4;

                  return (
                    <View
                      key={index}
                      className="h-[50px] w-[50px] items-center justify-center rounded-[3px]"
                      style={{
                        backgroundColor: isFilled ? "#151313" : "transparent",
                        borderWidth: isFilled ? 0 : 1,
                        borderColor: isActive ? AUTH_GREEN : "#3F3F3F",
                      }}
                    >
                      {isFilled ? <Text className="text-[20px] font-semibold text-white">*</Text> : null}
                    </View>
                  );
                })}
              </View>
            </View>
            <TextInput
              ref={inputRef}
              value={pin}
              onChangeText={(value) => setPin(value.replace(/\D/g, "").slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
              caretHidden
              className="absolute h-px w-px opacity-0"
            />
            <View className="mt-auto pb-[34px]">
              <TouchableOpacity
                activeOpacity={0.84}
                disabled={!canConfirm}
                onPress={() => router.replace("/(driver)/withdrawal-success")}
                className="h-[58px] items-center justify-center rounded-full"
                style={{ backgroundColor: canConfirm ? AUTH_GREEN : "#A9A9A9" }}
              >
                <Text className="text-[16px] font-medium text-[#050505]">Confirm</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

export function DriverWithdrawalSuccessScreen() {
  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center px-5 pt-[90px]">
          <WithdrawalSuccessBadgeIcon />
          <Text className="mt-14 text-center text-[22px] font-bold text-white">Withdrawal Request Received</Text>
          <Text className="mt-5 max-w-[315px] text-center text-[16px] leading-6 text-[#C9C9C9]">
            Your withdrawal is being processed and may take a few hours or a few days to reach your bank. You&apos;ll be notified once the transfer is complete.
          </Text>
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={() => router.replace("/(driver)/home")}
            className="mt-auto mb-14 h-[58px] w-full items-center justify-center rounded-full"
            style={{ backgroundColor: AUTH_GREEN }}
          >
            <Text className="text-[16px] font-medium text-[#050505]">Go back to home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
