import type { ReactNode } from "react";
import { Text, View } from "react-native";

type AuthFieldProps = {
  label: string;
  children: ReactNode;
  labelClassName?: string;
};

export function AuthField({
  label,
  children,
  labelClassName = "mb-2.5 ml-0.5 text-[13px] text-[#F0F0F0]",
}: AuthFieldProps) {
  return (
    <View>
      {label ? <Text className={labelClassName}>{label}</Text> : null}
      {children}
    </View>
  );
}
