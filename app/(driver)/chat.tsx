import { Redirect } from "expo-router";

import { DriverChatScreen } from "@/components/driver/driver-chat-screen";
import { useDriverMockState } from "@/components/driver/driver-mock-state";

export default function DriverChatRoute() {
  const { activeRide } = useDriverMockState();

  if (!activeRide) {
    return <Redirect href="/(driver)/home-online" />;
  }

  return <DriverChatScreen />;
}
