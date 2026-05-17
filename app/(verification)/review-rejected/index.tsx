import { ReviewStatusScreen, VerificationRejectedHeroIcon } from "@/components/verification/review-status-ui";

export default function ReviewRejectedScreen() {
  return (
    <ReviewStatusScreen
      title="Verification Not Approved"
      description={
        "We couldn’t verify some of your details.\nPlease review the information provided\nand update the required sections to\ncontinue."
      }
      icon={<VerificationRejectedHeroIcon />}
      timelineStatus="rejected"
      detailStatus="rejected"
      nextDisabled
    />
  );
}
