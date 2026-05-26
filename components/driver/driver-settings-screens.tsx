import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { AuthBackButton } from "@/components/auth/auth-back-button";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { UploadCard as VerificationUploadCard } from "@/components/verification/verification-ui";

const SETTINGS_AVATAR = require("@/assets/images/avatar.png");

const BG = "#0B0B0B";
const SURFACE = "#171515";
const SURFACE_ALT = "#1A1818";
const BORDER = "#343434";
const ROW_BORDER = "#2A2A2A";
const TEXT_MUTED = "#A0A0A0";
const PLACEHOLDER = "#6F6F6F";
const FIELD_HEIGHT = 54;

const COUNTRY_OPTIONS = ["Nigeria", "Ghana", "Kenya"];
const STATE_OPTIONS = ["Enugu", "Lagos", "Abuja"];
const LGA_OPTIONS = ["Enugu-East", "Enugu North", "Nsukka"];
const ID_OPTIONS = ["International Passport", "National ID", "Driver's License"];
const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say"];
const VEHICLE_TYPE_OPTIONS = ["Sedan", "SUV", "Hatchback", "Van", "Motorbike"];

const SUPPORT_MESSAGES = [
  {
    id: "1",
    sender: "support" as const,
    text: "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in non venenatis.",
    timeAgo: "3 mins ago",
  },
  {
    id: "2",
    sender: "support" as const,
    text: "Neque",
    timeAgo: "3 mins ago",
  },
  {
    id: "3",
    sender: "driver" as const,
    text: "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros.",
    timeAgo: "3 mins ago",
  },
  {
    id: "4",
    sender: "support" as const,
    text: "egestas odio",
    timeAgo: "3 mins ago",
  },
  {
    id: "5",
    sender: "support" as const,
    text: "Neque egestas odio adipiscing sit duis mattis",
    timeAgo: "3 mins ago",
  },
];

const FAQ_ITEMS = [
  {
    id: "1",
    question: "Neque egestas odio adipiscing",
    answer:
      "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in non venenatis Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in",
  },
  { id: "2", question: "Neque egestas odio adipiscing", answer: "Neque egestas odio adipiscing sit duis mattis." },
  { id: "3", question: "Neque egestas odio adipiscing", answer: "Neque egestas odio adipiscing sit duis mattis." },
  { id: "4", question: "Neque egestas odio adipiscing", answer: "Neque egestas odio adipiscing sit duis mattis." },
  { id: "5", question: "Neque egestas odio adipiscing", answer: "Neque egestas odio adipiscing sit duis mattis." },
];

const PRIVACY_PARAGRAPHS = [
  "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in non venenatis Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in",
  "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in non venenatis Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in",
  "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in non venenatis Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in",
  "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in non venenatis Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in",
  "Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in non venenatis Neque egestas odio adipiscing sit duis mattis. Proin senectus volutpat feugiat eros. Et egestas in",
];

type SelectSheetState =
  | { key: "gender"; title: string; options: string[] }
  | { key: "country"; title: string; options: string[] }
  | { key: "state"; title: string; options: string[] }
  | { key: "lga"; title: string; options: string[] }
  | { key: "idType"; title: string; options: string[] }
  | { key: "vehicleType"; title: string; options: string[] }
  | null;

type ChatMessage = {
  id: string;
  sender: "support" | "driver";
  text: string;
  timeAgo: string;
};

export function DriverSettingsScreen() {
  return (
    <SettingsHomeScreen />
  );
}

export function DriverSettingsProfileScreen() {
  const [firstName, setFirstName] = useState("Pascal");
  const [middleName, setMiddleName] = useState("Onyebuchi");
  const [lastName, setLastName] = useState("Okafor");
  const [gender, setGender] = useState("Male");
  const [dateOfBirth, setDateOfBirth] = useState("1996/09/28");
  const [country, setCountry] = useState("Nigeria");
  const [state, setState] = useState("Enugu");
  const [lga, setLga] = useState("Enugu-East");
  const [city, setCity] = useState("Enugu");
  const [idType, setIdType] = useState("International Passport");
  const [idNumber, setIdNumber] = useState("23456323");
  const [frontCard, setFrontCard] = useState<string | null>(null);
  const [backCard, setBackCard] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SelectSheetState>(null);

  const handleSelect = (value: string) => {
    switch (sheet?.key) {
      case "gender":
        setGender(value);
        break;
      case "country":
        setCountry(value);
        break;
      case "state":
        setState(value);
        break;
      case "lga":
        setLga(value);
        break;
      case "idType":
        setIdType(value);
        break;
      default:
        break;
    }
    setSheet(null);
  };

  return (
    <>
      <SettingsCenteredScreen title="Profile">
        <View className="items-center pb-6 pt-4">
          <View className="overflow-hidden rounded-full">
            <Image
              source={SETTINGS_AVATAR}
              style={{ width: 96, height: 96 }}
              contentFit="cover"
            />
          </View>
        </View>

        <SettingsTextField label="First name" value={firstName} onChangeText={setFirstName} />
        <SettingsTextField
          label="Middle name (optional)"
          value={middleName}
          onChangeText={setMiddleName}
        />
        <SettingsTextField label="Last name" value={lastName} onChangeText={setLastName} />
        <SettingsSelectField
          label="Gender"
          value={gender}
          onPress={() => setSheet({ key: "gender", title: "Select gender", options: GENDER_OPTIONS })}
        />
        <SettingsTextField
          label="Date of birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          rightIcon={<Ionicons name="calendar-clear-outline" size={18} color="#A0A0A0" />}
        />

        <Text className="mb-4 mt-4 text-[18px] font-medium text-white">Location</Text>
        <SettingsSelectField
          label="Country"
          value={country}
          onPress={() => setSheet({ key: "country", title: "Select country", options: COUNTRY_OPTIONS })}
        />
        <SettingsSelectField
          label="State"
          value={state}
          onPress={() => setSheet({ key: "state", title: "Select state", options: STATE_OPTIONS })}
        />
        <SettingsSelectField
          label="Local Government Area"
          value={lga}
          onPress={() => setSheet({ key: "lga", title: "Select local government area", options: LGA_OPTIONS })}
        />
        <SettingsTextField label="City" value={city} onChangeText={setCity} />

        <Text className="mb-4 mt-4 text-[18px] font-medium text-white">Government ID</Text>
        <SettingsSelectField
          label="Identification type"
          value={idType}
          onPress={() => setSheet({ key: "idType", title: "Select ID type", options: ID_OPTIONS })}
        />
        <SettingsTextField label="Enter ID number" value={idNumber} onChangeText={setIdNumber} />
        <SettingsUploadCard label="Front side of the card" imageUri={frontCard} onPick={setFrontCard} />
        <SettingsUploadCard label="Back side of the card" imageUri={backCard} onPick={setBackCard} />
      </SettingsCenteredScreen>

      <SettingsSelectSheet
        title={sheet?.title ?? ""}
        visible={!!sheet}
        value={getSheetValue(sheet, { gender, country, state, lga, idType })}
        options={sheet?.options ?? []}
        onClose={() => setSheet(null)}
        onSelect={handleSelect}
      />
    </>
  );
}

export function DriverSettingsVehicleManagementScreen() {
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [interiorImage, setInteriorImage] = useState<string | null>(null);
  const [vehicleDocuments, setVehicleDocuments] = useState<string | null>(null);
  const [insuranceCertificate, setInsuranceCertificate] = useState<string | null>(null);
  const [vehicleLicense, setVehicleLicense] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SelectSheetState>(null);

  return (
    <>
      <SettingsCenteredScreen title="Vehicle management">
        <Text className="mb-6 text-[18px] font-medium text-white">Vehicle information</Text>

        <SettingsSelectField
          label="Vehicle type"
          value={vehicleType}
          placeholder="Vehicle type"
          appearance="outlined"
          onPress={() =>
            setSheet({
              key: "vehicleType",
              title: "Select vehicle type",
              options: VEHICLE_TYPE_OPTIONS,
            })
          }
        />
        <SettingsTextField
          label="Vehicle brand"
          value={vehicleBrand}
          placeholder="Vehicle brand"
          appearance="outlined"
          onChangeText={setVehicleBrand}
        />
        <SettingsTextField
          label="Vehicle model"
          value={vehicleModel}
          placeholder="Vehicle model"
          appearance="outlined"
          onChangeText={setVehicleModel}
        />
        <SettingsTextField
          label="Plate number"
          value={plateNumber}
          placeholder="Plate number"
          appearance="outlined"
          onChangeText={setPlateNumber}
        />
        <SettingsVerificationUploadCard
          label="Vehicle image (Front)"
          imageUri={frontImage}
          onPick={setFrontImage}
        />
        <SettingsVerificationUploadCard
          label="Vehicle image (Side)"
          imageUri={sideImage}
          onPick={setSideImage}
        />
        <SettingsVerificationUploadCard
          label="Vehicle image (Interior)"
          imageUri={interiorImage}
          onPick={setInteriorImage}
        />

        <Text className="mb-6 mt-4 text-[18px] font-medium text-white">Vehicle documents</Text>
        <SettingsVerificationUploadCard imageUri={vehicleDocuments} onPick={setVehicleDocuments} />
        <SettingsVerificationUploadCard
          label="Insurance Certificate"
          showInfo
          imageUri={insuranceCertificate}
          onPick={setInsuranceCertificate}
        />
        <SettingsVerificationUploadCard
          label="Vehicle License"
          showInfo
          imageUri={vehicleLicense}
          onPick={setVehicleLicense}
        />
      </SettingsCenteredScreen>

      <SettingsSelectSheet
        title={sheet?.title ?? ""}
        visible={!!sheet}
        value={vehicleType || undefined}
        options={sheet?.options ?? []}
        onClose={() => setSheet(null)}
        onSelect={(value) => {
          setVehicleType(value);
          setSheet(null);
        }}
      />
    </>
  );
}

export function DriverSettingsChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDisabled = !oldPassword || !newPassword || !confirmPassword;

  return (
    <SettingsCenteredScreen
      title="Change password"
      footer={
        <AuthPrimaryButton
          label="Confirm"
          disabled={isDisabled}
          onPress={() => Alert.alert("Password updated", "Your password change has been saved.")}
          className="h-[58px] w-full items-center justify-center rounded-full"
        />
      }
    >
      <View className="pt-10">
        <SettingsPasswordField
          label="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!showOldPassword}
          onToggleSecureEntry={() => setShowOldPassword((current) => !current)}
        />
        <SettingsPasswordField
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          onToggleSecureEntry={() => setShowNewPassword((current) => !current)}
        />
        <SettingsPasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          onToggleSecureEntry={() => setShowConfirmPassword((current) => !current)}
        />
      </View>
    </SettingsCenteredScreen>
  );
}

export function DriverSettingsHelpSupportScreen() {
  return (
    <SettingsCenteredScreen title="Help & Support">
      <View className="pt-8">
        <SettingsNavigationRow
          icon={HelpSupportChatIcon}
          label="Chat with us"
          onPress={() => router.push("/(driver)/settings-support-chat")}
        />
        <SettingsNavigationRow
          icon={HelpSupportFaqIcon}
          label="FAQs"
          onPress={() => router.push("/(driver)/settings-faqs")}
        />
        <SettingsNavigationRow
          icon={HelpSupportPrivacyIcon}
          label="Privacy and Policy"
          onPress={() => router.push("/(driver)/settings-privacy-policy")}
        />
      </View>
    </SettingsCenteredScreen>
  );
}

export function DriverSettingsSupportChatScreen() {
  const insets = useSafeAreaInsets();
  const [draftMessage, setDraftMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(SUPPORT_MESSAGES);

  const handleSend = () => {
    const text = draftMessage.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}`, sender: "driver", text, timeAgo: "now" },
    ]);
    setDraftMessage("");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <View className="border-b border-[#2D2D2D] px-5 pb-4 pt-2">
          <View className="flex-row items-center">
            <AuthBackButton className="-ml-1 mr-3" />
            <SupportAvatar />
            <View className="ml-3 flex-1">
              <Text className="text-[15px] font-medium text-white">Chauffer Support</Text>
              <Text className="mt-0.5 text-[13px] text-[#0DFF85]">Active</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 26, paddingBottom: 20 }}
        >
          {messages.map((message) => {
            const isDriver = message.sender === "driver";
            return (
              <View key={message.id} className={`mb-4 ${isDriver ? "items-end" : "items-start"}`}>
                <View className={`flex-row ${isDriver ? "justify-end" : "justify-start"}`}>
                  {!isDriver ? (
                    <View className="mr-3 mt-1">
                      <SupportAvatar size="small" />
                    </View>
                  ) : null}
                  <View
                    className={`max-w-[84%] rounded-[14px] px-4 py-3 ${
                      isDriver ? "bg-[#15F58D]" : "bg-[#343434]"
                    }`}
                    style={{
                      borderTopLeftRadius: isDriver ? 14 : 0,
                      borderTopRightRadius: isDriver ? 0 : 14,
                    }}
                  >
                    <Text
                      className={`text-[16px] leading-8 ${
                        isDriver ? "text-[#070707]" : "text-white"
                      }`}
                    >
                      {message.text}
                    </Text>
                    <Text
                      className={`mt-2 text-right text-[14px] ${
                        isDriver ? "text-[#0D0D0D]" : "text-[#B8B8B8]"
                      }`}
                    >
                      {message.timeAgo}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View
          className="px-5 pt-2"
          style={{ paddingBottom: Math.max(insets.bottom + 10, 22) }}
        >
          <View className="flex-row items-center rounded-full bg-[#343434] px-5 py-[15px]">
            <TouchableOpacity activeOpacity={0.82} className="mr-3">
              <Ionicons name="attach-outline" size={25} color="#FFFFFF" />
            </TouchableOpacity>
            <TextInput
              value={draftMessage}
              onChangeText={setDraftMessage}
              onSubmitEditing={handleSend}
              placeholder="Type a message"
              placeholderTextColor="#A0A0A0"
              returnKeyType="send"
              className="flex-1 text-[16px] text-white"
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export function DriverSettingsFaqScreen() {
  const [openItemId, setOpenItemId] = useState("1");

  return (
    <SettingsStackedScreen title="Frequently asked questions">
      <View className="pt-10">
        {FAQ_ITEMS.map((item) => {
          const open = openItemId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.86}
              onPress={() => setOpenItemId(open ? "" : item.id)}
              className="mb-4 overflow-hidden rounded-[14px]"
              style={{ backgroundColor: "#343434" }}
            >
              <View className="flex-row items-center justify-between px-5 py-5">
                <Text className="mr-4 flex-1 text-[16px] text-white">{item.question}</Text>
                <Ionicons
                  name={open ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#FFFFFF"
                />
              </View>

              {open ? (
                <View className="border-t border-[#515151] px-5 pb-5 pt-4">
                  <Text className="text-[16px] leading-9 text-[#F1F1F1]">{item.answer}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </SettingsStackedScreen>
  );
}

export function DriverSettingsPrivacyPolicyScreen() {
  return (
    <SettingsStackedScreen title="Privacy and Policy">
      <View className="pt-10">
        {PRIVACY_PARAGRAPHS.map((paragraph, index) => (
          <Text
            key={`${index}`}
            className="mb-8 text-[16px] leading-10 text-[#F1F1F1]"
          >
            {paragraph}
          </Text>
        ))}
      </View>
    </SettingsStackedScreen>
  );
}

function SettingsCenteredScreen({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <View className="px-5 pb-3 pt-2">
          <View className="relative min-h-10 items-center justify-center">
            <AuthBackButton className="absolute left-0 top-0" />
            <Text className="text-[20px] font-semibold text-white">{title}</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: footer ? 24 : Math.max(insets.bottom + 18, 24),
          }}
        >
          {children}
        </ScrollView>

        {footer ? (
          <View
            className="px-5 pt-4"
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
          >
            {footer}
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

function SettingsStackedScreen({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
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
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom + 18, 24),
          }}
        >
          <AuthBackButton className="-ml-1" />
          <Text className="mt-[54px] max-w-[280px] text-[28px] font-semibold leading-[40px] text-white">
            {title}
          </Text>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SettingsHomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 12,
          }}
        >
          <View className="relative mb-10 min-h-12 items-center justify-center">
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => router.back()}
              className="absolute left-0 top-0 h-12 w-12 items-center justify-center rounded-full bg-[#2A2A2A]"
            >
              <Ionicons name="menu" size={24} color="#BDBDBD" />
            </TouchableOpacity>

            <Text className="text-[20px] font-semibold text-white">Settings</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.84}
            onPress={() => router.push("/(driver)/settings-profile")}
            className="mb-6 flex-row items-center rounded-[18px] px-4 py-4"
            style={{ backgroundColor: "#2A2A2A" }}
          >
            <View className="mr-3 overflow-hidden rounded-full">
              <Image
                source={SETTINGS_AVATAR}
                style={{ width: 48, height: 48 }}
                contentFit="cover"
              />
            </View>

            <View className="flex-1">
              <Text className="text-[16px] font-semibold text-white">Matthew Jamal</Text>
              <Text className="mt-1 text-[14px] text-[#9D9D9D]">matthewjamal@yahoo.com</Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <SettingsGroupCard
            items={[
              {
                icon: SettingsVehicleManagementIcon,
                label: "Vehicle management",
                onPress: () => router.push("/(driver)/settings-vehicle-management"),
              },
              {
                icon: SettingsChangePasswordIcon,
                label: "Change password",
                onPress: () => router.push("/(driver)/settings-change-password"),
              },
              {
                icon: SettingsTransactionPinIcon,
                label: "Set transaction pin",
                onPress: () =>
                  Alert.alert("Set transaction pin", "The transaction pin flow is not part of the provided designs yet."),
              },
            ]}
          />

          <View className="h-6" />

          <SettingsGroupCard
            items={[
              {
                icon: SettingsHelpSupportIcon,
                label: "Help & Support",
                onPress: () => router.push("/(driver)/settings-help-support"),
              },
              {
                icon: SettingsEmergencyIcon,
                label: "Emergency/SOS",
                onPress: () =>
                  Alert.alert("Emergency/SOS", "The Emergency/SOS flow was not included in the provided settings designs."),
              },
            ]}
          />

          <View className="h-6" />

          <SettingsGroupCard
            items={[
              {
                icon: SettingsTermsOfServiceIcon,
                label: "Terms of Service",
                onPress: () => router.push("/(driver)/settings-privacy-policy"),
              },
              {
                icon: SettingsCompanyPolicyIcon,
                label: "Company policy",
                onPress: () => router.push("/(driver)/settings-privacy-policy"),
              },
            ]}
          />
        </ScrollView>

        <View
          className="px-5 pt-2"
          style={{ paddingBottom: Math.max(insets.bottom, 8) }}
        >
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={() => router.replace("/(auth)/login")}
            className="h-[58px] flex-row items-center justify-center rounded-full bg-white"
          >
            <Ionicons name="log-out-outline" size={21} color="#FF1E1E" />
            <Text className="ml-2 text-[16px] font-semibold text-[#FF1E1E]">Log out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SettingsGroupCard({
  items,
}: {
  items: {
    icon: () => React.JSX.Element;
    label: string;
    onPress: () => void;
  }[];
}) {
  return (
    <View className="overflow-hidden rounded-[18px]" style={{ backgroundColor: "#2A2A2A" }}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          activeOpacity={0.82}
          onPress={item.onPress}
          className="px-4 py-5"
        >
          <View className="flex-row items-center">
            <View className="mr-4 w-6 items-center">
              <item.icon />
            </View>
            <Text className="flex-1 text-[16px] font-semibold text-white">{item.label}</Text>
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
          </View>
          {index < items.length - 1 ? (
            <View className="mt-5 h-px bg-[#3C3C3C]" />
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function SettingsVehicleManagementIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M2.5 7.59169V12.4C2.5 14.1667 2.5 14.1667 4.16667 15.2917L8.75 17.9417C9.44167 18.3417 10.5667 18.3417 11.25 17.9417L15.8333 15.2917C17.5 14.1667 17.5 14.1667 17.5 12.4084V7.59169C17.5 5.83336 17.5 5.83336 15.8333 4.70836L11.25 2.05836C10.5667 1.65836 9.44167 1.65836 8.75 2.05836L4.16667 4.70836C2.5 5.83336 2.5 5.83336 2.5 7.59169Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function SettingsChangePasswordIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M5 8.33335V6.66669C5 3.90835 5.83333 1.66669 10 1.66669C14.1667 1.66669 15 3.90835 15 6.66669V8.33335" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9.99984 15.4167C11.1504 15.4167 12.0832 14.4839 12.0832 13.3333C12.0832 12.1827 11.1504 11.25 9.99984 11.25C8.84924 11.25 7.9165 12.1827 7.9165 13.3333C7.9165 14.4839 8.84924 15.4167 9.99984 15.4167Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14.1665 18.3333H5.83317C2.49984 18.3333 1.6665 17.5 1.6665 14.1666V12.5C1.6665 9.16665 2.49984 8.33331 5.83317 8.33331H14.1665C17.4998 8.33331 18.3332 9.16665 18.3332 12.5V14.1666C18.3332 17.5 17.4998 18.3333 14.1665 18.3333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function SettingsTransactionPinIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M5 8.33335V6.66669C5 3.90835 5.83333 1.66669 10 1.66669C14.1667 1.66669 15 3.90835 15 6.66669V8.33335" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14.1665 18.3333H5.83317C2.49984 18.3333 1.6665 17.5 1.6665 14.1666V12.5C1.6665 9.16665 2.49984 8.33331 5.83317 8.33331H14.1665C17.4998 8.33331 18.3332 9.16665 18.3332 12.5V14.1666C18.3332 17.5 17.4998 18.3333 14.1665 18.3333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M13.3305 13.3334H13.338" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9.99607 13.3334H10.0036" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.66209 13.3334H6.66957" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function SettingsHelpSupportIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M9.99984 18.3334C14.5832 18.3334 18.3332 14.5834 18.3332 10C18.3332 5.41669 14.5832 1.66669 9.99984 1.66669C5.4165 1.66669 1.6665 5.41669 1.6665 10C1.6665 14.5834 5.4165 18.3334 9.99984 18.3334Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10 6.66669V10.8334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9.99561 13.3333H10.0031" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function SettingsEmergencyIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M8.74179 1.85836L4.58346 3.4167C3.62513 3.77503 2.8418 4.90836 2.8418 5.93336V12.125C2.8418 13.1084 3.49181 14.4 4.28347 14.9917L7.8668 17.6667C9.0418 18.55 10.9751 18.55 12.1501 17.6667L15.7335 14.9917C16.5251 14.4 17.1751 13.1084 17.1751 12.125V5.93336C17.1751 4.90836 16.3918 3.77503 15.4335 3.4167L11.2751 1.85836C10.5668 1.60003 9.43345 1.60003 8.74179 1.85836Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9.99984 12.9167C11.8408 12.9167 13.3332 11.4243 13.3332 9.58333C13.3332 7.74238 11.8408 6.25 9.99984 6.25C8.15889 6.25 6.6665 7.74238 6.6665 9.58333C6.6665 11.4243 8.15889 12.9167 9.99984 12.9167Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10.2082 8.54169V9.31669C10.2082 9.60835 10.0582 9.88335 9.79985 10.0334L9.1665 10.4167" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function SettingsTermsOfServiceIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M8.9584 2.04166C9.54173 1.55 10.4834 1.55 11.0501 2.04166L12.3667 3.16666C12.6167 3.375 13.0917 3.55 13.4251 3.55H14.8417C15.7251 3.55 16.4501 4.275 16.4501 5.15833V6.575C16.4501 6.90833 16.6251 7.375 16.8334 7.625L17.9584 8.94166C18.4501 9.525 18.4501 10.4667 17.9584 11.0333L16.8334 12.35C16.6251 12.6 16.4501 13.0667 16.4501 13.4V14.8167C16.4501 15.7 15.7251 16.425 14.8417 16.425H13.4251C13.0917 16.425 12.6251 16.6 12.3751 16.8083L11.0584 17.9333C10.4751 18.425 9.5334 18.425 8.96673 17.9333L7.65007 16.8083C7.40007 16.6 6.92507 16.425 6.60007 16.425H5.14173C4.2584 16.425 3.5334 15.7 3.5334 14.8167V13.3917C3.5334 13.0667 3.36673 12.5917 3.1584 12.35L2.0334 11.025C1.55007 10.45 1.55007 9.51666 2.0334 8.94166L3.1584 7.61666C3.36673 7.36666 3.5334 6.9 3.5334 6.575V5.16666C3.5334 4.28333 4.2584 3.55833 5.14173 3.55833H6.5834C6.91673 3.55833 7.3834 3.38333 7.6334 3.175L8.9584 2.04166Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10 6.77499V10.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9.99561 13.3333H10.0031" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function SettingsCompanyPolicyIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M15 15.7167H14.3667C13.7 15.7167 13.0667 15.975 12.6 16.4417L11.175 17.85C10.525 18.4917 9.46668 18.4917 8.81668 17.85L7.39166 16.4417C6.925 15.975 6.28333 15.7167 5.625 15.7167H5C3.61667 15.7167 2.5 14.6083 2.5 13.2417V4.14166C2.5 2.77499 3.61667 1.66666 5 1.66666H15C16.3833 1.66666 17.5 2.77499 17.5 4.14166V13.2333C17.5 14.6 16.3833 15.7167 15 15.7167Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10.0584 7.45834C10.0251 7.45834 9.97504 7.45834 9.93337 7.45834C9.05837 7.42501 8.3667 6.71668 8.3667 5.83334C8.3667 4.93334 9.09171 4.20834 9.99171 4.20834C10.8917 4.20834 11.6167 4.94168 11.6167 5.83334C11.6251 6.71668 10.9334 7.43334 10.0584 7.45834Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M7.7082 9.96667C6.59987 10.7083 6.59987 11.9167 7.7082 12.6583C8.96654 13.5 11.0332 13.5 12.2915 12.6583C13.3999 11.9167 13.3999 10.7083 12.2915 9.96667C11.0332 9.13334 8.97487 9.13334 7.7082 9.96667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function SettingsNavigationRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap | (() => React.JSX.Element);
  label: string;
  onPress: () => void;
}) {
  const CustomIcon = typeof icon === "function" ? icon : null;

  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} className="py-7">
      <View className="flex-row items-center">
        <View className="w-7 items-start">
          {CustomIcon ? <CustomIcon /> : <Ionicons name={icon} size={20} color="#FFFFFF" />}
        </View>
        <Text className="ml-[2px] flex-1 text-[16px] text-white">{label}</Text>
        <Ionicons name="chevron-forward" size={23} color="#FFFFFF" />
      </View>
      <View className="mt-7 h-px" style={{ backgroundColor: ROW_BORDER }} />
    </TouchableOpacity>
  );
}

function HelpSupportChatIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M9.9996 2.5C8.69841 2.49956 7.41949 2.83766 6.28851 3.48106C5.15753 4.12446 4.21339 5.05104 3.54888 6.16975C2.88436 7.28846 2.52233 8.5608 2.49834 9.86177C2.47436 11.1627 2.78926 12.4476 3.4121 13.59L2.5246 16.7025C2.49337 16.8118 2.49254 16.9275 2.52219 17.0373C2.55184 17.147 2.61086 17.2466 2.69289 17.3252C2.77492 17.4039 2.87685 17.4588 2.98772 17.4838C3.09859 17.5089 3.2142 17.5032 3.3221 17.4675L6.2446 16.4937C7.24067 17.0693 8.35581 17.4081 9.50374 17.4838C10.6517 17.5594 11.8016 17.37 12.8646 16.9302C13.9277 16.4903 14.8752 15.8118 15.6341 14.9472C16.3929 14.0825 16.9427 13.0549 17.2408 11.9437C17.539 10.8326 17.5775 9.66782 17.3535 8.53942C17.1295 7.41102 16.6488 6.34929 15.9488 5.43635C15.2488 4.52342 14.3482 3.78375 13.3165 3.27458C12.2849 2.76541 11.15 2.50038 9.9996 2.5ZM7.4996 8.75C7.4996 8.58424 7.56544 8.42527 7.68265 8.30806C7.79986 8.19085 7.95884 8.125 8.1246 8.125H11.8746C12.0404 8.125 12.1993 8.19085 12.3165 8.30806C12.4337 8.42527 12.4996 8.58424 12.4996 8.75C12.4996 8.91576 12.4337 9.07473 12.3165 9.19194C12.1993 9.30915 12.0404 9.375 11.8746 9.375H8.1246C7.95884 9.375 7.79986 9.30915 7.68265 9.19194C7.56544 9.07473 7.4996 8.91576 7.4996 8.75ZM8.1246 10.625H10.6246C10.7904 10.625 10.9493 10.6908 11.0665 10.8081C11.1837 10.9253 11.2496 11.0842 11.2496 11.25C11.2496 11.4158 11.1837 11.5747 11.0665 11.6919C10.9493 11.8092 10.7904 11.875 10.6246 11.875H8.1246C7.95884 11.875 7.79986 11.8092 7.68265 11.6919C7.56544 11.5747 7.4996 11.4158 7.4996 11.25C7.4996 11.0842 7.56544 10.9253 7.68265 10.8081C7.79986 10.6908 7.95884 10.625 8.1246 10.625Z" fill="white"/>
    </Svg>
  );
}

function HelpSupportFaqIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M5.00039 5.8389C4.99787 5.90726 5.00755 5.97549 5.02885 6.03939C5.05014 6.1033 5.0826 6.16153 5.12422 6.2105C5.16584 6.25947 5.21575 6.29815 5.27088 6.32416C5.32601 6.35017 5.38519 6.36296 5.44478 6.36174H6.96602C7.22048 6.36174 7.42331 6.12255 7.4565 5.83255C7.62245 4.44396 8.45222 3.43215 9.93105 3.43215C11.196 3.43215 12.354 4.1582 12.354 5.90452C12.354 7.24866 11.6643 7.86676 10.5746 8.8066C9.33362 9.84169 8.3508 11.0504 8.42087 13.0126L8.42641 13.4719C8.42834 13.6108 8.47776 13.7432 8.564 13.8407C8.65025 13.9381 8.76639 13.9927 8.88739 13.9926H10.3828C10.5051 13.9926 10.6223 13.9369 10.7088 13.8377C10.7952 13.7384 10.8438 13.6038 10.8438 13.4635V13.2412C10.8438 11.7214 11.3472 11.279 12.7062 10.0957C13.8291 9.11564 15 8.02763 15 5.74365C15 2.54523 12.6472 1 10.0712 1C7.73493 1 5.17557 2.24889 5.00039 5.8389ZM7.87138 18.0378C7.87138 19.166 8.65505 20 9.73375 20C10.8567 20 11.6293 19.166 11.6293 18.0378C11.6293 16.8693 10.8549 16.048 9.7319 16.048C8.65505 16.048 7.87138 16.8693 7.87138 18.0378Z" fill="white"/>
    </Svg>
  );
}

function HelpSupportPrivacyIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M9.16634 14.1667H10.833V9.16669H9.16634V14.1667ZM9.99967 7.50002C10.2358 7.50002 10.4338 7.42002 10.5938 7.26002C10.7538 7.10002 10.8336 6.90224 10.833 6.66669C10.8325 6.43113 10.7525 6.23335 10.593 6.07335C10.4336 5.91335 10.2358 5.83335 9.99967 5.83335C9.76356 5.83335 9.56579 5.91335 9.40634 6.07335C9.2469 6.23335 9.1669 6.43113 9.16634 6.66669C9.16579 6.90224 9.24579 7.1003 9.40634 7.26085C9.5669 7.42141 9.76467 7.50113 9.99967 7.50002ZM9.99967 18.3334C8.06912 17.8472 6.47523 16.7395 5.21801 15.01C3.96079 13.2806 3.33245 11.3606 3.33301 9.25002V4.16669L9.99967 1.66669L16.6663 4.16669V9.25002C16.6663 11.3611 16.038 13.2814 14.7813 15.0109C13.5247 16.7403 11.9308 17.8478 9.99967 18.3334ZM9.99967 16.5834C11.4441 16.125 12.6386 15.2084 13.583 13.8334C14.5275 12.4584 14.9997 10.9306 14.9997 9.25002V5.31252L9.99967 3.43752L4.99967 5.31252V9.25002C4.99967 10.9306 5.4719 12.4584 6.41634 13.8334C7.36079 15.2084 8.55523 16.125 9.99967 16.5834Z" fill="white"/>
    </Svg>
  );
}

function SettingsTextField({
  label,
  value,
  onChangeText,
  rightIcon,
  placeholder,
  appearance = "filled",
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  rightIcon?: ReactNode;
  placeholder?: string;
  appearance?: "filled" | "outlined";
}) {
  const outlined = appearance === "outlined";

  return (
    <View className="mb-5">
      <Text className="mb-3 text-[15px] text-white">{label}</Text>
      <View
        className={`flex-row items-center rounded-[16px] px-4 ${outlined ? "border" : ""}`}
        style={{
          height: FIELD_HEIGHT,
          backgroundColor: outlined ? BG : SURFACE_ALT,
          borderColor: outlined ? BORDER : "transparent",
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? label}
          placeholderTextColor={PLACEHOLDER}
          className="flex-1 text-[15px] text-white"
        />
        {rightIcon ? <View className="ml-3">{rightIcon}</View> : null}
      </View>
    </View>
  );
}

function SettingsPasswordField({
  label,
  value,
  onChangeText,
  secureTextEntry,
  onToggleSecureEntry,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry: boolean;
  onToggleSecureEntry: () => void;
}) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-[17px] text-white">{label}</Text>
      <View
        className="flex-row items-center rounded-[16px] border px-4"
        style={{ height: FIELD_HEIGHT, borderColor: BORDER }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder={label === "Confirm New Password" ? "Confirm new password" : label.toLowerCase()}
          placeholderTextColor={PLACEHOLDER}
          className="flex-1 text-[16px] text-white"
        />
        <TouchableOpacity activeOpacity={0.82} onPress={onToggleSecureEntry}>
          <Ionicons
            name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
            size={18}
            color="#CFCFCF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SettingsSelectField({
  label,
  value,
  onPress,
  placeholder,
  appearance = "filled",
}: {
  label: string;
  value: string;
  onPress: () => void;
  placeholder?: string;
  appearance?: "filled" | "outlined";
}) {
  const outlined = appearance === "outlined";

  return (
    <View className="mb-5">
      <Text className="mb-3 text-[15px] text-white">{label}</Text>
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={onPress}
        className={`flex-row items-center rounded-[16px] px-4 ${outlined ? "border" : ""}`}
        style={{
          height: FIELD_HEIGHT,
          backgroundColor: outlined ? BG : SURFACE_ALT,
          borderColor: outlined ? BORDER : "transparent",
        }}
      >
        <Text
          className="flex-1 text-[15px]"
          style={{ color: value ? "#FFFFFF" : PLACEHOLDER }}
        >
          {value || placeholder || label}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#B7B7B7" />
      </TouchableOpacity>
    </View>
  );
}

function SettingsUploadCard({
  label,
  imageUri,
  onPick,
  showInfo = false,
}: {
  label?: string;
  imageUri: string | null;
  onPick: (uri: string | null) => void;
  showInfo?: boolean;
}) {
  return (
    <View className="mb-6">
      {label ? (
        <View className="mb-3 flex-row items-center">
          <Text className="text-[15px] text-white">{label}</Text>
          {showInfo ? (
            <Ionicons
              name="information-circle"
              size={14}
              color="#8C8C8C"
              style={{ marginLeft: 6 }}
            />
          ) : null}
        </View>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.86}
        onPress={() => pickSingleImage(onPick)}
        className="rounded-[16px] px-4 py-4"
        style={{ backgroundColor: SURFACE }}
      >
        <View className="flex-row items-start">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-dashed border-[#A7A7A7]">
            <Ionicons name="cloud-upload-outline" size={16} color="#F0F0F0" />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] text-white">Upload photo</Text>
            <Text className="mt-1 text-[12px] leading-5" style={{ color: TEXT_MUTED }}>
              Upload at least 1 picture of either not{"\n"}less than 10MB
            </Text>
          </View>
        </View>

        <View className="my-3 h-px bg-[#444444]" style={{ width: "72%" }} />

        <View className="flex-row">
          {imageUri ? (
            <View className="relative h-[55px] w-[64px] overflow-hidden rounded-[4px]">
              <Image source={{ uri: imageUri }} className="h-full w-full" contentFit="cover" />
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => onPick(null)}
                className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-[3px] bg-[#C8C8B0]"
              >
                <Ionicons name="close" size={11} color="#0A0A0A" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="h-[56px] w-[64px] overflow-hidden rounded-[6px] bg-[#232323]" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

function SettingsVerificationUploadCard({
  label,
  imageUri,
  onPick,
  showInfo = false,
}: {
  label?: string;
  imageUri: string | null;
  onPick: (uri: string | null) => void;
  showInfo?: boolean;
}) {
  return (
    <VerificationUploadCard
      label={label}
      info={showInfo}
      imageUris={imageUri ? [imageUri] : []}
      onAdd={() => pickSingleImage(onPick)}
      onSlotPress={() => pickSingleImage(onPick)}
      onRemove={() => onPick(null)}
    />
  );
}

function SettingsSelectSheet({
  title,
  visible,
  value,
  options,
  onClose,
  onSelect,
}: {
  title: string;
  visible: boolean;
  value?: string;
  options: string[];
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/70" onPress={onClose}>
        <Pressable
          className="rounded-t-[28px] px-5 pb-8 pt-5"
          style={{ backgroundColor: "#111111" }}
          onPress={(event) => event.stopPropagation()}
        >
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-[17px] font-semibold text-white">{title}</Text>
            <TouchableOpacity activeOpacity={0.82} onPress={onClose}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {options.map((option) => {
            const selected = option === value;
            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.82}
                onPress={() => onSelect(option)}
                className="mb-3 flex-row items-center justify-between rounded-[16px] px-4 py-4"
                style={{ backgroundColor: selected ? "#172119" : "#1A1A1A" }}
              >
                <Text className="text-[15px]" style={{ color: selected ? "#0DFF85" : "#FFFFFF" }}>
                  {option}
                </Text>
                {selected ? <Ionicons name="checkmark" size={18} color="#0DFF85" /> : null}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SupportAvatar({ size = "default" }: { size?: "default" | "small" }) {
  const outerSize = size === "small" ? 28 : 48;
  const greenWidth = size === "small" ? 11 : 16;
  const greenHeight = size === "small" ? 18 : 26;
  const cutWidth = size === "small" ? 5 : 7;
  const cutHeight = size === "small" ? 8 : 12;
  const left = size === "small" ? 8 : 14;

  return (
    <View
      className="items-center justify-center rounded-full bg-[#242424]"
      style={{ width: outerSize, height: outerSize }}
    >
      <View
        className="absolute rounded-[4px] bg-[#0DFF85]"
        style={{
          width: greenWidth,
          height: greenHeight,
          transform: [{ skewY: "-18deg" }],
          left,
        }}
      />
      <View
        className="absolute rounded-[2px] bg-[#0B0B0B]"
        style={{
          width: cutWidth,
          height: cutHeight,
          transform: [{ skewY: "-18deg" }],
          left: left + greenWidth - 2,
        }}
      />
    </View>
  );
}

function getSheetValue(
  sheet: SelectSheetState,
  values: {
    gender: string;
    country: string;
    state: string;
    lga: string;
    idType: string;
  }
) {
  switch (sheet?.key) {
    case "gender":
      return values.gender;
    case "country":
      return values.country;
    case "state":
      return values.state;
    case "lga":
      return values.lga;
    case "idType":
      return values.idType;
    default:
      return undefined;
  }
}

async function pickSingleImage(onPick: (uri: string | null) => void) {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert("Gallery access needed", "Allow photo access to upload images for your settings.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]?.uri) {
    onPick(result.assets[0].uri);
  }
}
