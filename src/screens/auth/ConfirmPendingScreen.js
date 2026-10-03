import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";
import { mapAuthError } from "../../utils/authErrors";
import { useCooldown } from "../../hooks/useCooldown";
import AuthLayout from "../../components/AuthLayout";
import PrimaryButton from "../../components/PrimaryButton";
import FormMessage from "../../components/FormMessage";
import TextLink from "../../components/TextLink";
import { colors, typography } from "../../theme";

export default function ConfirmPendingScreen({ route, navigation }) {
  const { email } = route.params;
  const cooldown = useCooldown(`resend:${email.toLowerCase()}`);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);

  const resend = async () => {
    setSending(true);
    setMsg(null);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: Linking.createURL("confirm") },
    });
    setSending(false);

    if (!error) {
      cooldown.start(60);
      setMsg({ type: "success", text: "Te reenviamos el email." });
      return;
    }
    const { kind, message } = mapAuthError(error);
    if (kind === "rate_limit") cooldown.start(60);
    setMsg({ type: "error", text: message });
  };

  return (
    <AuthLayout
      headerTitle="Confirmar email"
      illustration="email"
      title="Revisá tu email"
      subtitle="Revisá tu email para continuar. Te enviamos un enlace de confirmación a:"
    >
      <Text style={styles.email} selectable>
        {email}
      </Text>
      <FormMessage type={msg?.type} text={msg?.text} />
      <PrimaryButton
        title={
          cooldown.active
            ? `Reenviar en ${cooldown.secondsLeft} s`
            : "Reenviar email"
        }
        onPress={resend}
        disabled={cooldown.active}
        loading={sending}
        loadingText="Enviando..."
      />
      <TextLink
        label="Volver a iniciar sesión"
        onPress={() => navigation.navigate("Login")}
        disabled={sending}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  email: { ...typography.body1, color: colors.text, textAlign: "center" },
});
