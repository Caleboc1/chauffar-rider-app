import { Text, View } from "react-native";

import { StatusCheckIcon, StatusErrorIcon } from "@/components/auth/auth-icons";
import { AUTH_GREEN } from "@/features/auth/constants";

type AuthStatusRowProps = {
  label: string;
  tone: "success" | "error";
  className?: string;
};

export function AuthStatusRow({
  label,
  tone,
  className = "mt-1.5 flex-row items-center gap-x-2",
}: AuthStatusRowProps) {
  return (
    <View className={className}>
      {tone === "success" ? <StatusCheckIcon /> : <StatusErrorIcon />}
      <Text className="text-[13px]" style={{ color: tone === "success" ? AUTH_GREEN : "#FF4444" }}>
        {label}
      </Text>
    </View>
  );
}
