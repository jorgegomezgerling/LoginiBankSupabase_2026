import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, sizes, spacing, typography } from "../theme";

export default function FormField({
  control,
  name,
  label,
  secureTextEntry,
  disabled,
  hideError,
  hideLabel,
  ...inputProps
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error, isTouched },
        formState: { isSubmitted },
      }) => {
        const showError = !hideError && error && (isTouched || isSubmitted);
        return (
          <View>
            {hideLabel ? null : <Text style={styles.label}>{label}</Text>}
            <View
              style={[
                styles.box,
                focused && styles.focused,
                showError && styles.errorBorder,
                disabled && styles.disabled,
              ]}
            >
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  onBlur();
                }}
                editable={!disabled}
                secureTextEntry={secureTextEntry && hidden}
                placeholderTextColor={colors.placeholder}
                accessibilityLabel={label}
                {...inputProps}
              />
              {secureTextEntry ? (
                <Pressable
                  onPress={() => setHidden((h) => !h)}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel={
                    hidden ? "Mostrar contraseña" : "Ocultar contraseña"
                  }
                >
                  <Ionicons
                    name={hidden ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              ) : null}
            </View>
            {showError ? (
              <Text style={styles.errorText}>{error.message}</Text>
            ) : null}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.sm,
    ...typography.caption1,
    color: colors.label,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: sizes.inputHeight,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
  },
  focused: { borderColor: colors.borderFocus, borderWidth: 2 },
  errorBorder: { borderColor: colors.error },
  disabled: { backgroundColor: colors.inputDisabled },
  input: { flex: 1, ...typography.body3, color: colors.text },
  errorText: { marginTop: spacing.xs, fontSize: 12, color: colors.error },
});
