import Svg, { Rect } from "react-native-svg";

export default function DestinationMapMarker() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="1" width="22" height="22" rx="11" fill="#555279" />
      <Rect x="1" y="1" width="22" height="22" rx="11" stroke="#85858B" strokeWidth="2" />
      <Rect x="6" y="5.87451" width="12" height="12" rx="6" fill="#332BAA" />
    </Svg>
  );
}
