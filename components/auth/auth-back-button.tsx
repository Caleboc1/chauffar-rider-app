import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

import { BackArrow } from "@/components/auth/auth-icons";

type AuthBackButtonProps = {
  className?: string;
  onPress?: () => void;
};

export function AuthBackButton({ className = "", onPress }: AuthBackButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      activeOpacity={0.7}
      className={`-ml-1 h-9 w-9 items-center justify-center ${className}`.trim()}
    >
      <BackArrow />
    </TouchableOpacity>
  );
}
