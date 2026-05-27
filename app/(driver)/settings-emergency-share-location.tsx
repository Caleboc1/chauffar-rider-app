import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import {
  loadEmergencyContacts,
  useDriverEmergencyStore,
  type EmergencyContactOption,
} from "@/app/(driver)/state/driver-emergency";
import { PassengerLocationMap } from "@/components/map/passenger-location-map";
import { AUTH_GREEN } from "@/features/auth/constants";

type RideEmergencyRouteParams = {
  destination?: string;
  destinationSubtitle?: string;
  selectedRide?: string;
  paymentMethod?: string;
  fromScheduled?: string;
};

const EMERGENCY_MAP_DATA = {
  passengerLocation: {
    latitude: 6.428055,
    longitude: 3.421955,
  },
  mapRegion: {
    latitude: 6.428055,
    longitude: 3.421955,
    latitudeDelta: 0.0135,
    longitudeDelta: 0.0125,
  },
};

type ContactsPermissionStatus = "granted" | "denied" | "undetermined" | null;

function ShareLocationButtonIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.3591 12.7301C19.9891 12.7301 19.6791 12.4501 19.6391 12.0801C19.3991 9.88007 18.2191 7.90007 16.3991 6.64007C16.0691 6.41007 15.9891 5.96007 16.2191 5.63007C16.4491 5.30007 16.8991 5.22007 17.2291 5.45007C19.3991 6.96007 20.7991 9.32007 21.0891 11.9301C21.1291 12.3301 20.8391 12.6901 20.4391 12.7301C20.4091 12.7301 20.3891 12.7301 20.3591 12.7301Z"
        fill="black"
      />
      <Path
        d="M3.73931 12.7802C3.71931 12.7802 3.68931 12.7802 3.66931 12.7802C3.26931 12.7402 2.97931 12.3802 3.01931 11.9802C3.28931 9.3702 4.66931 7.0102 6.81931 5.4902C7.13931 5.2602 7.59931 5.3402 7.82931 5.6602C8.05931 5.9902 7.97931 6.4402 7.65931 6.6702C5.85931 7.9502 4.68931 9.9302 4.46931 12.1202C4.42931 12.5002 4.10931 12.7802 3.73931 12.7802Z"
        fill="black"
      />
      <Path
        d="M15.9906 21.0998C14.7606 21.6898 13.4406 21.9898 12.0606 21.9898C10.6206 21.9898 9.25059 21.6698 7.97059 21.0198C7.61059 20.8498 7.47059 20.4098 7.65059 20.0498C7.82059 19.6898 8.26059 19.5498 8.62059 19.7198C9.25059 20.0398 9.92059 20.2598 10.6006 20.3898C11.5206 20.5698 12.4606 20.5798 13.3806 20.4198C14.0606 20.2998 14.7306 20.0898 15.3506 19.7898C15.7206 19.6198 16.1606 19.7598 16.3206 20.1298C16.5006 20.4898 16.3606 20.9298 15.9906 21.0998Z"
        fill="black"
      />
      <Path
        d="M12.0505 2.00977C10.5005 2.00977 9.23047 3.26977 9.23047 4.82977C9.23047 6.38977 10.4905 7.64977 12.0505 7.64977C13.6105 7.64977 14.8705 6.38977 14.8705 4.82977C14.8705 3.26977 13.6105 2.00977 12.0505 2.00977Z"
        fill="black"
      />
      <Path
        d="M5.05047 13.8701C3.50047 13.8701 2.23047 15.1301 2.23047 16.6901C2.23047 18.2501 3.49047 19.5101 5.05047 19.5101C6.61047 19.5101 7.87047 18.2501 7.87047 16.6901C7.87047 15.1301 6.60047 13.8701 5.05047 13.8701Z"
        fill="black"
      />
      <Path
        d="M18.9509 13.8701C17.4009 13.8701 16.1309 15.1301 16.1309 16.6901C16.1309 18.2501 17.3909 19.5101 18.9509 19.5101C20.5109 19.5101 21.7709 18.2501 21.7709 16.6901C21.7709 15.1301 20.5109 13.8701 18.9509 13.8701Z"
        fill="black"
      />
    </Svg>
  );
}

function SentButtonIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.00016 16.1698L4.83016 11.9998L3.41016 13.4098L9.00016 18.9998L21.0002 6.99984L19.5902 5.58984L9.00016 16.1698Z"
        fill="black"
      />
    </Svg>
  );
}

function ShareContactRow({
  contact,
  subtitle,
  selected,
  onPress,
}: {
  contact: EmergencyContactOption;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-[18px] bg-[#1E1E1E] px-4 py-4"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#4E3B80]">
        <Text className="text-[18px] font-semibold text-white">
          {contact.displayName.slice(0, 1).toUpperCase()}
        </Text>
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-[16px] font-semibold text-white">{contact.displayName}</Text>
        <Text className="mt-1 text-[14px] text-[#8D8D8D]">{subtitle}</Text>
      </View>

      <View
        className={`h-7 w-7 items-center justify-center rounded-full ${
          selected ? "bg-[#12F28A]" : "border border-[#4A4A4A]"
        }`}
      >
        {selected ? <Ionicons name="checkmark" size={18} color="#0A0A0A" /> : null}
      </View>
    </TouchableOpacity>
  );
}

export default function EmergencyShareLocationScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<RideEmergencyRouteParams>();
  const trustedContactIds = useDriverEmergencyStore((state) => state.trustedContactIds);
  const [contactsPermissionStatus, setContactsPermissionStatus] =
    useState<ContactsPermissionStatus>(null);
  const [contacts, setContacts] = useState<EmergencyContactOption[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function hydrateContacts() {
      const result = await loadEmergencyContacts();
      if (!mounted) {
        return;
      }

      setContactsPermissionStatus(result.permissionStatus);
      setContacts(result.contacts);
      const initialIds =
        trustedContactIds.length > 0
          ? trustedContactIds
          : result.contacts.slice(0, 2).map((contact) => contact.id);
      setSelectedContactIds(initialIds);
    }

    void hydrateContacts();

    return () => {
      mounted = false;
    };
  }, [trustedContactIds]);

  const currentLocationTitle = params.destination ?? "Lekki Conservation Centre";
  const visibleContacts = useMemo(() => contacts.slice(0, 3), [contacts]);

  function toggleContact(contactId: string) {
    setSelectedContactIds((current) =>
      current.includes(contactId)
        ? current.filter((id) => id !== contactId)
        : [...current, contactId],
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
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 26,
          paddingBottom: insets.bottom + 26,
        }}
      >
        <Text className="text-[16px] text-[#7A7A7A]">Current Location</Text>
        <Text className="mt-2 text-[22px] font-semibold text-white">{currentLocationTitle}</Text>

        <View className="mt-5 overflow-hidden rounded-[18px] border border-[#363636]">
          <View style={{ height: 180 }}>
            <PassengerLocationMap
              region={EMERGENCY_MAP_DATA.mapRegion}
              passengerLocation={EMERGENCY_MAP_DATA.passengerLocation}
            />
          </View>
        </View>

        <Text className="mt-10 text-[16px] text-[#7A7A7A]">Share Location with</Text>
        <View className="mt-5">
          {contactsPermissionStatus === "granted"
            ? visibleContacts.map((contact, index) => (
                <ShareContactRow
                  key={contact.id}
                  contact={contact}
                  subtitle={index === 0 ? "My Mother" : index === 1 ? "Sister" : "Bestie"}
                  selected={selectedContactIds.includes(contact.id)}
                  onPress={() => toggleContact(contact.id)}
                />
              ))
            : (
              <View className="rounded-[18px] bg-[#1E1E1E] px-4 py-5">
                <Text className="text-[16px] font-semibold text-white">Contacts access needed</Text>
                <Text className="mt-2 text-[14px] leading-6 text-[#8C8C8C]">
                  Allow contacts access from the Safety Hub to choose trusted recipients.
                </Text>
              </View>
            )}
        </View>
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: insets.bottom + 18, paddingTop: 10 }}>
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={selectedContactIds.length === 0}
          onPress={() => setIsSent(true)}
          className="rounded-full py-5"
          style={{
            backgroundColor: selectedContactIds.length === 0 ? "#3A3A3A" : AUTH_GREEN,
          }}
        >
          <View className="flex-row items-center justify-center">
            {isSent ? <SentButtonIcon /> : <ShareLocationButtonIcon />}
            <Text className="ml-2 text-center text-[17px] font-semibold text-[#050505]">
              {isSent ? "Sent" : "Share Location"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.back()}
          className="mt-6 items-center"
        >
          <Text className="text-[15px] text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
