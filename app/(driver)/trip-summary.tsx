import { Redirect } from "expo-router";

import { DriverTripSummaryScreen } from "@/components/driver/driver-trip-summary-screen";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export default function DriverTripSummaryRoute() {
  const { activeRide } = useDriverMockState();

  if (!activeRide) {
    return <Redirect href="/(driver)/home-online" />;
  }

  return <DriverTripSummaryScreen />;
}
