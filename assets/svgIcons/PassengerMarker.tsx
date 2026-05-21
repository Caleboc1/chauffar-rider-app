import Svg, { Circle, Path } from "react-native-svg";

type PassengerMarkerProps = {
  size?: number;
  arrived?: boolean;
};

export default function PassengerMarker({ size = 54, arrived = false }: PassengerMarkerProps) {
  const center = size / 2;
  const strokeRadius = center - 1.5;
  const iconScale = (size * 0.41) / 22;
  const iconTranslate = center - (22 * iconScale) / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {arrived ? (
        <Circle cx={center} cy={center} r={strokeRadius + 7} fill="#0DFF9133" />
      ) : null}
      <Circle
        cx={center}
        cy={center}
        r={strokeRadius}
        fill="#FFF"
        stroke={arrived ? "#0DFF91" : "#FFF"}
        strokeWidth={3}
      />
      <Path
        d="M10.5333 10.5331C12.9572 10.5331 14.9222 8.56818 14.9222 6.14426C14.9222 3.72034 12.9572 1.75537 10.5333 1.75537C8.10938 1.75537 6.14441 3.72034 6.14441 6.14426C6.14441 8.56818 8.10938 10.5331 10.5333 10.5331Z"
        fill="#1E7D19"
        transform={`translate(${iconTranslate} ${iconTranslate}) scale(${iconScale})`}
      />
      <Path
        d="M10.5333 12.7275C6.13565 12.7275 2.55432 15.6769 2.55432 19.3109C2.55432 19.5567 2.74743 19.7498 2.99321 19.7498H18.0734C18.3192 19.7498 18.5123 19.5567 18.5123 19.3109C18.5123 15.6769 14.931 12.7275 10.5333 12.7275Z"
        fill="#1E7D19"
        transform={`translate(${iconTranslate} ${iconTranslate}) scale(${iconScale})`}
      />
    </Svg>
  );
}
