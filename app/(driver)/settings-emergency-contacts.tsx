import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDriverEmergencyStore } from "@/app/(driver)/state/driver-emergency";

function EmergencyContactsIcon() {
  return (
    <View className="h-[68px] w-[68px] items-center justify-center rounded-full border border-[#6B6B6B]">
      <Ionicons name="call" size={24} color="#FFFFFF" />
      <View className="absolute right-[18px] top-[18px] h-4 w-4 items-center justify-center rounded-full bg-white">
        <Ionicons name="heart" size={8} color="#111111" />
      </View>
    </View>
  );
}

export default function EmergencyContactsScreen() {
  const insets = useSafeAreaInsets();
  const managedContacts = useDriverEmergencyStore((state) => state.managedContacts);

  return (
    <View className="flex-1 bg-[#0D0D0D]">
      <StatusBar style="light" />

      <View
        className="border-b border-[#232323] px-5"
        style={{ paddingTop: insets.top + 14, paddingBottom: 18 }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-5 pt-10">
        <View className="items-center">
          <EmergencyContactsIcon />
          <Text className="mt-7 text-center text-[20px] font-semibold text-white">
            Emergency Contacts
          </Text>
          <Text className="mt-3 max-w-[310px] text-center text-[14px] leading-7 text-[#6F6F6F]">
            Add trusted people who will be notified instantly if an SOS alert is triggered.
          </Text>
        </View>

        <ScrollView
          className="mt-10 flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {managedContacts.length === 0 ? (
            <View className="rounded-[18px] bg-[#1E1E1E] px-5 py-6">
              <Text className="text-[16px] font-semibold text-white">No emergency contacts yet</Text>
              <Text className="mt-2 text-[14px] leading-6 text-[#8B8B8B]">
                Add a trusted person from your device contacts so they can receive your safety
                alerts.
              </Text>
            </View>
          ) : (
            managedContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: "/(driver)/settings-emergency-contact-form",
                    params: { contactId: contact.id },
                  })
                }
                className="mb-3 flex-row items-center rounded-[18px] bg-[#1E1E1E] px-4 py-4"
              >
                <View
                  className="h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: contact.accentColor }}
                >
                  <Ionicons name="person" size={22} color="#D8C7FF" />
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-[16px] font-semibold text-white">{contact.fullName}</Text>
                  <Text className="mt-1 text-[14px] text-[#8B8B8B]">{contact.relationship}</Text>
                </View>

                <Ionicons name="chevron-forward" size={22} color="#A1A1A1" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push("/(driver)/settings-emergency-contact-form")}
          className="mb-5 flex-row items-center justify-center rounded-[18px] border border-[#343434] py-6"
          style={{ marginBottom: insets.bottom + 12 }}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text className="ml-4 text-[16px] font-semibold text-white">Add Trusted Contacts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
