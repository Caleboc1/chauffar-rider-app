import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AuthField } from "@/components/auth/auth-field";
import { AUTH_GREEN } from "@/features/auth/constants";

type AuthPasswordInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  onSubmitEditing?: () => void;
};

export function AuthPasswordInput({
  label,
  value,
  onChangeText,
  placeholder,
  onSubmitEditing,
}: AuthPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const activeBorder = isFocused ? AUTH_GREEN : "#2A2A2A";
  const glowStyle = isFocused
    ? {
        shadowColor: "#0DFF85",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
      }
    : undefined;

  return (
    <AuthField label={label}>
      <View style={styles.container}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#3A3A3A"
          secureTextEntry={!showPassword}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType={onSubmitEditing ? "done" : "default"}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              borderColor: activeBorder,
              ...glowStyle,
            },
          ]}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#CDD1D6"
          />
        </TouchableOpacity>
      </View>
    </AuthField>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#1C1C1C",
    color: "#fff",
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
});