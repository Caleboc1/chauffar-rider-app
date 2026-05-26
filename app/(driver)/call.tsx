import { Redirect } from "expo-router";

import { DriverCallScreen } from "@/components/driver/driver-call-screen";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export default function DriverCallRoute() {
  const { activeRide } = useDriverMockState();

  if (!activeRide) {
    return <Redirect href="/(driver)/home-online" />;
  }

  return <DriverCallScreen />;
}
