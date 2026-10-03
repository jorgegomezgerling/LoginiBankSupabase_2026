import { z } from "zod";

const SYMBOLS = /[!@#$%^&*()_+\-=[\]{};'\\:"|<>?,./`~]/;

export const PASSWORD_RULES = [
  { id: "length", label: "Al menos 8 caracteres", test: (v) => v.length >= 8 },
  { id: "upper", label: "Una letra mayúscula", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "Una letra minúscula", test: (v) => /[a-z]/.test(v) },
  { id: "digit", label: "Un número", test: (v) => /[0-9]/.test(v) },
  {
    id: "symbol",
    label: "Un símbolo (!@#$%...)",
    test: (v) => SYMBOLS.test(v),
  },
];

const email = z
  .string()
  .trim()
  .min(1, "Ingresá tu email")
  .email("Ingresá un email válido");

const strongPassword = PASSWORD_RULES.reduce(
  (schema, rule) => schema.refine(rule.test, rule.label),
  z.string(),
);

const passwordsMatch = {
  check: (d) => d.password === d.confirmPassword,
  opts: { message: "Las contraseñas no coinciden", path: ["confirmPassword"] },
};

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Ingresá tu contraseña"),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Ingresá tu nombre"),
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, "Repetí la contraseña"),
    terms: z
      .boolean()
      .refine((v) => v === true, "Tenés que aceptar los términos"),
  })
  .refine(passwordsMatch.check, passwordsMatch.opts);

export const forgotSchema = z.object({ email });

export const newPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, "Repetí la contraseña"),
  })
  .refine(passwordsMatch.check, passwordsMatch.opts);
