import { Stack } from "expo-router";

export default function VerificationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="driver-info" />
      <Stack.Screen name="face-capture" />
      <Stack.Screen name="vehicle-info" />
      <Stack.Screen name="review-progress" />
      <Stack.Screen name="review-approved" />
      <Stack.Screen name="review-rejected" />
      <Stack.Screen name="property-process" />
    </Stack>
  );
}
