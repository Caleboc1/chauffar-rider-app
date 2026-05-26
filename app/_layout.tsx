import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [{ fontFamily: "Inter" }, Text.defaultProps.style];

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = [{ fontFamily: "Inter" }, TextInput.defaultProps.style];

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(verification)" />
        <Stack.Screen name="(driver)" />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
