import Svg, {
  Circle,
  ClipPath,
  Defs,
  FeBlend,
  FeColorMatrix,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  Path,
  Rect,
} from "react-native-svg";

export default function CancelRideIcon() {
  return (
    <Svg width={102} height={102} viewBox="0 0 102 102" fill="none">
      <G clipPath="url(#clip0_cancel)">
        <G filter="url(#filter0_cancel)">
          <Circle cx="51.5" cy="138.5" r="51.5" fill="#FB3748" />
        </G>
        <G filter="url(#filter1_cancel)">
          <Circle cx="51.5" cy="138.5" r="51.5" fill="#FB3748" />
        </G>
        <G filter="url(#filter2_cancel)">
          <Circle cx="51" cy="51" r="35" fill="#FB3748" />
        </G>
        <Path
          d="M51.0004 53.4499L42.4254 62.0249C42.1046 62.3457 41.6962 62.5062 41.2004 62.5062C40.7046 62.5062 40.2962 62.3457 39.9754 62.0249C39.6546 61.7041 39.4941 61.2957 39.4941 60.7999C39.4941 60.3041 39.6546 59.8957 39.9754 59.5749L48.5504 50.9999L39.9754 42.4249C39.6546 42.1041 39.4941 41.6957 39.4941 41.1999C39.4941 40.7041 39.6546 40.2957 39.9754 39.9749C40.2962 39.6541 40.7046 39.4937 41.2004 39.4937C41.6962 39.4937 42.1046 39.6541 42.4254 39.9749L51.0004 48.5499L59.5754 39.9749C59.8962 39.6541 60.3046 39.4937 60.8004 39.4937C61.2962 39.4937 61.7046 39.6541 62.0254 39.9749C62.3462 40.2957 62.5066 40.7041 62.5066 41.1999C62.5066 41.6957 62.3462 42.1041 62.0254 42.4249L53.4504 50.9999L62.0254 59.5749C62.3462 59.8957 62.5066 60.3041 62.5066 60.7999C62.5066 61.2957 62.3462 61.7041 62.0254 62.0249C61.7046 62.3457 61.2962 62.5062 60.8004 62.5062C60.3046 62.5062 59.8962 62.3457 59.5754 62.0249L51.0004 53.4499Z"
          fill="black"
        />
      </G>
      <Defs>
        <Filter id="filter0_cancel" x="-100" y="-13" width="303" height="303" filterUnits="userSpaceOnUse">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <FeGaussianBlur stdDeviation="50" result="effect1_foregroundBlur" />
        </Filter>
        <Filter id="filter1_cancel" x="-100" y="-13" width="303" height="303" filterUnits="userSpaceOnUse">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <FeGaussianBlur stdDeviation="50" result="effect1_foregroundBlur" />
        </Filter>
        <Filter id="filter2_cancel" x="3" y="14" width="96" height="133" filterUnits="userSpaceOnUse">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="2" />
          <FeGaussianBlur stdDeviation="2" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.29 0" />
          <FeBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="8" />
          <FeGaussianBlur stdDeviation="4" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.26 0" />
          <FeBlend in2="effect1_dropShadow" result="effect2_dropShadow" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="17" />
          <FeGaussianBlur stdDeviation="5" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <FeBlend in2="effect2_dropShadow" result="effect3_dropShadow" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="31" />
          <FeGaussianBlur stdDeviation="6" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
          <FeBlend in2="effect3_dropShadow" result="effect4_dropShadow" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="48" />
          <FeGaussianBlur stdDeviation="6.5" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
          <FeBlend in2="effect4_dropShadow" result="effect5_dropShadow" />
          <FeBlend in="SourceGraphic" in2="effect5_dropShadow" result="shape" />
        </Filter>
        <ClipPath id="clip0_cancel">
          <Rect width="102" height="102" rx="51" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
