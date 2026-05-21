import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from "react-native-svg";

type DriverLocationMarkerProps = {
  size?: number;
};

export default function DriverLocationMarker({ size = 84 }: DriverLocationMarkerProps) {
  const center = size / 2;
  const strokeWidth = 1.4;
  const ringRadius = center - strokeWidth;
  const iconSize = size * 0.214;
  const iconScale = iconSize / 18;
  const iconTranslateX = center - iconSize / 2;
  const iconTranslateY = center - iconSize / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Defs>
        <LinearGradient id="driver-location-ring" x1="0%" y1="50%" x2="100%" y2="50%">
          <Stop offset="0%" stopColor="#0DFF91" />
          <Stop offset="100%" stopColor="#DFB400" />
        </LinearGradient>
      </Defs>

      <Circle
        cx={center}
        cy={center}
        r={ringRadius}
        fill="none"
        stroke="url(#driver-location-ring)"
        strokeWidth={strokeWidth}
      />
      <G transform={`translate(${iconTranslateX} ${iconTranslateY}) scale(${iconScale})`}>
        <Path
          fill="#FFF"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.3682 4.30164C18.5822 1.75164 15.9202 -0.911364 13.3692 0.302636L1.71023 5.85464C-0.679773 6.99264 -0.531773 10.4436 1.94723 11.3726L4.68623 12.3996C4.81983 12.4498 4.94116 12.5279 5.04206 12.6288C5.14296 12.7297 5.2211 12.851 5.27123 12.9846L6.29823 15.7246C7.22823 18.2026 10.6782 18.3506 11.8162 15.9606L17.3682 4.30164Z"
        />
      </G>
    </Svg>
  );
}
