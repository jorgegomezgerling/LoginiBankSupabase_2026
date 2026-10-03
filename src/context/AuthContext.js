import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";
import { parseAuthUrl } from "../utils/parseAuthUrl";

const RECOVERY_KEY = "ibank:recovery-pending";
const HANDLED_LINK_KEY = "ibank:last-auth-link";
const EXPIRED_CONFIRM =
  "El enlace de confirmación venció o no es válido. Iniciá sesión para pedir uno nuevo.";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryError, setRecoveryError] = useState(false);
  const [authEntry, setAuthEntry] = useState("Login"); // primera pantalla del stack de auth
  const [flash, setFlash] = useState(null); // { type, text } para mostrar en Login

  const url = Linking.useURL();
  const lastUrl = useRef(null);

  const enterRecovery = useCallback(async (withError) => {
    setRecoveryError(withError);
    setIsRecovery(true);
    if (!withError) await AsyncStorage.setItem(RECOVERY_KEY, "1");
  }, []);

  // 1. Sesión inicial + escucha de cambios
  useEffect(() => {
    let mounted = true;

    (async () => {
      const [{ data }, pending] = await Promise.all([
        supabase.auth.getSession(),
        AsyncStorage.getItem(RECOVERY_KEY),
      ]);
      if (!mounted) return;
      setSession(data.session);
      if (pending && data.session) setIsRecovery(true);
      else if (pending) AsyncStorage.removeItem(RECOVERY_KEY);
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === "PASSWORD_RECOVERY") enterRecovery(false); // por compatibilidad (ver "Antes de empezar")
      setSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [enterRecovery]);

  // 2. Deep links de los emails
  useEffect(() => {
    if (!url || url === lastUrl.current) return;
    lastUrl.current = url;
    handleAuthUrl(url);
  }, [url]);

  const handleAuthUrl = async (incomingUrl) => {
    const params = parseAuthUrl(incomingUrl);
    // Expo Go re-entrega el último link al recargar: no procesar dos veces el mismo
    const linkId = params.access_token
      ? `${params.type}:${params.expires_at}`
      : incomingUrl;
    if ((await AsyncStorage.getItem(HANDLED_LINK_KEY)) === linkId) return;
    await AsyncStorage.setItem(HANDLED_LINK_KEY, linkId);

    const isReset =
      incomingUrl.includes("reset-password") || params.type === "recovery";

    if (params.error || params.error_code) {
      if (isReset) enterRecovery(true);
      else setFlash({ type: "error", text: EXPIRED_CONFIRM });
      return;
    }

    // URL sin tokens (por ejemplo, la URL normal de Expo Go): no hay nada que hacer
    if (!params.access_token || !params.refresh_token) return;

    if (isReset) await enterRecovery(false); // ANTES de setSession

    const { error } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });

    if (error) {
      if (isReset) enterRecovery(true);
      else setFlash({ type: "error", text: EXPIRED_CONFIRM });
    }
  };

  // 3. Salidas del modo recuperación
  const finishRecovery = async () => {
    await supabase.auth.signOut(); // no dejar logueado con la sesión temporal (regla 6.5)
    await AsyncStorage.removeItem(RECOVERY_KEY);
    setAuthEntry("Login");
    setFlash({
      type: "success",
      text: "Tu contraseña se actualizó. Ingresá con la nueva.",
    });
    setRecoveryError(false);
    setIsRecovery(false);
  };

  const exitRecovery = async (goTo = "Login") => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(RECOVERY_KEY);
    setAuthEntry(goTo);
    setRecoveryError(false);
    setIsRecovery(false);
  };

  // 4. Logout (regla 7.3): signOut borra la sesión de AsyncStorage
  const signOut = async () => {
    setAuthEntry("Login");
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    isRecovery,
    recoveryError,
    authEntry,
    flash,
    setFlash,
    finishRecovery,
    exitRecovery,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
