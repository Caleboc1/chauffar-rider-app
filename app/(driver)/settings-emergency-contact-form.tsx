import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import {
  loadEmergencyContacts,
  useDriverEmergencyStore,
  type EmergencyContactOption,
} from "@/app/(driver)/state/driver-emergency";
import { AUTH_GREEN } from "@/features/auth/constants";

type ContactFormParams = {
  contactId?: string;
};

function ImportFromContactIcon() {
  return (
    <Svg width={21} height={21} viewBox="0 0 21 21" fill="none">
      <Path
        d="M18 18H2.25V2.25H18M18 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V18C0 18.5967 0.237053 19.169 0.65901 19.591C1.08097 20.0129 1.65326 20.25 2.25 20.25H18C18.5967 20.25 19.169 20.0129 19.591 19.591C20.0129 19.169 20.25 18.5967 20.25 18V2.25C20.25 1.65326 20.0129 1.08097 19.591 0.65901C19.169 0.237053 18.5967 0 18 0ZM15.1875 14.9062C15.1875 13.2188 11.8125 12.375 10.125 12.375C8.4375 12.375 5.0625 13.2188 5.0625 14.9062V15.75H15.1875M10.125 10.4062C10.7963 10.4062 11.4402 10.1396 11.9149 9.66486C12.3896 9.19016 12.6562 8.54633 12.6562 7.875C12.6562 7.20367 12.3896 6.55984 11.9149 6.08514C11.4402 5.61043 10.7963 5.34375 10.125 5.34375C9.45367 5.34375 8.80984 5.61043 8.33514 6.08514C7.86043 6.55984 7.59375 7.20367 7.59375 7.875C7.59375 8.54633 7.86043 9.19016 8.33514 9.66486C8.80984 10.1396 9.45367 10.4062 10.125 10.4062Z"
        fill="#0DFF91"
      />
    </Svg>
  );
}

function normalizePhoneNumber(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function splitPhoneNumber(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith("+")) {
    return {
      phoneCode: "+234",
      phoneNumber: trimmedValue,
    };
  }

  const match = trimmedValue.match(/^(\+\d{1,3})(.*)$/);

  return {
    phoneCode: match?.[1] ?? "+234",
    phoneNumber: (match?.[2] ?? "").trim(),
  };
}

export default function EmergencyContactFormScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<ContactFormParams>();
  const managedContacts = useDriverEmergencyStore((state) => state.managedContacts);
  const addManagedContact = useDriverEmergencyStore((state) => state.addManagedContact);
  const updateManagedContact = useDriverEmergencyStore((state) => state.updateManagedContact);
  const removeManagedContact = useDriverEmergencyStore((state) => state.removeManagedContact);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phoneCode, setPhoneCode] = useState("+234");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [availableContacts, setAvailableContacts] = useState<EmergencyContactOption[]>([]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [contactsMessage, setContactsMessage] = useState<string | null>(null);

  const existingContact = useMemo(
    () => managedContacts.find((contact) => contact.id === params.contactId),
    [managedContacts, params.contactId],
  );
  const isEditing = Boolean(existingContact);

  useEffect(() => {
    if (!existingContact) {
      return;
    }

    setFullName(existingContact.fullName);
    setRelationship(existingContact.relationship);
    setPhoneCode(existingContact.phoneCode);
    setPhoneNumber(existingContact.phoneNumber);
  }, [existingContact]);

  const canSave =
    fullName.trim().length > 0 && relationship.trim().length > 0 && phoneNumber.trim().length > 0;

  async function handleImportFromContact() {
    const result = await loadEmergencyContacts();
    if (result.permissionStatus !== "granted") {
      setContactsMessage("Contacts permission is required to import from your device.");
      return;
    }

    const contactsToImport = result.contacts.filter(
      (contact) =>
        !managedContacts.some(
          (managedContact) =>
            normalizePhoneNumber(`${managedContact.phoneCode}${managedContact.phoneNumber}`) ===
            normalizePhoneNumber(contact.phoneNumber),
        ),
    );

    if (contactsToImport.length === 0) {
      setContactsMessage("No new device contacts are available to import.");
      return;
    }

    setContactsMessage(null);
    setAvailableContacts(contactsToImport);
    setShowContactsModal(true);
  }

  function handleSelectDeviceContact(contact: EmergencyContactOption) {
    const parsedPhone = splitPhoneNumber(contact.phoneNumber);

    setFullName(contact.displayName);
    setRelationship("");
    setPhoneCode(parsedPhone.phoneCode);
    setPhoneNumber(parsedPhone.phoneNumber);
    setContactsMessage(null);
    setShowContactsModal(false);
  }

  function handleSave() {
    if (!canSave) {
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      relationship: relationship.trim(),
      phoneCode: phoneCode.trim() || "+234",
      phoneNumber: phoneNumber.trim(),
    };

    if (existingContact) {
      updateManagedContact(existingContact.id, payload);
      router.back();
    } else {
      addManagedContact(payload);
      router.push({
        pathname: "/(driver)/settings-emergency-contact-success",
        params: {
          fullName: payload.fullName,
          relationship: payload.relationship,
        },
      });
    }
  }

  function handleDelete() {
    if (!existingContact) {
      return;
    }

    removeManagedContact(existingContact.id);
    setShowDeleteModal(false);
    router.replace("/(driver)/settings-emergency-contacts");
  }

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
        {isEditing ? (
          <View className="flex-row items-center">
            <View
              className="h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: existingContact?.accentColor ?? "#5B3F9B" }}
            >
              <Ionicons name="person" size={24} color="#D8C7FF" />
            </View>
            <View className="ml-4">
              <Text className="text-[16px] font-semibold text-white">{fullName}</Text>
              <Text className="mt-1 text-[14px] text-[#8A8A8A]">{relationship}</Text>
            </View>
          </View>
        ) : (
          <View>
            <Text className="text-[28px] font-semibold leading-[42px] text-white">
              Add New{"\n"}Emergency Contact
            </Text>
            <Text className="mt-3 max-w-[310px] text-[14px] leading-7 text-[#6F6F6F]">
              Add trusted people who will be notified instantly if an SOS alert is triggered.
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleImportFromContact}
              className="mt-10 flex-row items-center justify-center rounded-[10px] bg-[#133D18] py-5"
            >
              <ImportFromContactIcon />
              <Text className="ml-3 text-[16px] font-medium text-[#17FF98]">
                Import from contact
              </Text>
            </TouchableOpacity>

            {contactsMessage ? (
              <Text className="mt-4 text-[14px] leading-6 text-[#7E7E7E]">{contactsMessage}</Text>
            ) : null}
          </View>
        )}

        <View className="mt-12">
          <Text className="mb-3 text-[16px] text-[#B9B9B9]">Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder={isEditing ? "" : "eg: Johnathan Samson"}
            placeholderTextColor="#545454"
            className="rounded-[10px] bg-[#1E1E1E] px-5 py-5 text-[16px] text-white"
          />
        </View>

        <View className="mt-7">
          <Text className="mb-3 text-[16px] text-[#B9B9B9]">Phone Number</Text>
          <View className="flex-row">
            <TouchableOpacity
              activeOpacity={0.88}
              className="mr-2 h-[56px] w-[92px] flex-row items-center justify-center rounded-[10px] bg-[#1E1E1E]"
            >
              <Text className="mr-3 text-[24px]">🇳🇬</Text>
              <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="flex-1 flex-row items-center rounded-[10px] bg-[#1E1E1E] px-5">
              <Text className="mr-4 text-[16px] text-[#B9B9B9]">{phoneCode}</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder={isEditing ? "" : "00 0000 0000"}
                placeholderTextColor="#545454"
                keyboardType="phone-pad"
                className="flex-1 py-5 text-[16px] text-white"
              />
            </View>
          </View>
        </View>

        <View className="mt-7">
          <Text className="mb-3 text-[16px] text-[#B9B9B9]">Relationship</Text>
          <TextInput
            value={relationship}
            onChangeText={setRelationship}
            placeholder={isEditing ? "" : "eg: My Dad"}
            placeholderTextColor="#545454"
            className="rounded-[10px] bg-[#1E1E1E] px-5 py-5 text-[16px] text-white"
          />
        </View>

        <View className="mt-auto pb-5" style={{ paddingBottom: insets.bottom + 12 }}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleSave}
            disabled={!canSave}
            className="rounded-full py-5"
            style={{ backgroundColor: canSave ? AUTH_GREEN : "#24583A" }}
          >
            <Text className="text-center text-[16px] font-medium text-[#050505]">
              {isEditing ? "Save Changes" : "Save Contact"}
            </Text>
          </TouchableOpacity>

          {isEditing ? (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => setShowDeleteModal(true)}
              className="mt-8 items-center"
            >
              <Text className="text-[15px] text-white">Delete Contact</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Modal transparent visible={showDeleteModal} animationType="fade">
        <View className="flex-1 bg-black/55 px-5">
          <View className="flex-1 items-center justify-center">
            <View className="w-full rounded-[18px] bg-[#1E1E1E] px-5 py-8">
              <View className="items-center">
                <View className="h-[88px] w-[88px] items-center justify-center rounded-full bg-[#591820]">
                  <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-[#FF4458]">
                    <Ionicons name="close" size={34} color="#111111" />
                  </View>
                </View>
                <Text className="mt-10 text-center text-[24px] font-semibold leading-[38px] text-white">
                  Remove This{"\n"}Emergency Contact?
                </Text>
                <Text className="mt-4 max-w-[260px] text-center text-[14px] leading-7 text-[#8A8A8A]">
                  This contact will no longer receive safety alerts or trip updates.
                </Text>
              </View>

              <View className="mt-10 flex-row">
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={handleDelete}
                  className="mr-3 flex-1 rounded-full bg-[#3A3A3A] py-5"
                >
                  <Text className="text-center text-[16px] font-medium text-white">
                    Remove Contact
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-full py-5"
                  style={{ backgroundColor: AUTH_GREEN }}
                >
                  <Text className="text-center text-[16px] font-medium text-[#050505]">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showContactsModal} animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View
            className="rounded-t-[28px] bg-[#111111] px-5 pt-5"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <View className="items-center">
              <View className="h-1.5 w-12 rounded-full bg-[#343434]" />
            </View>

            <View className="mt-6 flex-row items-center justify-between">
              <Text className="text-[20px] font-semibold text-white">Select Contact</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowContactsModal(false)}
                className="h-10 w-10 items-center justify-center rounded-full bg-[#1E1E1E]"
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text className="mt-2 text-[14px] leading-6 text-[#777777]">
              Choose a contact from your device to add as an emergency contact.
            </Text>

            <ScrollView
              className="mt-6"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
            >
              {availableContacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  activeOpacity={0.88}
                  onPress={() => handleSelectDeviceContact(contact)}
                  className="mb-3 flex-row items-center rounded-[18px] bg-[#1E1E1E] px-4 py-4"
                >
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-[#1E4E2E]">
                    <Text className="text-[18px] font-semibold text-[#16F58D]">
                      {contact.displayName.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>

                  <View className="ml-4 flex-1">
                    <Text className="text-[16px] font-semibold text-white">
                      {contact.displayName}
                    </Text>
                    <Text className="mt-1 text-[14px] text-[#8B8B8B]">{contact.phoneNumber}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#A1A1A1" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
