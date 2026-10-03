import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";
import { forgotSchema } from "../../utils/validation";
import { mapAuthError } from "../../utils/authErrors";
import { useCooldown } from "../../hooks/useCooldown";
import AuthLayout from "../../components/AuthLayout";
import FormField from "../../components/FormField";
import PrimaryButton from "../../components/PrimaryButton";
import FormMessage from "../../components/FormMessage";
import TextLink from "../../components/TextLink";

const NEUTRAL =
  "Si el email existe en nuestro sistema, vas a recibir instrucciones.";

export default function ForgotPasswordScreen({ navigation }) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const cooldown = useCooldown(
    `reset:${(watch("email") || "").trim().toLowerCase()}`,
  );

  const onSubmit = async ({ email }) => {
    setServerError(null);
    setSent(false);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL("reset-password"),
    });

    if (error) {
      const { kind, message } = mapAuthError(error);
      if (kind === "rate_limit") cooldown.start(60);
      if (kind === "rate_limit" || kind === "network") {
        setServerError(message);
        return;
      }
      // cualquier otro error: mismo mensaje neutro, sin revelar nada
    }
    cooldown.start(60);
    setSent(true);
  };

  return (
    <AuthLayout
      headerTitle="Recuperar contraseña"
      subtitle="Ingresá tu email y te mandamos un enlace para crear una contraseña nueva."
    >
      <FormMessage type="success" text={sent ? NEUTRAL : null} />
      <FormMessage type="error" text={serverError} />

      <FormField
        control={control}
        name="email"
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        disabled={isSubmitting}
      />

      <PrimaryButton
        title={
          cooldown.active
            ? `Reintentá en ${cooldown.secondsLeft} s`
            : "Enviar instrucciones"
        }
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || cooldown.active}
        loading={isSubmitting}
        loadingText="Enviando..."
      />
      <TextLink
        label="Volver a iniciar sesión"
        onPress={() => navigation.navigate("Login")}
        disabled={isSubmitting}
      />
    </AuthLayout>
  );
}
