import { router } from "expo-router";

import {
  ReviewStatusScreen,
  VerificationApprovedHeroIcon,
} from "@/components/verification/review-status-ui";

export default function ReviewApprovedScreen() {
  return (
    <ReviewStatusScreen
      title="Verification Approved"
      description={
        "Your details have been successfully\nreviewed and approved. You can now start\naccepting ride requests and earning."
      }
      icon={<VerificationApprovedHeroIcon />}
      timelineStatus="approved"
      detailStatus="approved"
      onContinue={() => router.replace("/(auth)/login")}
    />
  );
}
