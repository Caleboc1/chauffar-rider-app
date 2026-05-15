import { useEffect, useState } from "react";
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
  textContentType?: "password" | "newPassword" | "oneTimeCode";
  autoComplete?: "off" | "password" | "new-password";
  error?: boolean;
};

export function AuthPasswordInput({
  label,
  value,
  onChangeText,
  placeholder,
  onSubmitEditing,
  textContentType = "password",
  autoComplete = "password",
  error = false,
}: AuthPasswordInputProps) {
  const [text, setText] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (value === "" && text !== "") {
      setText("");
    }
  }, [text, value]);

  const isActive = isFocused || text.length > 0;
  const borderColor = error ? "#FF3B4E" : isActive ? AUTH_GREEN : "#2A2A2A";
  const glowStyle =
    isActive && !error
      ? {
          shadowColor: AUTH_GREEN,
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 12,
        }
      : undefined;

  return (
    <AuthField label={label}>
      <View style={[styles.container, { borderColor }, glowStyle]}>
        <TextInput
          value={text}
          onChangeText={(nextValue) => {
            setText(nextValue);
            onChangeText(nextValue);
          }}
          placeholder={placeholder}
          placeholderTextColor="#3A3A3A"
          secureTextEntry={!isVisible}
          textContentType={textContentType}
          autoComplete={autoComplete}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType={onSubmitEditing ? "done" : "default"}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={AUTH_GREEN}
          cursorColor={AUTH_GREEN}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setIsVisible((current) => !current)}
          activeOpacity={0.7}
          style={styles.eyeButton}
        >
          <Ionicons
            name={isVisible ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#8A8A8A"
          />
        </TouchableOpacity>
      </View>
    </AuthField>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1C1C1C",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  eyeButton: {
    paddingLeft: 8,
  },
});
