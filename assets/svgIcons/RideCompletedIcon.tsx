import Svg, { Circle, Defs, FeBlend, FeColorMatrix, FeFlood, FeGaussianBlur, FeOffset, FeComposite, Filter, G, Path, ClipPath, Rect } from "react-native-svg";

export default function RideCompletedIcon() {
  return (
    <Svg width={102} height={102} viewBox="0 0 102 102" fill="none">
      <G clipPath="url(#clip0)">
        <G filter="url(#filter0)">
          <Circle cx="51.5" cy="138.5" r="51.5" fill="#0DFF91" />
        </G>
        <G filter="url(#filter1)">
          <Circle cx="51.5" cy="138.5" r="51.5" fill="#0DFF91" />
        </G>
        <G filter="url(#filter2)">
          <Circle cx="51" cy="51" r="35" fill="#0DFF91" />
        </G>
        <Path
          d="M51 36C54.5804 36 58.0142 37.4223 60.5459 39.9541C63.0777 42.4858 64.5 45.9196 64.5 49.5C64.5 54.111 61.986 57.885 59.337 60.5925C58.0135 61.9306 56.5694 63.1437 55.023 64.2165L54.384 64.6515L54.084 64.851L53.5185 65.211L53.0145 65.5185L52.3905 65.8815C51.967 66.1233 51.4877 66.2504 51 66.2504C50.5123 66.2504 50.033 66.1233 49.6095 65.8815L48.9855 65.5185L48.2055 65.0385L47.9175 64.851L47.3025 64.4415C45.6342 63.3128 44.0804 62.0236 42.663 60.5925C40.014 57.8835 37.5 54.111 37.5 49.5C37.5 45.9196 38.9223 42.4858 41.4541 39.9541C43.9858 37.4223 47.4196 36 51 36ZM51 45C50.4091 45 49.8239 45.1164 49.2779 45.3425C48.732 45.5687 48.2359 45.9002 47.818 46.318C47.4002 46.7359 47.0687 47.232 46.8425 47.7779C46.6164 48.3239 46.5 48.9091 46.5 49.5C46.5 50.0909 46.6164 50.6761 46.8425 51.2221C47.0687 51.768 47.4002 52.2641 47.818 52.682C48.2359 53.0998 48.732 53.4313 49.2779 53.6575C49.8239 53.8836 50.4091 54 51 54C52.1935 54 53.3381 53.5259 54.182 52.682C55.0259 51.8381 55.5 50.6935 55.5 49.5C55.5 48.3065 55.0259 47.1619 54.182 46.318C53.3381 45.4741 52.1935 45 51 45Z"
          fill="black"
        />
      </G>
      <Defs>
        <Filter id="filter0" x="-100" y="-13" width="303" height="303" filterUnits="userSpaceOnUse">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <FeGaussianBlur stdDeviation="50" result="effect1_foregroundBlur" />
        </Filter>
        <Filter id="filter1" x="-100" y="-13" width="303" height="303" filterUnits="userSpaceOnUse">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <FeGaussianBlur stdDeviation="50" result="effect1_foregroundBlur" />
        </Filter>
        <Filter id="filter2" x="3" y="14" width="96" height="133" filterUnits="userSpaceOnUse">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="2" />
          <FeGaussianBlur stdDeviation="2" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.29 0" />
          <FeBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="8" />
          <FeGaussianBlur stdDeviation="4" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.26 0" />
          <FeBlend in2="effect1_dropShadow" result="effect2_dropShadow" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="17" />
          <FeGaussianBlur stdDeviation="5" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <FeBlend in2="effect2_dropShadow" result="effect3_dropShadow" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="31" />
          <FeGaussianBlur stdDeviation="6" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
          <FeBlend in2="effect3_dropShadow" result="effect4_dropShadow" />
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <FeOffset dy="48" />
          <FeGaussianBlur stdDeviation="6.5" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
          <FeBlend in2="effect4_dropShadow" result="effect5_dropShadow" />
          <FeBlend in="SourceGraphic" in2="effect5_dropShadow" result="shape" />
        </Filter>
        <ClipPath id="clip0">
          <Rect width="102" height="102" rx="51" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
