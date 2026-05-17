import { ReviewStatusScreen, VerificationPendingHeroIcon } from "@/components/verification/review-status-ui";

export default function ReviewProgressScreen() {
  return (
    <ReviewStatusScreen
      title="Verification in Progress"
      description={"We've received all your details. Our team\nis reviewing them now"}
      icon={<VerificationPendingHeroIcon />}
      timelineStatus="pending"
      detailStatus="pending"
      nextDisabled
    />
  );
}
