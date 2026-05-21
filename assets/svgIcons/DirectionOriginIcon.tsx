import Svg, { Rect } from "react-native-svg";

export default function DirectionOriginIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="12" fill="#1B1B28" />
      <Rect x="6" y="5.87451" width="12" height="12" rx="6" fill="#332BAA" />
    </Svg>
  );
}
