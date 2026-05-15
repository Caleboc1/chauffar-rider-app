import type { RefObject } from "react";
import { useState } from "react";
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

import { AuthField } from "@/components/auth/auth-field";
import { ChevronDown } from "@/components/auth/auth-icons";
import { AUTH_GREEN, COUNTRIES, type Country } from "@/features/auth/constants";

type AuthPhoneInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  inputRef: RefObject<TextInput | null>;
  isFocused: boolean;
  onFocusChange: (isFocused: boolean) => void;
  placeholder: string;
  bottomInset: number;
  borderColor?: string;
  onSubmitEditing?: () => void;
  labelClassName?: string;
  containerClassName?: string;
  variant?: "combined" | "split";
};

export function AuthPhoneInput({
  label,
  value,
  onChangeText,
  selectedCountry,
  onSelectCountry,
  inputRef,
  isFocused,
  onFocusChange,
  placeholder,
  bottomInset,
  borderColor,
  onSubmitEditing,
  labelClassName,
  containerClassName = "flex-row items-center rounded-2xl overflow-hidden",
  variant = "combined",
}: AuthPhoneInputProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectCountry = (country: Country) => {
    onSelectCountry(country);
    setModalVisible(false);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const activeBorder = borderColor ?? (isFocused ? AUTH_GREEN : "#2A2A2A");
  const glowStyle =
    isFocused
      ? {
          shadowColor: "#0DFF85",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 12,
        }
      : undefined;

  return (
    <>
      <AuthField label={label} labelClassName={labelClassName}>
        {variant === "split" ? (
          <View className="flex-row gap-x-2">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.75}
              className="h-14 w-[92px] flex-row items-center justify-center rounded-2xl border bg-[#1C1C1C]"
              style={{
                borderColor: activeBorder,
                ...(glowStyle ?? {}),
              }}
            >
              <Text className="mr-2 text-[22px]">{selectedCountry.flag}</Text>
              <ChevronDown />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              className="flex-1 flex-row items-center rounded-2xl border bg-[#1C1C1C] px-4"
              style={{
                borderColor: activeBorder,
                ...(glowStyle ?? {}),
              }}
            >
              <Text className="pr-3 text-[15px] text-[#AAAAAA]">{selectedCountry.dial}</Text>

              <TextInput
                ref={inputRef}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => onFocusChange(true)}
                onBlur={() => onFocusChange(false)}
                placeholder={placeholder}
                placeholderTextColor="#4E4E4E"
                keyboardType="phone-pad"
                returnKeyType={onSubmitEditing ? "done" : "default"}
                onSubmitEditing={onSubmitEditing}
                className="flex-1 py-4 text-[15px] text-white"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            className={containerClassName}
            style={{
              backgroundColor: "#1C1C1C",
              borderWidth: 1,
              borderColor: activeBorder,
              ...(glowStyle ?? {}),
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.75}
              className="flex-row items-center gap-x-1.5 border-r border-[#2A2A2A] px-4 py-4"
            >
              <Text className="text-[22px]">{selectedCountry.flag}</Text>
              <ChevronDown />
            </TouchableOpacity>

            <Text className="pl-3 pr-1 text-[15px] text-[#AAAAAA]">{selectedCountry.dial}</Text>

            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              placeholder={placeholder}
              placeholderTextColor="#3A3A3A"
              keyboardType="phone-pad"
              returnKeyType={onSubmitEditing ? "done" : "default"}
              onSubmitEditing={onSubmitEditing}
              className="flex-1 py-4 pl-1 pr-4 text-[15px] text-white"
            />
          </TouchableOpacity>
        )}
      </AuthField>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/60"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
        <View
          className="rounded-t-3xl bg-[#1A1A1A] px-5 pt-4"
          style={{ paddingBottom: bottomInset + 16, maxHeight: "60%" }}
        >
          <View className="mb-5 h-1 w-9 self-center rounded-full bg-[#333]" />
          <Text className="mb-4 text-[17px] font-semibold text-white">Select Country</Text>
          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-px bg-[#242424]" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectCountry(item)}
                activeOpacity={0.7}
                className="flex-row items-center gap-x-3 py-3.5"
              >
                <Text className="text-[24px]">{item.flag}</Text>
                <Text className="flex-1 text-[15px] text-white">{item.name}</Text>
                <Text className="text-[14px] text-[#8A8A8A]">{item.dial}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}
