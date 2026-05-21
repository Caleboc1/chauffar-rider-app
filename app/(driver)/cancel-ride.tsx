import { Redirect, useLocalSearchParams } from "expo-router";

import { DriverCancelRideScreen } from "@/components/driver/driver-cancel-ride-screen";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export default function DriverCancelRideRoute() {
  const { activeRide } = useDriverMockState();
  const params = useLocalSearchParams<{ from?: string }>();
  const from = params.from === "destination" ? "destination" : "pickup";

  if (!activeRide) {
    return <Redirect href="/(driver)/home-online" />;
  }

  return <DriverCancelRideScreen from={from} />;
}
