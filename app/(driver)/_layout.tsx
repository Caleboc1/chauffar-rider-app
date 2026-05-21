import { Stack } from "expo-router";

import { DriverMockStateProvider } from "@/components/driver/driver-mock-state";

export default function DriverLayout() {
  return (
    <DriverMockStateProvider>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </DriverMockStateProvider>
  );
}
