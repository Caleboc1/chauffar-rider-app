import { Stack } from "expo-router";

export default function VerificationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="property-process" />
    </Stack>
  );
}
