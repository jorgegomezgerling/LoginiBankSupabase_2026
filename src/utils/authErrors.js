const MESSAGES = {
  invalid_credentials: "Email o contraseña incorrectos.",
  email_not_confirmed: "Tenés que confirmar tu email antes de ingresar.",
  rate_limit: "Demasiados intentos. Esperá un minuto y volvé a probar.",
  weak_password: "La contraseña no cumple los requisitos de seguridad.",
  same_password: "La contraseña nueva tiene que ser distinta a la anterior.",
  user_already_exists: "Revisá tu email para continuar.", // neutro a propósito
  session_expired: "El enlace venció. Pedí uno nuevo.",
  network: "Sin conexión. Revisá tu internet e intentá de nuevo.",
  unknown: "Ocurrió un error. Intentá de nuevo.",
};

const RATE_LIMIT_CODES = [
  "over_request_rate_limit",
  "over_email_send_rate_limit",
];

export function mapAuthError(error) {
  if (!error) return null;

  let kind = "unknown";
  if (
    error.name === "AuthRetryableFetchError" ||
    /network/i.test(error.message ?? "")
  ) {
    kind = "network";
  } else if (error.status === 429 || RATE_LIMIT_CODES.includes(error.code)) {
    kind = "rate_limit";
  } else if (
    error.code === "session_not_found" ||
    error.code === "otp_expired"
  ) {
    kind = "session_expired";
  } else if (MESSAGES[error.code]) {
    kind = error.code;
  }

  return { kind, message: MESSAGES[kind] };
}
