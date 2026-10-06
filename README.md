# TP3 — Flujo de login iBank × Supabase

Trabajo práctico de **Arquitectura de Programación Móvil 2026** (Lic. en Sistemas de Información, FCyT UADER).

App móvil con el flujo de autenticación completo de una app bancaria: inicio de sesión, registro, confirmación de email, recuperación y cambio de contraseña. El diseño sale del kit de Figma *iBank — Banking & E-Money Management App* y el backend es **Supabase Auth** (no hay API propia).

## Pantallas

| # | Pantalla | Qué hace |
| --- | --- | --- |
| 01 | Iniciar sesión | Email + contraseña, links a "Olvidé mi contraseña" y a Registro |
| 02 | Registro | Alta de cuenta con checklist de contraseña en tiempo real y aceptación de términos |
| 03 | Confirmación pendiente | "Revisá tu email", con reenvío y cooldown de 60 s |
| 04 | Recuperar contraseña | Pide el reset por email con mensaje neutro (anti-enumeración) |
| 05 | Nueva contraseña | Se abre desde el link del email y define la contraseña nueva |

Además hay una pantalla **Home** mínima (saludo + cerrar sesión) para comprobar la sesión.

## Stack

- React Native + Expo (SDK estable actual), en JavaScript
- `@supabase/supabase-js` v2 como cliente de Supabase Auth
- `@react-native-async-storage/async-storage` para persistir la sesión
- `expo-linking` para los deep links de confirmación y reset
- React Navigation (native stack) para la navegación y las rutas protegidas
- react-hook-form + zod para las validaciones de formularios
- Poppins (`@expo-google-fonts/poppins`) y `@expo/vector-icons`

## Requisitos

- Node.js LTS
- App **Expo Go** en el celular (probado en iPhone)
- Un proyecto de Supabase configurado como se describe en [`docs/SUPABASE.md`](docs/SUPABASE.md)

## Instalación

```bash
git clone https://github.com/jorgegomezgerling/tp3-ibank-auth.git
cd tp3-ibank-auth
npm install
```

## Variables de entorno

Copiá el archivo de ejemplo y completalo con los datos de tu proyecto de Supabase (**Project Settings → API Keys / Data API**, o el botón **Connect**):

```bash
cp .env.example .env
```

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key o publishable key>
```

En la app solo va la clave pública (anon / publishable). La `service_role` / secret key **nunca** se usa en el cliente. El archivo `.env` está en `.gitignore` y no se sube al repositorio.

## Cómo correrlo

```bash
npx expo start
```

Escaneá el QR con la cámara del iPhone (o desde Expo Go en Android). Si cambiás el `.env`, reiniciá con `npx expo start -c`.

### Probar los links de email (confirmación y reset)

Los links de los emails vuelven a la app con una dirección de Expo Go del tipo `exp://<IP-de-tu-compu>:8081/--/confirm`. Para que funcionen:

1. `npx expo start` tiene que estar corriendo y el celular en la **misma red Wi-Fi** que la computadora.
2. Esa dirección tiene que estar permitida en Supabase (ver [`docs/SUPABASE.md`](docs/SUPABASE.md), sección *URL Configuration*). Si la IP de tu computadora cambia, hay que actualizarla.
3. Abrí el email **en el celular** y tocá el link una sola vez. Safari va a preguntar si abrir Expo Go: aceptá.

## Estructura

```text
src/
├── lib/supabase.js            # cliente de Supabase + refresh según el estado de la app
├── context/AuthContext.js     # sesión, deep links y modo recuperación
├── navigation/RootNavigator.js# stacks de auth / app / recuperación (rutas protegidas)
├── screens/                   # Splash, Home y las 5 pantallas de auth
├── components/                # AuthLayout, FormField, PrimaryButton, Checkbox, ...
├── hooks/useCooldown.js       # cooldown de 60 s para reintentos
├── utils/                     # validaciones (zod), mapeo de errores, parseo de links
└── theme/index.js             # colores, tipografía y medidas extraídos del Figma
```

## Plataformas probadas

- **iOS** (iPhone con Expo Go): flujo completo probado de punta a punta.
- **Android**: no probado.

## Documentación

- [`docs/DECISIONES.md`](docs/DECISIONES.md) — qué se tomó del Figma, qué se adaptó y qué quedó fuera de alcance.
- [`docs/SUPABASE.md`](docs/SUPABASE.md) — configuración del proyecto de Supabase.
- `docs/capturas/` — capturas y grabación de las pantallas y los flujos de error y éxito.
