import { Redirect } from "expo-router";

import { DriverConfirmPaymentScreen } from "@/components/driver/driver-confirm-payment-screen";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export default function DriverConfirmPaymentRoute() {
  const { activeRide } = useDriverMockState();

  if (!activeRide) {
    return <Redirect href="/(driver)/home-online" />;
  }

  return <DriverConfirmPaymentScreen request={activeRide} />;
}
