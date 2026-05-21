import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

type SliderChevronIconProps = {
  width?: number;
  height?: number;
};

export default function SliderChevronIcon({
  width = 30,
  height = 14,
}: SliderChevronIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 30 14" fill="none">
      <Defs>
        <LinearGradient id="slider-chevron-gradient" x1="29" y1="7" x2="1" y2="7" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#131313" />
          <Stop offset="1" stopColor="#131313" stopOpacity="0.4" />
        </LinearGradient>
      </Defs>
      <Path
        d="M1 1L7 7L1 13M12 1L18 7L12 13M23 1L29 7L23 13"
        stroke="url(#slider-chevron-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
