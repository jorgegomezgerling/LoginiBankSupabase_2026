import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "../theme";

// Ilustraciones exportadas del Figma (Paso 4)
const ILLUSTRATIONS = {
  signin: {
    source: require("../../assets/illustration-signin.png"),
    width: 213,
    height: 165,
  },
  signup: {
    source: require("../../assets/illustration-signup.png"),
    width: 213,
    height: 165,
  },
  email: {
    source: require("../../assets/illustration-email.png"),
    width: 327,
    height: 216,
  },
};

// variant="brand": header violeta + hoja blanca (Sign in, Sign up)
// variant="card":  fondo blanco + formulario en tarjeta (Forgot / Change password)
export default function AuthLayout({
  variant = "card",
  headerTitle,
  title,
  subtitle,
  illustration,
  showBack = true,
  children,
}) {
  const navigation = useNavigation();
  const brand = variant === "brand";
  const art = illustration ? ILLUSTRATIONS[illustration] : null;
  const headerColor = brand ? colors.onPrimary : colors.text;

  const content = (
    <>
      {title ? (
        <Text style={brand ? styles.brandTitle : styles.cardTitle}>
          {title}
        </Text>
      ) : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {art ? (
        <Image
          source={art.source}
          style={[styles.art, { width: art.width, height: art.height }]}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      ) : null}
      <View style={styles.body}>{children}</View>
    </>
  );

  return (
    <SafeAreaView
      style={[styles.safe, brand && styles.safeBrand]}
      edges={["top"]}
    >
      <StatusBar style={brand ? "light" : "dark"} />

      <View style={styles.header}>
        {showBack && navigation.canGoBack() ? (
          <Pressable
            onPress={navigation.goBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={22} color={headerColor} />
          </Pressable>
        ) : null}
        <Text
          style={[styles.headerTitle, { color: headerColor }]}
          accessibilityRole="header"
        >
          {headerTitle}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={[styles.flex, brand && styles.sheet]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {brand ? content : <View style={styles.card}>{content}</View>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  safeBrand: { backgroundColor: colors.primary },
  flex: { flex: 1 },
  header: {
    height: 53,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  back: { minHeight: 44, justifyContent: "center" },
  headerTitle: { ...typography.title2 },
  sheet: {
    marginTop: 15,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    overflow: "hidden",
  },
  content: { flexGrow: 1, padding: spacing.lg },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.card,
    padding: spacing.md,
    ...shadows.card,
  },
  brandTitle: { ...typography.title1, color: colors.primary },
  cardTitle: { ...typography.title2, color: colors.text },
  subtitle: {
    ...typography.caption2,
    color: colors.text,
    marginTop: spacing.xs,
  },
  art: { alignSelf: "center", marginTop: spacing.xl },
  body: { marginTop: spacing.xl, gap: spacing.field },
});
