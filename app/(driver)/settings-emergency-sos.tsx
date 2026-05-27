import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import {
  useDriverEmergencyStore,
  type EmergencyContactOption,
  type ManagedEmergencyContact,
} from "@/app/(driver)/state/driver-emergency";
import RecordDiscard from "@/assets/svgIcons/RecordDiscard";
import RecordSave from "@/assets/svgIcons/RecordSave";
import RecordStart from "@/assets/svgIcons/RecordStart";
import { AUTH_GREEN } from "@/features/auth/constants";

type RideEmergencyRouteParams = {
  destination?: string;
  destinationSubtitle?: string;
  selectedRide?: string;
  paymentMethod?: string;
  fromScheduled?: string;
};

type HubView = "hub" | "activating" | "activated" | "recording";

const QUICK_MESSAGES = [
  "I am in danger",
  "I don’t feel safe",
  "The driver is going off route",
] as const;

const WAVEFORM_BAR_WIDTH = 2;
const WAVEFORM_BAR_GAP = 6;
const WAVEFORM_CONTAINER_HEIGHT = 250;
const WAVEFORM_MIN_HEIGHT = 14;
const WAVEFORM_MAX_HEIGHT = 120;
const SOS_RING_SIZE = 256;
const SOS_RING_STROKE = 4;
const SOS_RING_RADIUS = (SOS_RING_SIZE - SOS_RING_STROKE) / 2;
const SOS_RING_CIRCUMFERENCE = 2 * Math.PI * SOS_RING_RADIUS;

function getRecordingWaveformBars(phase: number, width: number) {
  const stride = WAVEFORM_BAR_WIDTH + WAVEFORM_BAR_GAP;
  const count = Math.max(Math.floor(width / stride), 24);

  return Array.from({ length: count }, (_, index) => {
    const x = index + phase * 0.9;
    const clusterA = (Math.sin(x * 0.38) + 1) / 2;
    const clusterB = (Math.sin(x * 0.17 + 1.4) + 1) / 2;
    const clusterC = (Math.cos(x * 0.11 - 0.8) + 1) / 2;
    const spikeA = Math.pow((Math.sin(x * 0.24 - 1.1) + 1) / 2, 2.2);
    const spikeB = Math.pow((Math.sin(x * 0.31 + 0.6) + 1) / 2, 3);
    const texture = (Math.sin(x * 0.72) + 1) / 2;
    const intensity =
      clusterA * 0.24 +
      clusterB * 0.18 +
      clusterC * 0.12 +
      spikeA * 0.28 +
      spikeB * 0.12 +
      texture * 0.06;
    const height = WAVEFORM_MIN_HEIGHT + (WAVEFORM_MAX_HEIGHT - WAVEFORM_MIN_HEIGHT) * intensity;
    const opacity = 0.08 + intensity * 0.68;

    return {
      key: `wave-${index}`,
      height: Math.round(height),
      opacity: Math.min(opacity, 0.92),
    };
  });
}

function CallPoliceIcon() {
  return (
    <Svg width={26} height={28} viewBox="0 0 26 28" fill="none">
      <Path
        d="M1.17929 13.1414C1.5965 11.231 1.98917 9.4395 0 6.45833L4.52083 1.29167C4.52083 1.29167 9.04167 3.22917 12.9167 0C16.7917 3.22917 21.3125 1.29167 21.3125 1.29167L25.8333 6.45833C23.8455 9.4395 24.2368 11.231 24.654 13.1414C25.0493 14.9549 25.4678 16.8743 23.8958 20.0208C22.4014 23.011 19.8245 24.0547 17.4181 25.0286C15.6666 25.739 14.0055 26.4107 12.9167 27.7708C11.8291 26.4107 10.1667 25.7378 8.41521 25.0286C6.00883 24.0547 3.43325 23.011 1.9375 20.0208C0.36425 16.8756 0.784042 14.9549 1.17929 13.1414ZM15.9882 14.561L19.0585 11.5669L14.8141 10.9495L12.9167 7.10417L11.0179 10.9495L6.77479 11.5669L9.84508 14.561L9.12046 18.7873L12.9167 16.7917L16.7129 18.7873L15.9882 14.561Z"
        fill="#FB3748"
      />
    </Svg>
  );
}

function ShareLiveLocationIcon() {
  return (
    <Svg width={31} height={31} viewBox="0 0 31 31" fill="none">
      <Path
        d="M15.5 2.5835C18.5831 2.5835 21.54 3.80827 23.7201 5.98838C25.9002 8.16849 27.125 11.1254 27.125 14.2085C27.125 18.1791 24.9602 21.4289 22.6791 23.7604C21.5394 24.9126 20.2959 25.9573 18.9642 26.881L18.414 27.2556L18.1557 27.4274L17.6687 27.7374L17.2347 28.0022L16.6974 28.3148C16.3327 28.523 15.92 28.6325 15.5 28.6325C15.08 28.6325 14.6673 28.523 14.3026 28.3148L13.7653 28.0022L13.0936 27.5889L12.8456 27.4274L12.316 27.0748C10.8795 26.1028 9.54142 24.9927 8.32092 23.7604C6.03983 21.4276 3.875 18.1791 3.875 14.2085C3.875 11.1254 5.09977 8.16849 7.27988 5.98838C9.45999 3.80827 12.4169 2.5835 15.5 2.5835ZM15.5 10.3335C14.9911 10.3335 14.4872 10.4337 14.0171 10.6285C13.547 10.8232 13.1198 11.1086 12.76 11.4685C12.4001 11.8283 12.1147 12.2555 11.92 12.7256C11.7252 13.1957 11.625 13.6996 11.625 14.2085C11.625 14.7174 11.7252 15.2213 11.92 15.6914C12.1147 16.1615 12.4001 16.5887 12.76 16.9485C13.1198 17.3084 13.547 17.5938 14.0171 17.7885C14.4872 17.9833 14.9911 18.0835 15.5 18.0835C16.5277 18.0835 17.5133 17.6752 18.24 16.9485C18.9667 16.2218 19.375 15.2362 19.375 14.2085C19.375 13.1808 18.9667 12.1952 18.24 11.4685C17.5133 10.7418 16.5277 10.3335 15.5 10.3335Z"
        fill="#FB3748"
      />
    </Svg>
  );
}

function RecordAudioIcon() {
  return (
    <Svg width={31} height={31} viewBox="0 0 31 31" fill="none">
      <Path
        d="M15.5 18.8906C18.3427 18.8906 20.6465 16.6141 20.6465 13.8047V7.02344C20.6465 4.21406 18.3427 1.9375 15.5 1.9375C12.6573 1.9375 10.3535 4.21406 10.3535 7.02344V13.8047C10.3535 16.6141 12.6573 18.8906 15.5 18.8906ZM25.4902 13.7441C25.4902 13.6109 25.3813 13.502 25.248 13.502H23.4316C23.2984 13.502 23.1895 13.6109 23.1895 13.7441C23.1895 17.9915 19.7474 21.4336 15.5 21.4336C11.2526 21.4336 7.81055 17.9915 7.81055 13.7441C7.81055 13.6109 7.70156 13.502 7.56836 13.502H5.75195C5.61875 13.502 5.50977 13.6109 5.50977 13.7441C5.50977 18.8513 9.34238 23.0653 14.2891 23.6617V26.7617H9.89033C9.47559 26.7617 9.14258 27.1946 9.14258 27.7305V28.8203C9.14258 28.9535 9.22734 29.0625 9.33027 29.0625H21.6697C21.7727 29.0625 21.8574 28.9535 21.8574 28.8203V27.7305C21.8574 27.1946 21.5244 26.7617 21.1097 26.7617H16.5898V23.6769C21.594 23.1319 25.4902 18.8937 25.4902 13.7441Z"
        fill="#FB3748"
      />
    </Svg>
  );
}

function BroadcastMessageIcon() {
  return (
    <Svg width={31} height={31} viewBox="0 0 31 31" fill="none">
      <Path
        d="M23.2507 3.875C24.6209 3.875 25.9351 4.41934 26.904 5.38828C27.873 6.35722 28.4173 7.67138 28.4173 9.04167V19.375C28.4173 20.7453 27.873 22.0594 26.904 23.0284C25.9351 23.9973 24.6209 24.5417 23.2507 24.5417H17.1488L10.9979 28.232C10.8127 28.3431 10.6025 28.4061 10.3866 28.415C10.1708 28.4239 9.95616 28.3786 9.76237 28.2831C9.56858 28.1876 9.40183 28.045 9.27739 27.8684C9.15295 27.6919 9.07479 27.4869 9.05007 27.2722L9.04232 27.125V24.5417H7.75065C6.42509 24.5417 5.15023 24.0322 4.18977 23.1186C3.22931 22.205 2.65672 20.9572 2.59044 19.6333L2.58398 19.375V9.04167C2.58398 7.67138 3.12833 6.35722 4.09727 5.38828C5.0662 4.41934 6.38037 3.875 7.75065 3.875H23.2507ZM18.084 15.5H10.334C9.99141 15.5 9.66287 15.6361 9.42064 15.8783C9.1784 16.1206 9.04232 16.4491 9.04232 16.7917C9.04232 17.1342 9.1784 17.4628 9.42064 17.705C9.66287 17.9472 9.99141 18.0833 10.334 18.0833H18.084C18.4266 18.0833 18.7551 17.9472 18.9973 17.705C19.2396 17.4628 19.3757 17.1342 19.3757 16.7917C19.3757 16.4491 19.2396 16.1206 18.9973 15.8783C18.7551 15.6361 18.4266 15.5 18.084 15.5ZM20.6673 10.3333H10.334C9.99141 10.3333 9.66287 10.4694 9.42064 10.7117C9.1784 10.9539 9.04232 11.2824 9.04232 11.625C9.04232 11.9676 9.1784 12.2961 9.42064 12.5383C9.66287 12.7806 9.99141 12.9167 10.334 12.9167H20.6673C21.0099 12.9167 21.3384 12.7806 21.5807 12.5383C21.8229 12.2961 21.959 11.9676 21.959 11.625C21.959 11.2824 21.8229 10.9539 21.5807 10.7117C21.3384 10.4694 21.0099 10.3333 20.6673 10.3333Z"
        fill="#FB3748"
      />
    </Svg>
  );
}

function SosHoldIcon() {
  return (
    <Svg width={54} height={54} viewBox="0 0 54 54" fill="none">
      <Path
        d="M27 18V27M27 36H27.0225M17.685 4.5H36.315L49.5 17.685V36.315L36.315 49.5H17.685L4.5 36.315V17.685L17.685 4.5Z"
        stroke="white"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function RecordingBadgeIcon() {
  return (
    <Svg width={19} height={20} viewBox="0 0 19 20" fill="none">
      <Path
        d="M3.21094 8.33333V10.8333M6.3776 5V14.1667M9.54427 2.5V17.5M12.7109 6.66667V12.5M16.0443 8.33333V10.8333"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function formatBadgeDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function formatRecordingClock(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `00:${minutes}:${remainingSeconds}.0`;
}

function QuickActionCard({
  icon,
  title,
  description,
  accentColor,
  badge,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
  badge?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-[18px] bg-[#1E1E1E] px-4 py-4"
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-[14px]"
        style={{ backgroundColor: accentColor }}
      >
        {icon}
      </View>

      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="text-[16px] font-medium text-white">{title}</Text>
          {badge ? (
            <View className="ml-3 flex-row items-center rounded-full bg-[#E5162D] px-2.5 py-1">
              <RecordingBadgeIcon />
              <Text className="ml-1 text-[13px] font-semibold text-white">{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text className="mt-1 text-[13px] leading-5 text-[#7E7E7E]">{description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

function EmergencyContactRow({
  contact,
  title,
  subtitle,
  accentColor,
  onChatPress,
  onCallPress,
}: {
  contact: EmergencyContactOption | ManagedEmergencyContact;
  title: string;
  subtitle: string;
  accentColor: string;
  onChatPress: () => void;
  onCallPress: () => void;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-[18px] bg-[#1E1E1E] px-4 py-4">
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: accentColor }}
      >
        <Text className="text-[18px] font-semibold text-white">
          {title.slice(0, 1).toUpperCase()}
        </Text>
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-[16px] font-semibold text-white" numberOfLines={1}>
          {title}
        </Text>
        <Text className="mt-1 text-[14px] text-[#929292]" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onChatPress}
        className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#353535]"
      >
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onCallPress}
        className="h-12 w-12 items-center justify-center rounded-full bg-[#1FFF98]"
      >
        <Ionicons name="call" size={20} color="#050505" />
      </TouchableOpacity>
    </View>
  );
}

export default function EmergencySosScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<RideEmergencyRouteParams>();
  const managedContacts = useDriverEmergencyStore((state) => state.managedContacts);
  const alertMessage = useDriverEmergencyStore((state) => state.alertMessage);
  const setAlertMessage = useDriverEmergencyStore((state) => state.setAlertMessage);
  const recordingDurationSeconds = useDriverEmergencyStore(
    (state) => state.recordingDurationSeconds,
  );
  const setRecordingDurationSeconds = useDriverEmergencyStore((state) => state.setRecordingDurationSeconds);
  const messageSheetRef = useRef<BottomSheet>(null);
  const customMessageSheetRef = useRef<BottomSheet>(null);
  const recordPromptSheetRef = useRef<BottomSheet>(null);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hubView, setHubView] = useState<HubView>("hub");
  const [holdProgress, setHoldProgress] = useState(0);
  const [activationCountdown, setActivationCountdown] = useState(3);
  const [recordingSeconds, setRecordingSeconds] = useState(recordingDurationSeconds);
  const [customMessageDraft, setCustomMessageDraft] = useState(alertMessage);
  const [waveformPhase, setWaveformPhase] = useState(0);

  useEffect(() => {
    if (hubView !== "activating") {
      return;
    }

    setActivationCountdown(3);
    const countdown = setInterval(() => {
      setActivationCountdown((current) => {
        if (current <= 1) {
          clearInterval(countdown);
          setHubView("activated");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [hubView]);

  useEffect(() => {
    if (hubView !== "recording") {
      return;
    }

    const timer = setInterval(() => {
      setRecordingSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hubView]);

  useEffect(() => {
    if (hubView !== "recording") {
      setWaveformPhase(0);
      return;
    }

    const waveformTimer = setInterval(() => {
      setWaveformPhase((current) => current + 1);
    }, 80);

    return () => clearInterval(waveformTimer);
  }, [hubView]);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  const trustedContacts = useMemo(() => managedContacts.slice(0, 3), [managedContacts]);

  const recordBadge = recordingDurationSeconds > 0 ? formatBadgeDuration(recordingDurationSeconds) : null;
  const recordingWaveformWidth = Math.max(Dimensions.get("window").width - 40, 280);
  const recordingWaveformBars = useMemo(
    () => getRecordingWaveformBars(waveformPhase, recordingWaveformWidth),
    [recordingWaveformWidth, waveformPhase],
  );
  const holdRingOffset = SOS_RING_CIRCUMFERENCE * (1 - holdProgress);

  function clearHoldTimer() {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  function handleSosPressIn() {
    if (hubView !== "hub") {
      return;
    }

    clearHoldTimer();
    setHoldProgress(0);

    let nextProgress = 0;
    holdTimerRef.current = setInterval(() => {
      nextProgress += 0.05;
      setHoldProgress(nextProgress);

      if (nextProgress >= 1) {
        clearHoldTimer();
        setHoldProgress(1);
        setHubView("activating");
      }
    }, 80);
  }

  function handleSosPressOut() {
    if (hubView !== "hub") {
      return;
    }

    clearHoldTimer();
    setHoldProgress(0);
  }

  function openMessageSheet() {
    messageSheetRef.current?.snapToIndex(0);
  }

  function openCustomMessageSheet() {
    setCustomMessageDraft(alertMessage);
    customMessageSheetRef.current?.snapToIndex(0);
  }

  function openRecordPrompt() {
    recordPromptSheetRef.current?.snapToIndex(0);
  }

  function closeAllSheets() {
    messageSheetRef.current?.close();
    customMessageSheetRef.current?.close();
    recordPromptSheetRef.current?.close();
  }

  function handleStartRecording() {
    setRecordingSeconds(0);
    setRecordingDurationSeconds(0);
    setHubView("recording");
    recordPromptSheetRef.current?.close();
  }

  function handleSaveRecording() {
    setRecordingDurationSeconds(recordingSeconds);
    setHubView("hub");
  }

  function handleDiscardRecording() {
    setRecordingSeconds(0);
    setRecordingDurationSeconds(0);
    setHubView("hub");
  }

  function handleQuickMessageSelect(message: string) {
    setAlertMessage(message);
    closeAllSheets();
    if (hubView === "activated") {
      setHubView("hub");
    }
  }

  function handleSendCustomMessage() {
    setAlertMessage(customMessageDraft.trim() || alertMessage);
    closeAllSheets();
    if (hubView === "activated") {
      setHubView("hub");
    }
  }

  function handleChatContact(contact: EmergencyContactOption) {
    void Linking.openURL(`sms:${contact.phoneNumber}`);
  }

  function handleCallContact(contact: EmergencyContactOption) {
    void Linking.openURL(`tel:${contact.phoneNumber}`);
  }

  function handleCallPolice() {
    void Linking.openURL("tel:112");
  }

  if (hubView === "activating") {
    return (
      <View className="flex-1 bg-[#0D0D0D] px-5">
        <StatusBar style="light" />
        <View style={{ paddingTop: insets.top + 14 }} className="flex-row items-center">
          <TouchableOpacity activeOpacity={0.85} onPress={() => setHubView("hub")}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="mb-10 h-[224px] w-[224px] items-center justify-center rounded-full bg-[#D0041633]">
            <View className="h-[180px] w-[180px] items-center justify-center rounded-full border border-[#D00416]">
              <View className="h-[94px] w-[94px] items-center justify-center rounded-full bg-[#D00416]">
                <SosHoldIcon />
              </View>
            </View>
          </View>

          <Text className="text-center text-[28px] font-bold text-white">
            Activating SOS in {activationCountdown}...
          </Text>
          <Text className="mt-4 max-w-[320px] text-center text-[16px] leading-8 text-[#7F7F7F]">
            Authorities and emergency contacts will be notified automatically in {activationCountdown} seconds.
          </Text>
        </View>

        <View style={{ paddingBottom: insets.bottom + 18 }} className="mb-4">
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              setHubView("hub");
              setHoldProgress(0);
            }}
            className="rounded-full bg-[#353535] py-5"
          >
            <Text className="text-center text-[16px] font-medium text-white">
              <Ionicons name="close-circle-outline" size={18} color="#FFFFFF" /> Cancel Activation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (hubView === "activated") {
    return (
      <View className="flex-1 bg-[#0D0D0D] px-5">
        <StatusBar style="light" />
        <View style={{ paddingTop: insets.top + 14 }} className="flex-row items-center">
          <TouchableOpacity activeOpacity={0.85} onPress={() => setHubView("hub")}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 26 }}
        >
          <View className="items-center pt-10">
            <View className="mb-10 h-[224px] w-[224px] items-center justify-center rounded-full bg-[#D0041633]">
              <View className="h-[180px] w-[180px] items-center justify-center rounded-full border border-[#D00416]">
                <View className="h-[94px] w-[94px] items-center justify-center rounded-full bg-[#D00416]">
                  <SosHoldIcon />
                </View>
              </View>
            </View>

            <Text className="text-center text-[26px] font-bold text-white">
              SOS Protocol Activated
            </Text>
            <Text className="mt-4 max-w-[320px] text-center text-[16px] leading-8 text-[#7F7F7F]">
              Authorities and emergency contacts will be notified automatically in 3 seconds.
            </Text>
          </View>

          <Text className="mt-16 text-center text-[16px] text-[#8D8D8D]">
            Quick Message to Trusted Contacts
          </Text>

          <View className="mt-6 border-t border-[#232323] pt-6">
            {QUICK_MESSAGES.map((message) => (
              <TouchableOpacity
                key={message}
                activeOpacity={0.88}
                onPress={() => handleQuickMessageSelect(message)}
                className="mb-3 flex-row items-center rounded-[16px] bg-[#1E1E1E] px-5 py-5"
              >
                <Text className="flex-1 text-[16px] text-white">{message}</Text>
                <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={openCustomMessageSheet}
              className="flex-row items-center rounded-[16px] bg-[#1E1E1E] px-5 py-5"
            >
              <Ionicons name="mail-unread-outline" size={20} color="#FFFFFF" />
              <Text className="ml-3 flex-1 text-[16px] text-white">Custom Message</Text>
              <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomSheet
          ref={customMessageSheetRef}
          index={-1}
          snapPoints={["45%"]}
          enablePanDownToClose
          enableDynamicSizing={false}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              opacity={0.55}
            />
          )}
          handleIndicatorStyle={{ backgroundColor: "#5A5A5A", width: 56, height: 4 }}
          backgroundStyle={{
            backgroundColor: "#1D1D1D",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
        >
          <BottomSheetView className="flex-1 px-5 pt-2">
            <Text className="mb-6 text-[18px] font-semibold text-white">Custom Message</Text>
            <View className="rounded-[16px] bg-[#3A3A3A] px-4 py-4">
              <TextInput
                value={customMessageDraft}
                onChangeText={setCustomMessageDraft}
                multiline
                textAlignVertical="top"
                className="min-h-[140px] text-[15px] text-white"
                placeholder="Write a custom message"
                placeholderTextColor="#7B7B7B"
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSendCustomMessage}
              className="mt-7 rounded-full py-5"
              style={{ backgroundColor: AUTH_GREEN }}
            >
              <Text className="text-center text-[16px] font-semibold text-[#050505]">
                Send Message
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </View>
    );
  }

  if (hubView === "recording") {
    return (
      <View className="flex-1 bg-[#0D0D0D] px-5">
        <StatusBar style="light" />
        <View
          style={{ paddingTop: insets.top + 14 }}
          className="flex-row items-center justify-between"
        >
          <TouchableOpacity activeOpacity={0.85} onPress={handleDiscardRecording}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text className="text-[20px] font-medium text-white">Safety Hub</Text>

          <View className="flex-row items-center rounded-full bg-[#E5162D] px-3 py-1.5">
            <RecordingBadgeIcon />
            <Text className="ml-1 text-[14px] font-semibold text-white">
              {formatBadgeDuration(recordingSeconds)}
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <Text className="text-[44px] font-light tracking-[1px] text-white">
            {formatRecordingClock(recordingSeconds)}
          </Text>

          <View
            className="mt-8 w-full items-center justify-center overflow-hidden"
            style={{ height: WAVEFORM_CONTAINER_HEIGHT }}
          >
            <View
              className="flex-row items-center justify-center"
              style={{ width: recordingWaveformWidth, height: WAVEFORM_CONTAINER_HEIGHT }}
            >
              {recordingWaveformBars.map((bar) => (
                <View
                  key={bar.key}
                  className="rounded-full bg-[#8E8E8E]"
                  style={{
                    width: WAVEFORM_BAR_WIDTH,
                    height: bar.height,
                    marginHorizontal: WAVEFORM_BAR_GAP / 2,
                    opacity: bar.opacity,
                  }}
                />
              ))}
            </View>
          </View>

          <Text className="mt-2 max-w-[340px] text-center text-[14px] leading-7 text-[#7F7F7F]">
            Your audio recording is encrypted and stored locally. It will only be shared with our security team if you report an incident.
          </Text>
        </View>

        <View style={{ paddingBottom: insets.bottom + 18 }} className="mb-4">
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleSaveRecording}
            className="rounded-full bg-[#FF4458] py-5"
          >
            <View className="flex-row items-center justify-center">
              <RecordSave />
              <Text className="ml-3 text-[16px] font-semibold text-white">
                Stop and Save Recording
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleDiscardRecording}
            className="mt-4 rounded-full bg-[#353535] py-5"
          >
            <View className="flex-row items-center justify-center">
              <RecordDiscard />
              <Text className="ml-3 text-[16px] font-medium text-white">
                Discard Recording
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      <StatusBar style="light" />

      <View
        className="border-b border-[#232323] px-5"
        style={{ paddingTop: insets.top + 14, paddingBottom: 18 }}
      >
        <View className="relative items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            className="absolute left-0 h-10 w-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text className="text-[20px] font-medium text-white">Safety Hub</Text>

          {recordBadge ? (
            <View className="absolute right-0 flex-row items-center rounded-full bg-[#E5162D] px-3 py-1.5">
              <RecordingBadgeIcon />
              <Text className="ml-1 text-[14px] font-semibold text-white">{recordBadge}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 22,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="items-center">
          <View
            className="items-center justify-center rounded-full bg-[#D0041633]"
            style={{ width: SOS_RING_SIZE, height: SOS_RING_SIZE }}
          >
            <Svg
              width={SOS_RING_SIZE}
              height={SOS_RING_SIZE}
              style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
            >
              <Circle
                cx={SOS_RING_SIZE / 2}
                cy={SOS_RING_SIZE / 2}
                r={SOS_RING_RADIUS}
                stroke="#D00416"
                strokeWidth={SOS_RING_STROKE}
                strokeLinecap="round"
                strokeDasharray={SOS_RING_CIRCUMFERENCE}
                strokeDashoffset={holdRingOffset}
                fill="transparent"
              />
            </Svg>

            <Pressable onPressIn={handleSosPressIn} onPressOut={handleSosPressOut}>
              <View className="h-[176px] w-[176px] items-center justify-center rounded-full bg-[#D00416]">
                <SosHoldIcon />
                <Text className="mt-4 text-center text-[24px] font-bold leading-[30px] text-white">
                  Hold to{"\n"}send SOS
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <Text className="mt-16 text-[16px] font-medium text-[#6F6F6F]">Quick Actions</Text>

        <View className="mt-4">
          <QuickActionCard
            icon={<CallPoliceIcon />}
            title="Call Police"
            description="Direct line to local authorities"
            accentColor="#3B181E"
            onPress={handleCallPolice}
          />

          <QuickActionCard
            icon={<ShareLiveLocationIcon />}
            title="Share Live Location"
            description="Real time GPS tracking for all trusted contacts"
            accentColor="#1E1A1C"
            onPress={() =>
              router.push({
                pathname: "/(driver)/settings-emergency-share-location",
                params: {
                  ...params,
                },
              })
            }
          />

          <QuickActionCard
            icon={<RecordAudioIcon />}
            title="Record Audio"
            description="Discreetly record and encrypt trip audio"
            accentColor="#1E1518"
            badge={recordBadge ?? undefined}
            onPress={openRecordPrompt}
          />

          <QuickActionCard
            icon={<BroadcastMessageIcon />}
            title="Broadcast Message"
            description="Send a broadcast message to all your emergency contacts"
            accentColor="#1E1518"
            onPress={openMessageSheet}
          />
        </View>

        <View className="mt-12 flex-row items-center justify-between">
          <Text className="text-[16px] font-medium text-[#6F6F6F]">Emergency Contact</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(driver)/settings-emergency-contacts")}
          >
            <Text className="text-[15px] font-medium text-[#1FFF98]">See All</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-5">
          {trustedContacts.length > 0
            ? trustedContacts.map((contact) => (
                <EmergencyContactRow
                  key={contact.id}
                  contact={contact}
                  title={contact.fullName}
                  subtitle={contact.relationship}
                  accentColor={contact.accentColor}
                  onChatPress={() => handleChatContact({
                    id: contact.id,
                    firstName: contact.fullName,
                    lastName: "",
                    displayName: contact.fullName,
                    phoneNumber: `${contact.phoneCode} ${contact.phoneNumber}`,
                  })}
                  onCallPress={() => handleCallContact({
                    id: contact.id,
                    firstName: contact.fullName,
                    lastName: "",
                    displayName: contact.fullName,
                    phoneNumber: `${contact.phoneCode}${contact.phoneNumber.replace(/\s+/g, "")}`,
                  })}
                />
              ))
            : (
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => router.push("/(driver)/settings-emergency-contact-form")}
                className="rounded-[18px] bg-[#1E1E1E] px-4 py-6"
              >
                <Text className="text-[16px] font-semibold text-white">Add emergency contacts</Text>
                <Text className="mt-2 text-[14px] leading-6 text-[#8A8A8A]">
                  Choose trusted people for SOS alerts, live location sharing, and emergency broadcasts.
                </Text>
              </TouchableOpacity>
            )}
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push("/(driver)/settings-emergency-contact-form")}
          className="mt-5 flex-row items-center justify-center rounded-full border border-[#454545] py-5"
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text className="ml-3 text-[16px] text-white">Add Emergency Contact</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomSheet
        ref={recordPromptSheetRef}
        index={-1}
        snapPoints={["42%"]}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.55}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: "#5A5A5A", width: 56, height: 4 }}
        backgroundStyle={{
          backgroundColor: "#1D1D1D",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <BottomSheetView className="flex-1 px-5 pt-2">
          <View className="items-center">
            <View className="mt-6 h-24 w-24 items-center justify-center rounded-full bg-[#3C0B14]">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#E5162D]">
                <Ionicons name="mic" size={28} color="#FFFFFF" />
              </View>
            </View>

            <Text className="mt-6 text-[18px] font-semibold text-white">Safety Recording</Text>
            <Text className="mt-3 text-center text-[14px] leading-7 text-[#8C8C8C]">
              Record audio for your safety. Recordings are encrypted and only accessible by Chauffar if a safety report is filed by you.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleStartRecording}
            className="mt-8 rounded-full bg-[#FF4458] py-5"
          >
            <View className="flex-row items-center justify-center">
              <RecordStart />
              <Text className="ml-3 text-[16px] font-semibold text-white">
                Start Recording
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => recordPromptSheetRef.current?.close()}
            className="mt-4 rounded-full bg-[#353535] py-5"
          >
            <Text className="text-center text-[16px] font-medium text-white">Cancel</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet
        ref={messageSheetRef}
        index={-1}
        snapPoints={["42%"]}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.55}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: "#5A5A5A", width: 56, height: 4 }}
        backgroundStyle={{
          backgroundColor: "#1D1D1D",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <BottomSheetView className="flex-1 px-5 pt-2">
          <Text className="mb-6 text-[16px] text-[#8A8A8A]">Quick Message</Text>
          {QUICK_MESSAGES.map((message) => (
            <TouchableOpacity
              key={message}
              activeOpacity={0.88}
              onPress={() => handleQuickMessageSelect(message)}
              className="border-t border-[#303030] py-5"
            >
              <View className="flex-row items-center">
                <Text className="flex-1 text-[16px] text-white">{message}</Text>
                <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={openCustomMessageSheet}
            className="mt-3 flex-row items-center rounded-[16px] bg-[#353535] px-4 py-5"
          >
            <Ionicons name="mail-unread-outline" size={20} color="#FFFFFF" />
            <Text className="ml-3 flex-1 text-[16px] text-white">Custom Message</Text>
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet
        ref={customMessageSheetRef}
        index={-1}
        snapPoints={["45%"]}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.55}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: "#5A5A5A", width: 56, height: 4 }}
        backgroundStyle={{
          backgroundColor: "#1D1D1D",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <BottomSheetView className="flex-1 px-5 pt-2">
          <TouchableOpacity activeOpacity={0.85} onPress={() => customMessageSheetRef.current?.close()}>
            <Text className="mb-6 text-[16px] text-[#8A8A8A]">Custom Message</Text>
          </TouchableOpacity>
          <View className="rounded-[16px] bg-[#3A3A3A] px-4 py-4">
            <TextInput
              value={customMessageDraft}
              onChangeText={setCustomMessageDraft}
              multiline
              textAlignVertical="top"
              className="min-h-[140px] text-[15px] text-white"
              placeholder="Write a custom message"
              placeholderTextColor="#7B7B7B"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleSendCustomMessage}
            className="mt-7 rounded-full py-5"
            style={{ backgroundColor: AUTH_GREEN }}
          >
            <Text className="text-center text-[16px] font-semibold text-[#050505]">
              Send Message
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
