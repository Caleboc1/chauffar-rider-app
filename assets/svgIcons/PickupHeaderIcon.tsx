import Svg, { Rect } from "react-native-svg";

export default function PickupHeaderIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Rect x="1" y="1" width="18" height="18" rx="9" stroke="#332BAA" strokeWidth="2" />
      <Rect x="5" y="4.87451" width="10" height="10" rx="5" fill="#332BAA" />
    </Svg>
  );
}
