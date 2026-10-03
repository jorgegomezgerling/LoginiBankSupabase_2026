import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { newPasswordSchema } from "../../utils/validation";
import { mapAuthError } from "../../utils/authErrors";
import AuthLayout from "../../components/AuthLayout";
import FormField from "../../components/FormField";
import PrimaryButton from "../../components/PrimaryButton";
import FormMessage from "../../components/FormMessage";
import PasswordChecklist from "../../components/PasswordChecklist";
import TextLink from "../../components/TextLink";
import SplashScreen from "../SplashScreen";

export default function NewPasswordScreen() {
  const { session, recoveryError, finishRecovery, exitRecovery } = useAuth();
  const [serverError, setServerError] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");
  useEffect(() => {
    if (getValues("confirmPassword")) trigger("confirmPassword");
  }, [password]);

  if (recoveryError) {
    return (
      <AuthLayout
        headerTitle="Nueva contraseña"
        title="Enlace inválido"
        subtitle="El enlace para cambiar la contraseña venció o ya fue usado."
        showBack={false}
      >
        <PrimaryButton
          title="Pedir un enlace nuevo"
          onPress={() => exitRecovery("ForgotPassword")}
        />
        <TextLink
          label="Volver a iniciar sesión"
          onPress={() => exitRecovery("Login")}
        />
      </AuthLayout>
    );
  }

  if (!session) return <SplashScreen />; // esperando que el Context haga setSession

  const onSubmit = async ({ password: nueva }) => {
    setServerError(null);
    const { error } = await supabase.auth.updateUser({ password: nueva });
    if (!error) return finishRecovery();
    setServerError(mapAuthError(error).message);
  };

  return (
    <AuthLayout
      headerTitle="Nueva contraseña"
      subtitle="Elegí una contraseña nueva para tu cuenta."
      showBack={false}
    >
      <FormMessage type="error" text={serverError} />
      <FormField
        control={control}
        name="password"
        label="Nueva contraseña"
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
      <PrimaryButton
        title="Guardar contraseña"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        loading={isSubmitting}
        loadingText="Guardando..."
      />
    </AuthLayout>
  );
}
