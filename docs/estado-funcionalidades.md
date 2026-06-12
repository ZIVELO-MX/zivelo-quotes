# Estado de Funcionalidades

Auditoría de todo lo que se ve en la UI pero **no funciona todavía**, clasificado por severidad. Complementa [`roadmap.md`](./roadmap.md) — cada item indica la fase sugerida para implementarse.

> Última revisión: 2026-06-12 (post PR #27 Zoho OAuth; PR #28 limpieza de data hardcodeada en revisión).

## Clasificación

| Nivel | Significado |
| --- | --- |
| 🔴 Crítico | La UI muestra **éxito falso**: el usuario cree que guardó algo y no se persistió nada. Engaña activamente. |
| 🟡 Placeholder | El botón existe pero avisa "próximamente" / "no disponible". No engaña, pero ensucia la UX. |
| 🟢 Deuda interna | No visible para el usuario, pero bloquea features futuras. |

---

## 🔴 Crítico — éxito falso

| # | Feature | Ubicación | Qué pasa | Qué falta | Fase |
| --- | --- | --- | --- | --- | --- |
| 1 | Guardar Marca | `settings/page.tsx` → `BrandSection.handleSave()` | Toast "Marca actualizada" pero color primario, logo, WhatsApp, moneda y nombre del negocio viven solo en `useState` — se pierden al recargar | Modelo `Organization` (o `Settings`) en DB + server action `saveBrandSettings` + upload de logo a storage | v0.2.0 |
| 2 | Guardar Cuenta | `settings/page.tsx` → `AccountSection.handleSave()` | Llama `updateUser({ name })` que es un **no-op** (ver 🟢 #1). Toast "Cuenta actualizada" sin persistir | Server action `updateUserProfile` que escriba en el modelo `User` ya existente en DB | v0.2.0 |
| 3 | Guardar Acciones de cotización | `settings/page.tsx` → `QuoteActionsSection.handleSave()` | 3 toggles (aprobación, WhatsApp, PDF) sin persistencia; toast "Acciones de cotización actualizadas" | Persistir defaults en DB y aplicarlos al crear quotes nuevas | v0.2.0 |
| 4 | Invitar usuario | `settings/page.tsx` → `AddParticipantModal` | Genera link `https://quotes.zivelo.dev/accept-invite?token=demo_${Date.now()}` — el token es fake, no se guarda nada, y la ruta `/accept-invite` **no existe** | Tabla `Invitation` con token real, ruta `/accept-invite` que valide y cree el `User`, expiración | v0.5.0 |
| 5 | Cerrar sesión (en Cuenta) | `settings/page.tsx` → `AccountSection`, botón "Cerrar sesión" | `toast.info("Función de cierre de sesión simulada")` — **el logout real ya existe** en el dropdown del header | Conectar al `logout()` de `lib/auth/auth-context.tsx` (una línea) o eliminar el botón duplicado | inmediato |

## 🟡 Placeholder — "próximamente"

| # | Feature | Ubicación | Qué falta | Fase |
| --- | --- | --- | --- | --- |
| 1 | Login email/password | `app/dashboard/(auth)/login/page.tsx` → `handleSubmit()` | Provider Credentials en NextAuth validando contra `User.passwordHash` (scrypt, ya seedeado por `setup-dev.ts`) + flujo `mustChangePassword` | v0.2.0 |
| 2 | Login con Google | `login/page.tsx` → botón Google | Configurar provider Google en `auth.ts` + credenciales en Google Cloud Console | v0.5.0 |
| 3 | ¿Olvidaste tu contraseña? | `login/page.tsx` | Flujo de reset: token por email (SMTP ya configurado), ruta `/reset-password` | v0.5.0 |
| 4 | Renovar quote vencida | `app/dashboard/(dashboard)/page.tsx` → ActionButton "Renovar" | Server action: extender `validUntil`, status → `active` | v0.2.0 |
| 5 | Duplicar quote | `page.tsx` → ActionButton "Duplicar" | Server action: clonar quote con slug nuevo, status `draft` | v0.2.0 |
| 6 | Importar equipo | `settings/page.tsx` → `TeamSection` | Import CSV de usuarios | v0.5.0 |
| 7 | Exportar equipo | `settings/page.tsx` → `TeamSection` | Export CSV con roles/estado | v0.5.0 |
| 8 | Acciones por miembro (menú "...") | `settings/page.tsx` → `TeamSection`, tabla | Server actions: cambiar rol, remover miembro, reenviar invitación | v0.5.0 |
| 9 | Cambiar contraseña | `settings/page.tsx` → `SecuritySection` | Form + server action contra `User.passwordHash`; prerequisito de #1 | v0.2.0 |
| 10 | Eliminar cuenta | `settings/page.tsx` → `SecuritySection` | Delete de `User` con confirmación + decidir destino de sus quotes | v0.5.0 |
| 11 | Eliminar organización | `settings/page.tsx` → `SecuritySection` (solo Owner) | Requiere modelo `Organization` primero | v0.5.0+ |

## 🟢 Deuda interna

| # | Item | Ubicación | Problema | Fase |
| --- | --- | --- | --- | --- |
| 1 | `updateUser()` no-op | `lib/auth/auth-context.tsx` | Función vacía con comentario "deferred to v0.5.0". Bloquea 🔴 #2 | v0.2.0 |
| 2 | `ZIVELO_ORG` hardcodeado | `lib/auth/auth-context.tsx` | Nombre, slug, color (`#cc0000`) y logo de la organización son constantes — no hay modelo `Organization` en DB. Todo lo que muestra `user.organization.*` viene de aquí | v0.5.0 |
| 3 | Branding desconectado | settings ↔ quotes públicas | El branding por-quote (campo `branding` JSON en `Quote`) no lee defaults de settings porque settings no persiste (🔴 #1) | v0.2.0 |
| 4 | Forzar cambio de contraseña | modelo `User.mustChangePassword` | El campo existe en DB pero nada lo lee; planificado en roadmap v0.1.0 | v0.2.0 |

---

## Análisis UI/UX

Hallazgos de la revisión, en orden de impacto:

1. **Logout duplicado y fake.** Settings > Cuenta tiene un botón "Cerrar sesión" que muestra un toast simulado, mientras el logout real está escondido en el dropdown del avatar (header). Acción: conectar el botón de Cuenta al `logout()` real, y considerar agregar logout visible al pie del sidebar (ver [`navbar-redesign.md`](./navbar-redesign.md)).

2. **Botones fake indistinguibles de los reales.** Los placeholders ("Importar", "Renovar", Google, etc.) tienen el mismo estilo que los botones funcionales. El usuario solo descubre que no funcionan al hacer clic. Acción: o se ocultan hasta implementarse, o se les da estilo `disabled` con tooltip "próximamente".

3. **Navegación inconsistente.** El sidebar desaparece en `/dashboard/settings`, `/dashboard/quotes/new` y `/dashboard/quotes/[slug]/edit` (lógica `showNav` en `app/dashboard/(dashboard)/layout.tsx`). El usuario pierde el contexto de dónde está y cómo volver. Acción: sidebar persistente — ver [`navbar-redesign.md`](./navbar-redesign.md).

4. **Settings no es enlazable.** Las 6 secciones navegan por estado interno (props/callbacks en `SettingsNav`), no por URL. No se puede compartir/bookmarkear "Settings > Marca" ni llegar con el botón atrás del navegador. Acción: migrar a query param `?section=` (parte del rediseño de navbar).

5. **Guardados sin feedback honesto.** Los `handleSave` fake (🔴 #1–3) muestran toast de éxito instantáneo. Cuando se implementen de verdad, deben mostrar loading state y manejar error — patrón ya existente en `quote-create-form.tsx` (`submitting` + toast de error).

## Orden de implementación sugerido

1. **Inmediato (fix de una línea):** conectar logout de Cuenta al real (🔴 #5).
2. **v0.2.0 — persistencia de settings:** server actions para Cuenta/Marca/Acciones (🔴 #1–3, 🟢 #1, #3), login por contraseña + cambio forzado (🟡 #1, #9, 🟢 #4), renovar/duplicar quotes (🟡 #4–5).
3. **v0.5.0 — organizaciones e invitaciones:** modelo `Organization` (🟢 #2), invitaciones reales (🔴 #4), gestión de miembros (🟡 #6–8), Google OAuth y password reset (🟡 #2–3), eliminación de cuenta/org (🟡 #10–11).
