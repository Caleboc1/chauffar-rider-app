import { Redirect } from "expo-router";

import { DriverDestinationScreen } from "@/components/driver/driver-destination-screen";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export default function DriverDestinationRoute() {
  const { activeRide } = useDriverMockState();

  if (!activeRide) {
    return <Redirect href="/(driver)/home-online" />;
  }

  return <DriverDestinationScreen request={activeRide} />;
}
