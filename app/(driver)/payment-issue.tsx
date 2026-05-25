import { Redirect } from "expo-router";

import { DriverPaymentIssueScreen } from "@/components/driver/driver-payment-issue-screen";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export default function DriverPaymentIssueRoute() {
  const { activeRide } = useDriverMockState();

  if (!activeRide) {
    return <Redirect href="/(driver)/home-online" />;
  }

  return <DriverPaymentIssueScreen />;
}
