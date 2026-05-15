import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Text } from "react-native";

import {
  UploadCard,
  VerificationAvatar,
  VerificationDateField,
  VerificationDatePickerModal,
  VerificationField,
  VerificationScreen,
  VerificationSectionTitle,
  VerificationSelectField,
  VerificationSelectModal,
} from "@/components/verification/verification-ui";

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

const COUNTRY_OPTIONS = [
  { label: "Nigeria", value: "Nigeria" },
  { label: "Ghana", value: "Ghana" },
  { label: "Kenya", value: "Kenya" },
];

const STATE_OPTIONS = [
  { label: "Lagos", value: "Lagos" },
  { label: "Abuja", value: "Abuja" },
  { label: "Rivers", value: "Rivers" },
];

const LGA_OPTIONS = [
  { label: "Ikeja", value: "Ikeja" },
  { label: "Eti-Osa", value: "Eti-Osa" },
  { label: "Surulere", value: "Surulere" },
];

const ID_TYPE_OPTIONS = [
  { label: "National ID", value: "National ID" },
  { label: "Driver's License", value: "Driver's License" },
  { label: "International Passport", value: "International Passport" },
];

type ActiveSelect = "gender" | "country" | "state" | "lga" | "idType" | null;
type UploadTarget = "avatar" | "frontAdd" | "backAdd" | "front0" | "front1" | "back0" | "back1";

export default function DriverInfoScreen() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<string>();
  const [dateOfBirth, setDateOfBirth] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [state, setState] = useState<string>();
  const [lga, setLga] = useState<string>();
  const [city, setCity] = useState("");
  const [idType, setIdType] = useState<string>();
  const [idNumber, setIdNumber] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [frontCardImages, setFrontCardImages] = useState<string[]>([]);
  const [backCardImages, setBackCardImages] = useState<string[]>([]);
  const [activeSelect, setActiveSelect] = useState<ActiveSelect>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formComplete = useMemo(
    () =>
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      !!gender &&
      !!dateOfBirth &&
      !!country &&
      !!state &&
      !!lga &&
      city.trim().length > 0 &&
      !!idType &&
      idNumber.trim().length > 0 &&
      frontCardImages.length > 0 &&
      backCardImages.length > 0,
    [
      backCardImages.length,
      city,
      country,
      dateOfBirth,
      firstName,
      frontCardImages.length,
      gender,
      idNumber,
      idType,
      lastName,
      lga,
      state,
    ]
  );

  const selectConfig = getSelectConfig(activeSelect, {
    gender,
    country,
    state,
    lga,
    idType,
    setGender,
    setCountry,
    setState,
    setLga,
    setIdType,
  });

  async function ensureGalleryPermission() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Gallery access needed", "Allow photo access to upload images for verification.");
      return false;
    }

    return true;
  }

  async function openGallery(target: UploadTarget) {
    const granted = await ensureGalleryPermission();
    if (!granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const selectedUri = result.assets[0].uri;

    switch (target) {
      case "avatar":
        setAvatarUri(selectedUri);
        return;
      case "frontAdd":
        setFrontCardImages((current) => appendImage(current, selectedUri));
        return;
      case "backAdd":
        setBackCardImages((current) => appendImage(current, selectedUri));
        return;
      case "front0":
        setFrontCardImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "front1":
        setFrontCardImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
      case "back0":
        setBackCardImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "back1":
        setBackCardImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
    }
  }

  return (
    <VerificationScreen
      activeStep={1}
      showBackButton={false}
      nextDisabled={!formComplete}
      onNext={() => router.push("/(verification)/face-capture")}
    >
      <VerificationSectionTitle>Personal Details</VerificationSectionTitle>
      <VerificationAvatar imageUri={avatarUri} onPress={() => openGallery("avatar")} />

      <VerificationField
        label="First name"
        required
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#5C5C5C"
      />
      <VerificationField
        label="Middle name (optional)"
        placeholder="Middle name"
        value={middleName}
        onChangeText={setMiddleName}
        placeholderTextColor="#5C5C5C"
      />
      <VerificationField
        label="Last name"
        required
        placeholder="Last name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#5C5C5C"
      />
      <VerificationSelectField
        label="Gender"
        required
        placeholder="Select gender"
        value={gender}
        onPress={() => setActiveSelect("gender")}
      />
      <VerificationDateField
        label="Date of birth"
        required
        placeholder="yyyy/mm/dd"
        value={dateOfBirth}
        onPress={() => setShowDatePicker(true)}
      />

      <Text className="mb-4 mt-2 text-[16px] font-semibold text-white">Location</Text>
      <VerificationSelectField
        label="Country"
        required
        placeholder="Select country"
        value={country}
        onPress={() => setActiveSelect("country")}
      />
      <VerificationSelectField
        label="State"
        required
        placeholder="Select State"
        value={state}
        onPress={() => setActiveSelect("state")}
      />
      <VerificationSelectField
        label="Local Government Area"
        required
        placeholder="Select LGA"
        value={lga}
        onPress={() => setActiveSelect("lga")}
      />
      <VerificationField
        label="City"
        required
        placeholder="City"
        value={city}
        onChangeText={setCity}
        placeholderTextColor="#5C5C5C"
      />

      <Text className="mb-4 mt-2 text-[16px] font-semibold text-white">Government ID</Text>
      <VerificationSelectField
        label="Identification type"
        required
        placeholder="Select ID type"
        value={idType}
        onPress={() => setActiveSelect("idType")}
      />
      <VerificationField
        label="Enter ID number"
        required
        placeholder="ID number"
        value={idNumber}
        onChangeText={setIdNumber}
        placeholderTextColor="#5C5C5C"
      />
      <UploadCard
        label="Front side of the card"
        required
        imageUris={frontCardImages}
        onAdd={() => openGallery("frontAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "front0" : "front1")}
        onRemove={(index) =>
          setFrontCardImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
        }
      />
      <UploadCard
        label="Back side of the card"
        required
        imageUris={backCardImages}
        onAdd={() => openGallery("backAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "back0" : "back1")}
        onRemove={(index) =>
          setBackCardImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
        }
      />

      {selectConfig ? (
        <VerificationSelectModal
          title={selectConfig.title}
          visible={!!activeSelect}
          value={selectConfig.value}
          options={selectConfig.options}
          onClose={() => setActiveSelect(null)}
          onSelect={selectConfig.onSelect}
        />
      ) : null}

      <VerificationDatePickerModal
        title="Select date of birth"
        visible={showDatePicker}
        value={dateOfBirth}
        onClose={() => setShowDatePicker(false)}
        onConfirm={setDateOfBirth}
      />
    </VerificationScreen>
  );
}

function getSelectConfig(
  activeSelect: ActiveSelect,
  values: {
    gender?: string;
    country?: string;
    state?: string;
    lga?: string;
    idType?: string;
    setGender: (value: string) => void;
    setCountry: (value: string) => void;
    setState: (value: string) => void;
    setLga: (value: string) => void;
    setIdType: (value: string) => void;
  }
) {
  switch (activeSelect) {
    case "gender":
      return {
        title: "Select gender",
        value: values.gender,
        options: GENDER_OPTIONS,
        onSelect: values.setGender,
      };
    case "country":
      return {
        title: "Select country",
        value: values.country,
        options: COUNTRY_OPTIONS,
        onSelect: values.setCountry,
      };
    case "state":
      return {
        title: "Select state",
        value: values.state,
        options: STATE_OPTIONS,
        onSelect: values.setState,
      };
    case "lga":
      return {
        title: "Select local government area",
        value: values.lga,
        options: LGA_OPTIONS,
        onSelect: values.setLga,
      };
    case "idType":
      return {
        title: "Select identification type",
        value: values.idType,
        options: ID_TYPE_OPTIONS,
        onSelect: values.setIdType,
      };
    default:
      return null;
  }
}

function appendImage(current: string[], uri: string) {
  if (current.length >= 2) {
    return [current[0], uri];
  }

  return [...current, uri];
}

function replaceImageAt(current: string[], index: number, uri: string) {
  const next = [...current];
  next[index] = uri;
  return next.filter(Boolean);
}
