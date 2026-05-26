import * as React from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  FeBlend,
  FeColorMatrix,
  FeFlood,
  FeGaussianBlur,
  FeMorphology,
  FeOffset,
  Filter,
  G,
  Path,
  Rect,
} from "react-native-svg";

const ChatbgIcon: React.FC<React.SVGProps<SVGElement>> = () => (
  <Svg width="192" height="143" fill="none" viewBox="0 0 192 143">
    <G filter="url(#filter0_dd_119_722)" opacity="0.2">
      <Path
        fill="#303030"
        stroke="#fff"
        strokeWidth="2"
        d="m30.77 10.144 96.397 4.719c6.642.325 11.764 5.973 11.439 12.616l-1.977 40.382c-.325 6.643-5.974 11.764-12.616 11.44L15.589 73.992l2.565-52.41c.325-6.643 5.974-11.764 12.616-11.439Z"
      />
      <Path fill="#303030" d="m30.117 23.475 96.396 4.718-1.913 39.08-96.396-4.72z" />
      <Rect width="96.511" height="2" x="30.117" y="23.474" fill="#fff" rx="1" transform="rotate(2.802 30.117 23.474)" />
      <Rect width="96.511" height="2" x="29.209" y="42.015" fill="#fff" rx="1" transform="rotate(2.802 29.209 42.015)" />
      <Rect width="96.511" height="2" x="28.303" y="60.556" fill="#fff" rx="1" transform="rotate(2.802 28.303 60.556)" />
    </G>
    <G filter="url(#filter1_dd_119_722)" opacity="0.2">
      <Path
        fill="#303030"
        stroke="#fff"
        strokeWidth="2"
        d="m162.393 89.077-96.37 5.234c-6.64.36-11.732 6.036-11.371 12.677l.212 3.907c.36 6.641 6.037 11.732 12.677 11.372l108.394-5.887-.865-15.932c-.361-6.64-6.036-11.732-12.677-11.371Z"
      />
      <Circle cx="73.328" cy="108.586" r="6.521" fill="#fff" transform="rotate(-3.109 73.328 108.586)" />
      <Rect width="74.34" height="2" x="88.814" y="106.508" fill="#fff" rx="1" transform="rotate(-3.109 88.814 106.508)" />
    </G>
    <G clipPath="url(#clip0_119_722)" opacity="0.2">
      <Path
        fill="#fff"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M167.917 47.143a11.74 11.74 0 0 1 8.828 14.058c-.893 3.908-3.755 6.62-6.525 8.402a26.6 26.6 0 0 1-4.359 2.236l-.626.245-.293.11-.549.196-.487.163-.599.187a2.44 2.44 0 0 1-2.357-.539l-.459-.428-.568-.558-.208-.215-.442-.466a27 27 0 0 1-3.186-4.161c-1.721-2.81-3.121-6.494-2.228-10.403a11.74 11.74 0 0 1 14.058-8.827m-.581 2.543a9.13 9.13 0 0 0-10.934 6.865c-.675 2.953.35 5.913 1.908 8.458a23.5 23.5 0 0 0 2.27 3.074l.488.548q.237.262.459.49l.423.431.375.366.319.299.656-.21.534-.186q.426-.15.918-.348l.677-.281a23.4 23.4 0 0 0 3.38-1.783c2.509-1.614 4.718-3.837 5.393-6.79a9.13 9.13 0 0 0-6.866-10.933m-.872 3.814a5.218 5.218 0 1 1-2.325 10.173 5.218 5.218 0 0 1 2.325-10.173m-.581 2.543a2.608 2.608 0 1 0-1.162 5.084 2.608 2.608 0 0 0 1.162-5.084"
      />
    </G>
    <Path stroke="#fff" strokeLinecap="round" strokeWidth="3" d="m22.5 91.977-21 4m17 7.5-14 9.5m23-4-5 9.5" opacity="0.2" />
    <Defs>
      <Filter id="filter0_dd_119_722" width="153.773" height="99.878" x="0.195" y="0" filterUnits="userSpaceOnUse">
        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
        <FeColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <FeOffset dy="1.304" />
        <FeGaussianBlur stdDeviation="1.956" />
        <FeColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
        <FeBlend in2="BackgroundImageFix" result="effect1_dropShadow_119_722" />
        <FeColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <FeMorphology in="SourceAlpha" operator="dilate" radius="3.913" result="effect2_dropShadow_119_722" />
        <FeOffset dy="5.217" />
        <FeGaussianBlur stdDeviation="5.217" />
        <FeColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        <FeBlend in2="effect1_dropShadow_119_722" result="effect2_dropShadow_119_722" />
        <FeBlend in="SourceGraphic" in2="effect2_dropShadow_119_722" result="shape" />
      </Filter>
      <Filter id="filter1_dd_119_722" width="152.046" height="63.918" x="39.288" y="78.929" filterUnits="userSpaceOnUse">
        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
        <FeColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <FeOffset dy="1.304" />
        <FeGaussianBlur stdDeviation="1.956" />
        <FeColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
        <FeBlend in2="BackgroundImageFix" result="effect1_dropShadow_119_722" />
        <FeColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <FeMorphology in="SourceAlpha" operator="dilate" radius="3.913" result="effect2_dropShadow_119_722" />
        <FeOffset dy="5.217" />
        <FeGaussianBlur stdDeviation="5.217" />
        <FeColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        <FeBlend in2="effect1_dropShadow_119_722" result="effect2_dropShadow_119_722" />
        <FeBlend in="SourceGraphic" in2="effect2_dropShadow_119_722" result="shape" />
      </Filter>
      <ClipPath id="clip0_119_722">
        <Path fill="#fff" d="m153.242 41.113 30.514 6.974-6.974 30.514-30.514-6.974z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default ChatbgIcon;
