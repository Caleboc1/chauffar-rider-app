import { Text, TouchableOpacity, type StyleProp, type ViewStyle } from "react-native";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ label, onPress, style }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={style}
      className="min-h-[60px] items-center justify-center rounded-full bg-[#0DFF85] px-6"
    >
      <Text className="text-lg font-medium text-[#07110C]">{label}</Text>
    </TouchableOpacity>
  );
}
