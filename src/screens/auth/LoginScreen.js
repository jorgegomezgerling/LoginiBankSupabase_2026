import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { loginSchema } from "../../utils/validation";
import { mapAuthError } from "../../utils/authErrors";
import { useCooldown } from "../../hooks/useCooldown";
import AuthLayout from "../../components/AuthLayout";
import FormField from "../../components/FormField";
import PrimaryButton from "../../components/PrimaryButton";
import FormMessage from "../../components/FormMessage";
import TextLink from "../../components/TextLink";

export default function LoginScreen({ navigation }) {
  const { flash, setFlash } = useAuth();
  const [serverError, setServerError] = useState(null);
  const cooldown = useCooldown("login");

  const {
    control,
    handleSubmit,
    resetField,
    formState: { isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }) => {
    setServerError(null);
    setFlash(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) return; // el RootNavigator pasa solo a Home

    const { kind, message } = mapAuthError(error);
    if (kind === "email_not_confirmed") {
      navigation.navigate("ConfirmPending", { email });
      return;
    }
    if (kind === "rate_limit") cooldown.start(60);
    resetField("password"); // no dejar la contraseña en el estado (regla 7.5)
    setServerError(message);
  };

  return (
    <AuthLayout
      variant="brand"
      headerTitle="Iniciar sesión"
      title="Bienvenido"
      subtitle="Hola, iniciá sesión para continuar"
      illustration="signin"
    >
      <FormMessage type={flash?.type} text={flash?.text} />
      <FormMessage type="error" text={serverError} />

      <FormField
        control={control}
        name="email"
        label="Email"
        placeholder="tu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        disabled={isSubmitting}
      />
      <FormField
        control={control}
        name="password"
        label="Contraseña"
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        disabled={isSubmitting}
      />

      <TextLink
        label="¿Olvidaste tu contraseña?"
        onPress={() => navigation.navigate("ForgotPassword")}
        disabled={isSubmitting}
        variant="muted"
        style={{ alignSelf: "flex-end" }}
      />

      <PrimaryButton
        title={
          cooldown.active
            ? `Reintentá en ${cooldown.secondsLeft} s`
            : "Ingresar"
        }
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || cooldown.active}
        loading={isSubmitting}
        loadingText="Ingresando..."
      />

      <TextLink
        prefix="¿No tenés cuenta?"
        label="Registrate"
        onPress={() => navigation.navigate("Register")}
        disabled={isSubmitting}
      />
    </AuthLayout>
  );
}
