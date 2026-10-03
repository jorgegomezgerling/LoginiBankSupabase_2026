import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import PrimaryButton from "../components/PrimaryButton";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const name = user?.user_metadata?.full_name || user?.email;

  const handleLogout = async () => {
    setLoading(true);
    await signOut(); // el navegador vuelve solo a Login
  };

  return (
    <AuthLayout
      showBack={false}
      headerTitle="Inicio"
      title={`Hola, ${name}`}
      subtitle="Iniciaste sesión correctamente."
    >
      <PrimaryButton
        title="Cerrar sesión"
        onPress={handleLogout}
        loading={loading}
        loadingText="Cerrando..."
      />
    </AuthLayout>
  );
}
