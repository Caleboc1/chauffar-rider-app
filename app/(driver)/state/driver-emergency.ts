import {
  Fields,
  SortTypes,
  getContactsAsync,
  requestPermissionsAsync,
  type ExistingContact,
} from "expo-contacts";
import { create } from "zustand";

export type EmergencyMode = "live-location" | "broadcast-message" | "audio";

export type EmergencyContactOption = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber: string;
};

export type ManagedEmergencyContact = {
  id: string;
  fullName: string;
  relationship: string;
  phoneCode: string;
  phoneNumber: string;
  accentColor: string;
};

type EmergencyStore = {
  selectedContactIds: string[];
  trustedContactIds: string[];
  managedContacts: ManagedEmergencyContact[];
  alertMessage: string;
  recordingDurationSeconds: number;
  setSelectedContactIds: (contactIds: string[]) => void;
  setTrustedContactIds: (contactIds: string[]) => void;
  addManagedContact: (contact: Omit<ManagedEmergencyContact, "id" | "accentColor">) => void;
  updateManagedContact: (contactId: string, updates: Omit<ManagedEmergencyContact, "id" | "accentColor">) => void;
  removeManagedContact: (contactId: string) => void;
  setAlertMessage: (message: string) => void;
  setRecordingDurationSeconds: (seconds: number) => void;
  resetEmergencyState: () => void;
};

const DEFAULT_ALERT_MESSAGE =
  "This is an emergency. I am currently on a ride with Chauffar. Please check on me and stay available.";

const EMERGENCY_CONTACT_ACCENTS = ["#5B3F9B", "#7B5629", "#295B32", "#2C5A87", "#7A2F54"];

const DEFAULT_MANAGED_CONTACTS: ManagedEmergencyContact[] = [];

function getManagedContactAccent(index: number) {
  return EMERGENCY_CONTACT_ACCENTS[index % EMERGENCY_CONTACT_ACCENTS.length];
}

function createManagedContactId() {
  return `emergency-contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeEmergencyContact(
  contact: ExistingContact,
): EmergencyContactOption | null {
  const primaryPhone =
    contact.phoneNumbers?.find((entry) => entry.isPrimary && entry.number)?.number ??
    contact.phoneNumbers?.find((entry) => entry.number)?.number;

  if (!primaryPhone) {
    return null;
  }

  const firstName = contact.firstName?.trim() || contact.name?.trim() || "";
  const lastName = contact.lastName?.trim() || "";
  const displayName =
    `${firstName} ${lastName}`.trim() || contact.name?.trim() || "Unknown contact";

  return {
    id: contact.id,
    firstName,
    lastName,
    displayName,
    phoneNumber: primaryPhone,
  };
}

export async function loadEmergencyContacts() {
  const permission = await requestPermissionsAsync();

  if (permission.status !== "granted") {
    return {
      permissionStatus: permission.status,
      contacts: [] as EmergencyContactOption[],
    };
  }

  const response = await getContactsAsync({
    fields: [
      Fields.FirstName,
      Fields.LastName,
      Fields.Name,
      Fields.PhoneNumbers,
    ],
    sort: SortTypes.FirstName,
  });

  return {
    permissionStatus: permission.status,
    contacts: response.data
      .map(normalizeEmergencyContact)
      .filter((contact): contact is EmergencyContactOption => Boolean(contact)),
  };
}

export function getEmergencyModeCopy(mode: EmergencyMode) {
  switch (mode) {
    case "live-location":
      return {
        title: "Share live location",
        subtitle:
          "Choose the contacts who should receive your current ride location and live progress.",
        actionLabel: "Share live location",
        successTitle: "Live location shared",
        successDescription:
          "Your selected contacts have been alerted with your live ride location and trip status.",
      };
    case "broadcast-message":
      return {
        title: "Broadcast message",
        subtitle:
          "Choose who should receive your emergency alert message so they can respond quickly.",
        actionLabel: "Send message",
        successTitle: "Emergency message sent",
        successDescription:
          "Your emergency message has been sent to the selected contacts.",
      };
    case "audio":
      return {
        title: "Send audio recording",
        subtitle:
          "Pick the contacts who should receive the audio note you just recorded.",
        actionLabel: "Send recording",
        successTitle: "Audio recording shared",
        successDescription:
          "Your recorded audio note has been shared with the selected contacts.",
      };
    default:
      return {
        title: "Emergency action",
        subtitle: "",
        actionLabel: "Continue",
        successTitle: "Completed",
        successDescription: "Your emergency action has been completed.",
      };
  }
}

export const useDriverEmergencyStore = create<EmergencyStore>((set) => ({
  selectedContactIds: [],
  trustedContactIds: [],
  managedContacts: DEFAULT_MANAGED_CONTACTS,
  alertMessage: DEFAULT_ALERT_MESSAGE,
  recordingDurationSeconds: 0,
  setSelectedContactIds: (selectedContactIds) => set({ selectedContactIds }),
  setTrustedContactIds: (trustedContactIds) => set({ trustedContactIds }),
  addManagedContact: (contact) =>
    set((state) => ({
      managedContacts: [
        ...state.managedContacts,
        {
          id: createManagedContactId(),
          accentColor: getManagedContactAccent(state.managedContacts.length),
          ...contact,
        },
      ],
    })),
  updateManagedContact: (contactId, updates) =>
    set((state) => ({
      managedContacts: state.managedContacts.map((contact) =>
        contact.id === contactId ? { ...contact, ...updates } : contact,
      ),
    })),
  removeManagedContact: (contactId) =>
    set((state) => ({
      managedContacts: state.managedContacts.filter((contact) => contact.id !== contactId),
    })),
  setAlertMessage: (alertMessage) => set({ alertMessage }),
  setRecordingDurationSeconds: (recordingDurationSeconds) =>
    set({ recordingDurationSeconds }),
  resetEmergencyState: () =>
    set({
      selectedContactIds: [],
      trustedContactIds: [],
      managedContacts: DEFAULT_MANAGED_CONTACTS,
      alertMessage: DEFAULT_ALERT_MESSAGE,
      recordingDurationSeconds: 0,
    }),
}));
