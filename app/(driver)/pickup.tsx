import { Redirect } from "expo-router";

import { DriverPickupScreen } from "@/components/driver/driver-pickup-screen";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export default function DriverPickupRoute() {
  const { activeRide } = useDriverMockState();

  if (!activeRide) {
    return <Redirect href="/(driver)/home-online" />;
  }

  return <DriverPickupScreen request={activeRide} />;
}
