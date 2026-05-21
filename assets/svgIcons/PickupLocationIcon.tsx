import Svg, { Rect } from "react-native-svg";

export default function PickupLocationIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Rect x="1" y="1" width="14" height="14" rx="7" stroke="#332BAA" strokeWidth="2" />
      <Rect x="4" y="4" width="8" height="8" rx="4" fill="#332BAA" />
    </Svg>
  );
}
