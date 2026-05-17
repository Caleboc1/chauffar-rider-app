import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";

import {
  UploadCard,
  VerificationField,
  VerificationScreen,
  VerificationSectionTitle,
  VerificationSelectField,
  VerificationSelectModal,
} from "@/components/verification/verification-ui";

const VEHICLE_TYPE_OPTIONS = [
  { label: "Sedan", value: "Sedan" },
  { label: "SUV", value: "SUV" },
  { label: "Hatchback", value: "Hatchback" },
  { label: "Van", value: "Van" },
  { label: "Motorbike", value: "Motorbike" },
];

type UploadTarget =
  | "frontVehicleAdd"
  | "sideVehicleAdd"
  | "interiorVehicleAdd"
  | "vehicleDocumentsAdd"
  | "insuranceAdd"
  | "licenseAdd"
  | "ownershipAdd"
  | "roadworthyAdd"
  | "frontVehicle0"
  | "frontVehicle1"
  | "sideVehicle0"
  | "sideVehicle1"
  | "interiorVehicle0"
  | "interiorVehicle1"
  | "vehicleDocuments0"
  | "vehicleDocuments1"
  | "insurance0"
  | "insurance1"
  | "license0"
  | "license1"
  | "ownership0"
  | "ownership1"
  | "roadworthy0"
  | "roadworthy1";

export default function VehicleInfoScreen() {
  const [vehicleType, setVehicleType] = useState<string>();
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);

  const [frontVehicleImages, setFrontVehicleImages] = useState<string[]>([]);
  const [sideVehicleImages, setSideVehicleImages] = useState<string[]>([]);
  const [interiorVehicleImages, setInteriorVehicleImages] = useState<string[]>([]);
  const [vehicleDocumentImages, setVehicleDocumentImages] = useState<string[]>([]);
  const [insuranceImages, setInsuranceImages] = useState<string[]>([]);
  const [licenseImages, setLicenseImages] = useState<string[]>([]);
  const [ownershipImages, setOwnershipImages] = useState<string[]>([]);
  const [roadworthyImages, setRoadworthyImages] = useState<string[]>([]);

  const formComplete = useMemo(
    () =>
      !!vehicleType &&
      vehicleBrand.trim().length > 0 &&
      plateNumber.trim().length > 0 &&
      frontVehicleImages.length > 0 &&
      sideVehicleImages.length > 0 &&
      interiorVehicleImages.length > 0 &&
      insuranceImages.length > 0 &&
      licenseImages.length > 0 &&
      ownershipImages.length > 0 &&
      roadworthyImages.length > 0,
    [
      frontVehicleImages.length,
      insuranceImages.length,
      licenseImages.length,
      ownershipImages.length,
      plateNumber,
      roadworthyImages.length,
      sideVehicleImages.length,
      vehicleBrand,
      vehicleType,
      interiorVehicleImages.length,
    ]
  );

  async function ensureGalleryPermission() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Gallery access needed", "Allow photo access to upload vehicle images and documents.");
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
      case "frontVehicleAdd":
        setFrontVehicleImages((current) => appendImage(current, selectedUri));
        return;
      case "sideVehicleAdd":
        setSideVehicleImages((current) => appendImage(current, selectedUri));
        return;
      case "interiorVehicleAdd":
        setInteriorVehicleImages((current) => appendImage(current, selectedUri));
        return;
      case "vehicleDocumentsAdd":
        setVehicleDocumentImages((current) => appendImage(current, selectedUri));
        return;
      case "insuranceAdd":
        setInsuranceImages((current) => appendImage(current, selectedUri));
        return;
      case "licenseAdd":
        setLicenseImages((current) => appendImage(current, selectedUri));
        return;
      case "ownershipAdd":
        setOwnershipImages((current) => appendImage(current, selectedUri));
        return;
      case "roadworthyAdd":
        setRoadworthyImages((current) => appendImage(current, selectedUri));
        return;
      case "frontVehicle0":
        setFrontVehicleImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "frontVehicle1":
        setFrontVehicleImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
      case "sideVehicle0":
        setSideVehicleImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "sideVehicle1":
        setSideVehicleImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
      case "interiorVehicle0":
        setInteriorVehicleImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "interiorVehicle1":
        setInteriorVehicleImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
      case "vehicleDocuments0":
        setVehicleDocumentImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "vehicleDocuments1":
        setVehicleDocumentImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
      case "insurance0":
        setInsuranceImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "insurance1":
        setInsuranceImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
      case "license0":
        setLicenseImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "license1":
        setLicenseImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
      case "ownership0":
        setOwnershipImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "ownership1":
        setOwnershipImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
      case "roadworthy0":
        setRoadworthyImages((current) => replaceImageAt(current, 0, selectedUri));
        return;
      case "roadworthy1":
        setRoadworthyImages((current) => replaceImageAt(current, 1, selectedUri));
        return;
    }
  }

  return (
    <VerificationScreen
      activeStep={3}
      nextDisabled={!formComplete}
      onNext={() => router.push("/(verification)/review-approved")}
    >
      <VerificationSectionTitle>Vehicle information</VerificationSectionTitle>

      <VerificationSelectField
        label="Vehicle type"
        required
        placeholder="Vehicle type"
        value={vehicleType}
        onPress={() => setShowVehicleTypeModal(true)}
      />
      <VerificationField
        label="Vehicle brand"
        required
        placeholder="Vehicle brand"
        value={vehicleBrand}
        onChangeText={setVehicleBrand}
        placeholderTextColor="#5C5C5C"
      />
      <VerificationField
        label="Vehicle model"
        placeholder="Vehicle model"
        value={vehicleModel}
        onChangeText={setVehicleModel}
        placeholderTextColor="#5C5C5C"
      />
      <VerificationField
        label="Plate number"
        required
        placeholder="Plate number"
        value={plateNumber}
        onChangeText={setPlateNumber}
        placeholderTextColor="#5C5C5C"
      />

      <UploadCard
        label="Vehicle image (Front)"
        required
        imageUris={frontVehicleImages}
        onAdd={() => openGallery("frontVehicleAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "frontVehicle0" : "frontVehicle1")}
        onRemove={(index) =>
          setFrontVehicleImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
        }
      />
      <UploadCard
        label="Vehicle image (Side)"
        required
        imageUris={sideVehicleImages}
        onAdd={() => openGallery("sideVehicleAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "sideVehicle0" : "sideVehicle1")}
        onRemove={(index) =>
          setSideVehicleImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
        }
      />
      <UploadCard
        label="Vehicle image (Interior)"
        required
        imageUris={interiorVehicleImages}
        onAdd={() => openGallery("interiorVehicleAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "interiorVehicle0" : "interiorVehicle1")}
        onRemove={(index) =>
          setInteriorVehicleImages((current) =>
            current.filter((_, imageIndex) => imageIndex !== index)
          )
        }
      />

      <VerificationSectionTitle>Vehicle documents</VerificationSectionTitle>
      <UploadCard
        imageUris={vehicleDocumentImages}
        onAdd={() => openGallery("vehicleDocumentsAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "vehicleDocuments0" : "vehicleDocuments1")}
        onRemove={(index) =>
          setVehicleDocumentImages((current) =>
            current.filter((_, imageIndex) => imageIndex !== index)
          )
        }
      />
      <UploadCard
        label="Insurance Certificate"
        required
        info
        imageUris={insuranceImages}
        onAdd={() => openGallery("insuranceAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "insurance0" : "insurance1")}
        onRemove={(index) =>
          setInsuranceImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
        }
      />
      <UploadCard
        label="Vehicle License"
        required
        info
        imageUris={licenseImages}
        onAdd={() => openGallery("licenseAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "license0" : "license1")}
        onRemove={(index) =>
          setLicenseImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
        }
      />
      <UploadCard
        label="Proof of Vehicle Ownership"
        required
        info
        imageUris={ownershipImages}
        onAdd={() => openGallery("ownershipAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "ownership0" : "ownership1")}
        onRemove={(index) =>
          setOwnershipImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
        }
      />
      <UploadCard
        label="Roadworthiness Certificate"
        required
        info
        imageUris={roadworthyImages}
        onAdd={() => openGallery("roadworthyAdd")}
        onSlotPress={(index) => openGallery(index === 0 ? "roadworthy0" : "roadworthy1")}
        onRemove={(index) =>
          setRoadworthyImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
        }
      />

      <VerificationSelectModal
        title="Select vehicle type"
        visible={showVehicleTypeModal}
        value={vehicleType}
        options={VEHICLE_TYPE_OPTIONS}
        onClose={() => setShowVehicleTypeModal(false)}
        onSelect={setVehicleType}
      />
    </VerificationScreen>
  );
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
