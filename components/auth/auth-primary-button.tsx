import { Text, TouchableOpacity } from "react-native";

import { AUTH_GREEN } from "@/features/auth/constants";

type AuthPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};

export function AuthPrimaryButton({
  label,
  onPress,
  disabled = false,
  className = "h-14 w-full rounded-full items-center justify-center",
}: AuthPrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      disabled={disabled}
      className={className}
      style={{ backgroundColor: disabled ? "#A5A5A5" : AUTH_GREEN }}
    >
      <Text className="text-[15px] font-semibold" style={{ color: "#0A0A0A" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
