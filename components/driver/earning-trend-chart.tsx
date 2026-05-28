import { Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center">
      <View className="mr-2 h-0.5 w-7" style={{ backgroundColor: color }} />
      <Text className="text-[12px] text-white">{label}</Text>
    </View>
  );
}

export function EarningTrendChart() {
  return (
    <View>
      <Svg width="100%" height="250" viewBox="0 0 320 250">
        <Defs>
          <LinearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7B61FF" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#7B61FF" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {[0, 1, 2, 3, 4].map((row) => (
          <Path key={`h-${row}`} d={`M42 ${24 + row * 42}H306`} stroke="#3A3A3A" strokeDasharray="2 3" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((col) => (
          <Path key={`v-${col}`} d={`M${42 + col * 44} 24V192`} stroke="#3A3A3A" strokeDasharray="2 3" />
        ))}
        <Path d="M42 192 C55 100, 72 112, 85 104 C115 92, 98 172, 128 148 C155 126, 158 78, 187 68 C226 53, 211 151, 236 192 L306 192" fill="url(#earningsFill)" />
        <Path d="M42 112 C58 96, 70 98, 84 91 C112 80, 103 158, 129 140 C155 120, 163 77, 190 61 C224 42, 212 135, 238 192 H306" fill="none" stroke="#7B61FF" strokeWidth="2" />
        <Path d="M42 138 C56 90, 70 88, 84 126 C106 174, 122 137, 132 124 C155 91, 169 72, 190 58 C226 34, 210 139, 236 192 H306" fill="none" stroke="#FF7474" strokeWidth="2" />
      </Svg>
      <View className="flex-row justify-center gap-8">
        <LegendDot color="#7B61FF" label="Earnings (₦)" />
        <LegendDot color="#FF7474" label="Completed Rides" />
      </View>
    </View>
  );
}
