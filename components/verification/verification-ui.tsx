import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthBackButton } from "@/components/auth/auth-back-button";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { AUTH_GREEN } from "@/features/auth/constants";

const SCREEN_BG = "#0B0B0B";
const BORDER = "#2B2B2B";
const PLACEHOLDER = "#5C5C5C";
const LABEL = "#F5F5F5";
const MUTED = "#858585";
const SELECTED_GREEN = "#27FF9E";

type StepIndex = 1 | 2 | 3 | 4;

const STEPS: { index: StepIndex; label: string }[] = [
  { index: 1, label: "Personal" },
  { index: 2, label: "Face capture" },
  { index: 3, label: "Vehicle" },
  { index: 4, label: "Review & Approval" },
];

type VerificationScreenProps = {
  activeStep: StepIndex;
  children: ReactNode;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
  showBackButton?: boolean;
  scrollEnabled?: boolean;
};

type VerificationFieldShellProps = {
  label: string;
  required?: boolean;
  rightIcon?: ReactNode;
  children: ReactNode;
};

type SelectOption = {
  label: string;
  value: string;
};

type VerificationSelectFieldProps = {
  label: string;
  required?: boolean;
  placeholder: string;
  value?: string;
  onPress: () => void;
};

type VerificationDateFieldProps = {
  label: string;
  required?: boolean;
  placeholder: string;
  value?: string;
  onPress: () => void;
};

type VerificationAvatarProps = {
  imageUri?: string | null;
  onPress: () => void;
};

type UploadCardProps = {
  label?: string;
  required?: boolean;
  info?: boolean;
  imageUris?: string[];
  onAdd?: () => void;
  onSlotPress?: (index: number) => void;
  onRemove?: (index: number) => void;
};

type SelectModalProps = {
  title: string;
  visible: boolean;
  value?: string;
  options: SelectOption[];
  onClose: () => void;
  onSelect: (value: string) => void;
};

type DatePickerModalProps = {
  title: string;
  visible: boolean;
  value?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function VerificationScreen({
  activeStep,
  children,
  nextLabel = "Next",
  onNext,
  nextDisabled = false,
  showBackButton = true,
  scrollEnabled = true,
}: VerificationScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: SCREEN_BG }}>
      <StatusBar style="light" />

      <View
        className="px-5"
        style={{
          paddingTop: insets.top + 10,
        }}
      >
        <View className="relative mb-8 min-h-10 items-center justify-center">
          {showBackButton ? (
            <AuthBackButton className="absolute left-0 top-0" onPress={() => router.back()} />
          ) : null}
          <Text className="text-[18px] font-semibold text-white">Driver Informations</Text>
        </View>

        <VerificationStepper activeStep={activeStep} />
      </View>

      <ScrollView
        bounces={false}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 26,
          paddingBottom: 140,
        }}
      >
        {children}
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-5"
        style={{
          backgroundColor: SCREEN_BG,
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom, 22),
        }}
      >
        <AuthPrimaryButton
          label={nextLabel}
          onPress={onNext ?? (() => {})}
          disabled={nextDisabled}
          className="h-[58px] w-full rounded-full items-center justify-center"
        />
      </View>
    </View>
  );
}

function VerificationStepper({ activeStep }: { activeStep: StepIndex }) {
  return (
    <View className="flex-row items-start justify-between">
      {STEPS.map((step, index) => {
        const isActive = step.index <= activeStep;
        const isCurrent = step.index === activeStep;
        const nextStep = STEPS[index + 1];
        const connectorActive = nextStep ? nextStep.index <= activeStep : false;

        return (
          <View key={step.index} className="flex-1">
            <View className="flex-row items-center">
              <View
                className="h-5 w-5 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isActive ? AUTH_GREEN : "#171717",
                  borderWidth: isActive ? 0 : 1,
                  borderColor: "#191919",
                }}
              >
                <Text
                  className="text-[11px] font-semibold"
                  style={{ color: isActive ? "#08110C" : "#6A6A6A" }}
                >
                  {step.index}
                </Text>
              </View>

              {index < STEPS.length - 1 ? (
                <View
                  className="mx-1 h-[2px] flex-1"
                  style={{ backgroundColor: connectorActive ? AUTH_GREEN : "#1D1D1D" }}
                />
              ) : null}
            </View>

            <Text
              className="mt-2 text-[11px] leading-4"
              style={{
                color: isCurrent || isActive ? AUTH_GREEN : "#7A7A7A",
                maxWidth: index === 3 ? 88 : undefined,
              }}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function VerificationSectionTitle({ children }: { children: ReactNode }) {
  return <Text className="mb-5 text-[16px] font-semibold text-white">{children}</Text>;
}

export function VerificationSubtext({ children }: { children: ReactNode }) {
  return <Text className="mb-8 text-[14px] leading-7 text-[#8A8A8A]">{children}</Text>;
}

export function VerificationField({
  label,
  required = false,
  rightIcon,
  ...inputProps
}: TextInputProps & { label: string; required?: boolean; rightIcon?: ReactNode }) {
  return (
    <VerificationFieldShell label={label} required={required} rightIcon={rightIcon}>
      <TextInput
        placeholderTextColor={PLACEHOLDER}
        className="flex-1 text-[15px] text-white"
        {...inputProps}
      />
    </VerificationFieldShell>
  );
}

export function VerificationSelectField({
  label,
  required = false,
  placeholder,
  value,
  onPress,
}: VerificationSelectFieldProps) {
  return (
    <VerificationFieldShell
      label={label}
      required={required}
      rightIcon={<VerificationChevron />}
    >
      <Pressable className="flex-1 justify-center" onPress={onPress}>
        <Text
          className="text-[15px]"
          style={{ color: value ? "#FFFFFF" : PLACEHOLDER }}
        >
          {value ?? placeholder}
        </Text>
      </Pressable>
    </VerificationFieldShell>
  );
}

export function VerificationDateField({
  label,
  required = false,
  placeholder,
  value,
  onPress,
}: VerificationDateFieldProps) {
  return (
    <VerificationFieldShell
      label={label}
      required={required}
      rightIcon={<VerificationCalendar />}
    >
      <Pressable className="flex-1 justify-center" onPress={onPress}>
        <Text
          className="text-[15px]"
          style={{ color: value ? "#FFFFFF" : PLACEHOLDER }}
        >
          {value ?? placeholder}
        </Text>
      </Pressable>
    </VerificationFieldShell>
  );
}

function VerificationFieldShell({
  label,
  required = false,
  rightIcon,
  children,
}: VerificationFieldShellProps) {
  return (
    <View className="mb-5">
      <VerificationLabel label={label} required={required} />

      <View
        className="h-[54px] flex-row items-center rounded-[16px] border px-3.5"
        style={{ borderColor: BORDER }}
      >
        {children}
        {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
      </View>
    </View>
  );
}

export function VerificationLabel({
  label,
  required = false,
  info = false,
}: {
  label: string;
  required?: boolean;
  info?: boolean;
}) {
  return (
    <View className="mb-3 flex-row items-center">
      <Text className="text-[14px]" style={{ color: LABEL }}>
        {label}
      </Text>
      {required ? <Text className="ml-1 text-[14px] text-[#FF2B2B]">*</Text> : null}
      {info ? (
        <Ionicons
          name="information-circle"
          size={14}
          color="#8C8C8C"
          style={{ marginLeft: 7, marginTop: 1 }}
        />
      ) : null}
    </View>
  );
}

export function VerificationChevron() {
  return <Ionicons name="chevron-down" size={18} color="#8A8A8A" />;
}

export function VerificationCalendar() {
  return <Ionicons name="calendar-clear-outline" size={18} color="#8A8A8A" />;
}

export function VerificationAvatar({ imageUri, onPress }: VerificationAvatarProps) {
  return (
    <View className="mb-5 items-center">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        className="relative h-[108px] w-[108px] items-center justify-center overflow-hidden rounded-full bg-[#EFEFEF]"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="h-full w-full" contentFit="cover" />
        ) : (
          <Ionicons name="person" size={84} color="#AFAFAF" />
        )}

        <View
          className="absolute bottom-1 right-0 h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: AUTH_GREEN }}
        >
          <Ionicons name="pencil" size={15} color="#05130B" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export function UploadCard({
  label,
  required = false,
  info = false,
  imageUris = [],
  onAdd,
  onSlotPress,
  onRemove,
}: UploadCardProps) {
  return (
    <View className="mb-5">
      {label ? <VerificationLabel label={label} required={required} info={info} /> : null}

      <View className="rounded-[16px] border px-3 py-3" style={{ borderColor: BORDER }}>
        <View className="flex-row items-start">
          <View className="mr-3 h-9 w-9 items-center justify-center rounded-full border border-dashed border-[#8F8F8F]">
            <Ionicons name="cloud-upload-outline" size={16} color="#EEEEEE" />
          </View>

          <View className="flex-1 pr-2">
            <Text className="text-[14px] text-white">Upload photo</Text>
            <Text className="mt-1 text-[12px] leading-5" style={{ color: MUTED }}>
              Upload at least 1 picture of either not{"\n"}less than 10MB
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.82}
            onPress={onAdd}
            className="h-8 min-w-[50px] items-center justify-center rounded-md px-3"
            style={{ backgroundColor: AUTH_GREEN }}
          >
            <Text className="text-[13px] font-semibold text-[#04110A]">+ Add</Text>
          </TouchableOpacity>
        </View>

        <View className="my-3 h-px bg-[#151515]" />

        <View className="flex-row">
          <UploadSlot
            imageUri={imageUris[0]}
            onPress={() => onSlotPress?.(0)}
            onRemove={() => onRemove?.(0)}
          />
          <UploadSlot
            className="ml-2.5"
            imageUri={imageUris[1]}
            onPress={() => onSlotPress?.(1)}
            onRemove={() => onRemove?.(1)}
          />
        </View>
      </View>
    </View>
  );
}

function UploadSlot({
  className = "",
  imageUri,
  onPress,
  onRemove,
}: {
  className?: string;
  imageUri?: string;
  onPress?: () => void;
  onRemove?: () => void;
}) {
  if (imageUri) {
    return (
      <View className={`relative h-[62px] w-[62px] overflow-hidden rounded-[8px] ${className}`.trim()}>
        <Image source={{ uri: imageUri }} className="h-full w-full" contentFit="cover" />
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRemove}
          className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-black/70"
        >
          <Ionicons name="close" size={12} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      className={`h-[62px] w-[62px] items-center justify-center rounded-[8px] border border-dashed ${className}`.trim()}
      style={{ borderColor: "#353535" }}
    >
      <Ionicons name="add" size={18} color="#545454" />
    </TouchableOpacity>
  );
}

export function VerificationSelectModal({
  title,
  visible,
  value,
  options,
  onClose,
  onSelect,
}: SelectModalProps) {
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
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View className="gap-y-3">
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.82}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  className="flex-row items-center justify-between rounded-[18px] border px-4 py-4"
                  style={{
                    borderColor: selected ? SELECTED_GREEN : BORDER,
                    backgroundColor: selected ? "rgba(39,255,158,0.12)" : "#151515",
                  }}
                >
                  <Text
                    className="text-[15px]"
                    style={{ color: selected ? SELECTED_GREEN : "#F5F5F5" }}
                  >
                    {option.label}
                  </Text>
                  {selected ? <Ionicons name="checkmark" size={18} color={SELECTED_GREEN} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function VerificationDatePickerModal({
  title,
  visible,
  value,
  onClose,
  onConfirm,
}: DatePickerModalProps) {
  const now = new Date();
  const years = Array.from({ length: 70 }, (_, index) => String(now.getFullYear() - index));
  const initialDate = parseDateValue(value) ?? {
    year: years[20] ?? String(now.getFullYear() - 20),
    month: "01",
    day: "01",
  };

  const selectedMonthName = MONTHS[Number(initialDate.month) - 1] ?? MONTHS[0];

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
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <DatePickerColumns
            selectedYear={initialDate.year}
            selectedMonth={selectedMonthName}
            selectedDay={initialDate.day}
            onConfirm={(payload) => {
              const monthNumber = String(MONTHS.indexOf(payload.month) + 1).padStart(2, "0");
              onConfirm(`${payload.year}/${monthNumber}/${payload.day}`);
              onClose();
            }}
            years={years}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function DatePickerColumns({
  selectedYear,
  selectedMonth,
  selectedDay,
  onConfirm,
  years,
}: {
  selectedYear: string;
  selectedMonth: string;
  selectedDay: string;
  onConfirm: (payload: { year: string; month: string; day: string }) => void;
  years: string[];
}) {
  const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
  const [currentYear, setCurrentYear] = useState(selectedYear);
  const [currentMonth, setCurrentMonth] = useState(selectedMonth);
  const [currentDay, setCurrentDay] = useState(selectedDay);

  useEffect(() => {
    setCurrentYear(selectedYear);
    setCurrentMonth(selectedMonth);
    setCurrentDay(selectedDay);
  }, [selectedDay, selectedMonth, selectedYear]);

  return (
    <View>
      <View className="mb-5 flex-row gap-x-3">
        <DateColumn title="Day" items={days} selectedValue={currentDay} onChange={setCurrentDay} />
        <DateColumn
          title="Month"
          items={MONTHS}
          selectedValue={currentMonth}
          onChange={setCurrentMonth}
        />
        <DateColumn
          title="Year"
          items={years}
          selectedValue={currentYear}
          onChange={setCurrentYear}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        className="h-12 items-center justify-center rounded-full"
        style={{ backgroundColor: AUTH_GREEN }}
        onPress={() =>
          onConfirm({
            year: currentYear,
            month: currentMonth,
            day: currentDay,
          })
        }
      >
        <Text className="text-[15px] font-semibold text-[#07110C]">Done</Text>
      </TouchableOpacity>
    </View>
  );
}

function DateColumn({
  title,
  items,
  selectedValue,
  onChange,
}: {
  title: string;
  items: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="flex-1">
      <Text className="mb-3 text-[13px] text-[#8A8A8A]">{title}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="max-h-[260px] rounded-[20px]"
        style={{ backgroundColor: "#151515" }}
      >
        <View className="p-2">
          {items.map((item) => {
            const selected = item === selectedValue;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.82}
                onPress={() => onChange(item)}
                className="mb-2 rounded-[14px] px-3 py-3"
                style={{ backgroundColor: selected ? SELECTED_GREEN : "#1B1B1B" }}
              >
                <Text
                  className="text-center text-[14px]"
                  style={{ color: selected ? "#04110A" : "#FFFFFF" }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function parseDateValue(value?: string) {
  if (!value) {
    return null;
  }

  const parts = value.split("/");
  if (parts.length !== 3) {
    return null;
  }

  const [year, month, day] = parts;
  return { year, month, day };
}

export function FaceCaptureFrame() {
  const cornerBase = "absolute h-[84px] w-[84px] border-[#404040]";

  return (
    <View className="mt-4 items-center">
      <View className="relative h-[360px] w-full max-w-[312px]">
        <View
          className={`${cornerBase} left-4 top-0 rounded-tl-[34px] border-l-[14px] border-t-[14px]`}
        />
        <View
          className={`${cornerBase} right-4 top-0 rounded-tr-[34px] border-r-[14px] border-t-[14px]`}
        />
        <View
          className={`${cornerBase} bottom-0 left-4 rounded-bl-[34px] border-b-[14px] border-l-[14px]`}
        />
        <View
          className={`${cornerBase} bottom-0 right-4 rounded-br-[34px] border-b-[14px] border-r-[14px]`}
        />
      </View>
    </View>
  );
}
