import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="create-account" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="password-success" />
    </Stack>
  );
}
