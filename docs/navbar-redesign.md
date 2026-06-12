# Rediseño de Navbar: Sidebar Completo

Propuesta para reemplazar el sidebar izquierdo actual por uno completo y persistente, integrando el nav de configuración con grupos desplegables.

> Estado: **propuesta** — pendiente de implementación. Relacionado: [`estado-funcionalidades.md`](./estado-funcionalidades.md) (hallazgos UI/UX #3 y #4).

## Problemas del nav actual

| Problema | Detalle |
| --- | --- |
| Sidebar mínimo | Solo 3 items (`components/dashboard/dashboard-nav.tsx`): Resumen, Cotizaciones, Ajustes |
| Desaparece | Oculto en `/dashboard/settings`, `/dashboard/quotes/new` y `/dashboard/quotes/[slug]/edit` por la lógica `showNav` en `app/dashboard/(dashboard)/layout.tsx` — el usuario pierde contexto |
| Doble nav | Settings tiene su propio sidebar (`components/settings/settings-nav.tsx`) con 6 secciones que no se integra con el principal |
| Settings sin URL | Las secciones de settings navegan por estado interno (props `activeSection`/`onSelect`), no se pueden enlazar ni usar el botón atrás |
| Logout escondido | Solo accesible desde el dropdown del avatar en el header |

## Propuesta

### Estructura

```
┌────────────────────────┬──────────────────────────────────┐
│  [logo Zivelo]         │  Header (sticky)        [avatar] │
├────────────────────────┼──────────────────────────────────┤
│                        │                                  │
│  ▦ Resumen             │                                  │
│                        │                                  │
│  ▸ Cotizaciones      ▾ │         {contenido}              │
│      Todas             │                                  │
│      Nueva cotización  │                                  │
│                        │                                  │
│  ▸ Configuración     ▾ │                                  │
│      Cuenta            │                                  │
│      Seguridad         │                                  │
│      General           │                                  │
│      Marca             │                                  │
│      Equipo            │                                  │
│      Acciones          │                                  │
│                        │                                  │
│  ──────────────────    │                                  │
│  (BR) Benjamin R.      │                                  │
│      benjamin@…        │                                  │
│  ⎋ Cerrar sesión       │                                  │
└────────────────────────┴──────────────────────────────────┘
```

### Reglas

1. **Persistente en todas las rutas** del dashboard — se elimina la lógica `showNav` del layout. En las páginas de formulario (new/edit) el sidebar permanece; el contenido ya tiene su propio "Volver".
2. **Grupos desplegables (collapsible):**
   - *Resumen* — link directo a `/dashboard`.
   - *Cotizaciones* — grupo desplegable: "Todas" (`/dashboard/quotes`) y "Nueva cotización" (`/dashboard/quotes/new`, oculta para Viewer).
   - *Configuración* — grupo desplegable con las 6 secciones actuales del settings-nav. Se reutiliza `getVisibleSections()` de `components/settings/settings-nav.tsx` para la visibilidad por rol (Viewer no ve Equipo/Marca/Acciones, etc.).
3. **Auto-expansión:** el grupo que contiene la ruta activa se abre automáticamente; el estado expandido/colapsado se conserva en el cliente (useState; opcional `localStorage`).
4. **Pie del sidebar:** avatar + nombre + email del usuario y botón **Cerrar sesión** conectado al `logout()` real de `lib/auth/auth-context.tsx`. Esto resuelve el hallazgo UI/UX #1 (logout escondido/duplicado).
5. **Mobile:** el Sheet hamburguesa existente (`components/dashboard/dashboard-header.tsx`) renderiza la misma estructura de grupos — un solo componente de contenido de nav compartido entre sidebar desktop y Sheet mobile.

### Navegación de settings por URL

Para que el sidebar pueda enlazar secciones directamente, settings debe leer la sección de la URL. Dos opciones:

| Opción | Cómo | Pros | Contras |
| --- | --- | --- | --- |
| **A. Query param** (recomendada) | `/dashboard/settings?section=brand`, leído con `useSearchParams` | Refactor mínimo: `settings/page.tsx` ya es un solo componente con switch de secciones; solo cambia la fuente del estado | URL menos "limpia" |
| B. Rutas anidadas | `/dashboard/settings/brand` con `app/dashboard/(dashboard)/settings/[section]/page.tsx` | URLs canónicas, code-splitting por sección | Requiere partir el archivo de ~1200 líneas en 6 páginas + layout compartido |

**Recomendación:** Opción A ahora (el sidebar enlaza `?section=`), y migrar a B cuando se parta `settings/page.tsx` (ya hay deuda por su tamaño).

### Archivos a tocar (cuando se implemente)

| Archivo | Cambio |
| --- | --- |
| `components/dashboard/dashboard-nav.tsx` | Reescribir: grupos desplegables + pie con usuario/logout. Extraer contenido a componente compartible con el Sheet |
| `app/dashboard/(dashboard)/layout.tsx` | Eliminar lógica `showNav`; sidebar siempre visible en desktop |
| `components/dashboard/dashboard-header.tsx` | El Sheet mobile usa el componente de nav compartido; evaluar si el dropdown del avatar se simplifica (logout ya está en sidebar) |
| `app/dashboard/(dashboard)/settings/page.tsx` | Leer sección activa de `useSearchParams`; `SettingsNav` desktop se elimina (lo absorbe el sidebar); el índice mobile de settings puede conservarse o absorberse en el Sheet |
| `components/settings/settings-nav.tsx` | `getVisibleSections()` se exporta/reutiliza; el resto se reduce o elimina |

### Fuera de alcance de esta propuesta

- Colapsar el sidebar a iconos (modo mini) — evaluar después.
- Breadcrumbs en el header.
- Búsqueda global / command palette.
