// Valores extraídos del Figma iBank (frames Sign in, Sign up y Change password)
export const colors = {
  primary: "#3629B7", // Primary / 1: header, títulos, botón activo, links
  primary2: "#5655B9", // Primary / 2
  primaryDisabled: "#F2F1F9", // Primary / 4: fondo del botón deshabilitado
  onPrimary: "#FFFFFF", // Neutral / 6
  background: "#FFFFFF",
  text: "#343434", // Neutral / 1: texto principal y texto escrito en inputs
  label: "#979797", // labels de inputs (Change password)
  textMuted: "#CACACA", // Neutral / 4: "Forgot your password?"
  placeholder: "#CACACA", // Neutral / 4
  border: "#CBCBCB", // borde de inputs
  borderFocus: "#3629B7", // ADAPTACIÓN: el kit no define estado de foco
  error: "#FF4267", // Semantic / 1
  info: "#0890FE", // Semantic / 2
  warning: "#FFAF2A", // Semantic / 3
  success: "#52D5BA", // Semantic / 4
  inputDisabled: "#F2F1F9",
};

export const fonts = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
};

export const typography = {
  title1: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 28 }, // Title / 1: "Welcome Back"
  title2: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 28 }, // Title / 2: título del header
  body1: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 }, // Body / 1: texto de botones
  body3: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 21 }, // Body / 3: texto de inputs
  caption1: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 }, // Caption / 1: links y labels
  caption2: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 }, // Caption / 2: subtítulos
  caption3: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 }, // "Don't have an account?"
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, field: 20 };
export const radius = { input: 15, button: 15, card: 15, sheet: 30 };
export const sizes = { inputHeight: 44, buttonHeight: 44, minTouch: 44 };

// Card / 1 del kit: sombra 0 4 30 con #3629B7 al 7 %
export const shadows = {
  card: {
    shadowColor: "#3629B7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 3,
  },
};
