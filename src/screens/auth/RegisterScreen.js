import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";
import { registerSchema } from "../../utils/validation";
import { mapAuthError } from "../../utils/authErrors";
import { startCooldown } from "../../hooks/useCooldown";
import AuthLayout from "../../components/AuthLayout";
import FormField from "../../components/FormField";
import PrimaryButton from "../../components/PrimaryButton";
import FormMessage from "../../components/FormMessage";
import PasswordChecklist from "../../components/PasswordChecklist";
import Checkbox from "../../components/Checkbox";
import TextLink from "../../components/TextLink";

export default function RegisterScreen({ navigation }) {
  const [serverError, setServerError] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { isValid, isSubmitting, isSubmitted },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = watch("password");

  // Si cambia la contraseña, revalidar la confirmación
  useEffect(() => {
    if (getValues("confirmPassword")) trigger("confirmPassword");
  }, [password]);

  const goToPending = (email) => {
    startCooldown(`resend:${email.toLowerCase()}`); // ya se mandó un email
    navigation.replace("ConfirmPending", { email });
  };

  const onSubmit = async ({ fullName, email, password }) => {
    setServerError(null);
    console.log("redirect:", Linking.createURL("confirm"));
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: Linking.createURL("confirm"),
      },
    });

    if (!error) return goToPending(email);

    const { kind, message } = mapAuthError(error);
    if (kind === "user_already_exists") return goToPending(email); // anti-enumeración
    setServerError(message);
  };

  return (
    <AuthLayout
      variant="brand"
      headerTitle="Registrarse"
      title="Bienvenido,"
      subtitle="Hola, creá tu cuenta nueva"
      illustration="signup"
    >
      <FormMessage type="error" text={serverError} />

      <FormField
        control={control}
        name="fullName"
        label="Nombre completo"
        autoComplete="name"
        textContentType="name"
        disabled={isSubmitting}
      />
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
      <FormField
        control={control}
        name="password"
        label="Contraseña"
        secureTextEntry
        hideError
        autoComplete="new-password"
        textContentType="newPassword"
        disabled={isSubmitting}
      />
      <PasswordChecklist value={password} />
      <FormField
        control={control}
        name="confirmPassword"
        label="Repetir contraseña"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        disabled={isSubmitting}
      />

      <Controller
        control={control}
        name="terms"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Checkbox
            checked={value}
            onChange={onChange}
            disabled={isSubmitting}
            error={!!error && isSubmitted}
            label="Acepto los Términos y Condiciones y la Política de Privacidad"
          />
        )}
      />

      <PrimaryButton
        title="Registrarme"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        loading={isSubmitting}
        loadingText="Creando cuenta..."
      />

      <TextLink
        prefix="¿Ya tenés cuenta?"
        label="Iniciá sesión"
        onPress={() => navigation.navigate("Login")}
        disabled={isSubmitting}
      />
    </AuthLayout>
  );
}
