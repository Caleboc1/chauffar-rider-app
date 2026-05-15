import { router } from "expo-router";

import {
  FaceCaptureFrame,
  VerificationScreen,
  VerificationSectionTitle,
  VerificationSubtext,
} from "@/components/verification/verification-ui";

export default function FaceCaptureScreen() {
  return (
    <VerificationScreen activeStep={2} onNext={() => router.push("/(verification)/vehicle-info")}>
      <VerificationSectionTitle>Verify Your Identity</VerificationSectionTitle>
      <VerificationSubtext>
        Please capture a clear photo of your face. This helps us confirm it&apos;s really you and
        keeps the platform safe for everyone.
      </VerificationSubtext>

      <FaceCaptureFrame />
    </VerificationScreen>
  );
}
