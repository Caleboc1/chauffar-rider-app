import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { AuthBackButton } from "@/components/auth/auth-back-button";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canSubmit = password.length >= 6 && password === confirmPassword;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View style={[styles.content, { paddingTop: insets.top + 12 }]}>
          <AuthBackButton className="mb-6" />

          <View style={styles.logoWrap}>
            <BrandLogo size="auth" />
          </View>

          <Text style={styles.title}>Create a new password</Text>
          <Text style={styles.subtitle}>
            Choose a strong password to secure your account.
          </Text>

          <View style={styles.fieldGroup}>
            <View>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#5C5C5C"
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#B1B1B1"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor="#5C5C5C"
                  secureTextEntry={!showConfirmPassword}
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#B1B1B1"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <AuthPrimaryButton
            label="Submit"
            onPress={() => canSubmit && router.replace("/(auth)/password-success")}
            disabled={!canSubmit}
            className="h-14 w-full rounded-full items-center justify-center"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 44,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    marginBottom: 8,
  },
  subtitle: {
    color: "#B1B1B1",
    fontSize: 14,
    lineHeight: 28,
    marginBottom: 32,
  },
  fieldGroup: {
    gap: 20,
  },
  label: {
    color: "#F0F0F0",
    fontSize: 13,
    marginBottom: 10,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    backgroundColor: "#161314",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    paddingRight: 48,
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 20,
  },
});