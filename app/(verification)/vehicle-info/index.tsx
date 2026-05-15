import {
  UploadCard,
  VerificationChevron,
  VerificationField,
  VerificationScreen,
  VerificationSectionTitle,
} from "@/components/verification/verification-ui";

export default function VehicleInfoScreen() {
  return (
    <VerificationScreen activeStep={3}>
      <VerificationSectionTitle>Vehicle information</VerificationSectionTitle>

      <VerificationField
        label="Vehicle type"
        required
        placeholder="Vehicle type"
        rightIcon={<VerificationChevron />}
      />
      <VerificationField label="Vehicle brand" required placeholder="Vehicle brand" />
      <VerificationField label="Vehicle model" placeholder="Vehicle model" />
      <VerificationField label="Plate number" required placeholder="Plate number" />

      <UploadCard label="Vehicle image (Front)" required />
      <UploadCard label="Vehicle image (Side)" required />
      <UploadCard label="Vehicle image (Interior)" required />

      <VerificationSectionTitle>Vehicle documents</VerificationSectionTitle>
      <UploadCard />
      <UploadCard label="Insurance Certificate" required info />
      <UploadCard label="Vehicle License" required info />
      <UploadCard label="Proof of Vehicle Ownership" required info />
      <UploadCard label="Roadworthiness Certificate" required info />
    </VerificationScreen>
  );
}
