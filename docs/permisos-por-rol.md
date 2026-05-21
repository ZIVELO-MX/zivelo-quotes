# Permisos por rol

## Roles

| Rol | Descripción |
| --- | --- |
| **Owner** | Dueño del espacio de trabajo. Acceso completo a todo. |
| **Manager** | Administrador. Acceso completo excepto eliminar la organización. |
| **Editor** | Puede crear y editar cotizaciones. Sin acceso a equipo. |
| **Viewer** | Solo lectura. No crea cotizaciones ni accede a configuración sensible. |

## Matriz de permisos

| Recurso | Owner | Manager | Editor | Viewer |
|---|---|---|---|---|
| **Dashboard — Resumen** | ✅ | ✅ | ✅ | ✅ |
| **Dashboard — botón "Nueva cotización"** | ✅ | ✅ | ✅ | ❌ |
| **/dashboard/quotes — tabla** | ✅ | ✅ | ✅ | ✅ |
| **/dashboard/quotes — botón "Nueva cotización"** | ✅ | ✅ | ✅ | ❌ |
| **/dashboard/quotes/new** | ✅ | ✅ | ✅ | 🚫 403 |
| **/dashboard/settings** | ✅ | ✅ | ✅ | ✅ |
| **Settings — Información general** | ✅ | ✅ | ✅ | ✅ |
| **Settings — Marca** | ✅ | ✅ | ✅ | ✅ |
| **Settings — Equipo** | ✅ | ✅ | ❌ | ❌ |
| **Settings — Acciones de cotización** | ✅ | ✅ | ✅ | ❌ |
| **Settings — Cuenta** | ✅ | ✅ | ✅ | ✅ |
| **Settings — Seguridad** | ✅ | ✅ | ✅ | ✅ |

## Protección por URL

Todas las protecciones son del lado del cliente (client-side). No hay Server Action ni middleware que valide el rol en el servidor.

### `/dashboard/quotes/new`
- Si `user.role === "Viewer"`, redirige a `/forbidden` mediante `useEffect` + `router.replace`.

### `/dashboard/settings?section=team`
- La sección **Equipo** solo se renderiza si `user.role === "Owner" || user.role === "Manager"`.
- Si un Editor o Viewer accede directamente a `?section=team`, el contenido queda vacío (no se renderiza nada en el área de contenido).
- El sidebar de settings también oculta la entrada "Equipo" para roles sin permiso.
- **No hay redirección ni mensaje de error** — el usuario ve un área de contenido en blanco.

### `/dashboard/settings?section=quote-actions`
- La sección **Acciones de cotización** solo se renderiza si `user.role !== "Viewer"`.
- El sidebar oculta la entrada para Viewer.
- Si un Viewer accede directamente, misma situación: contenido vacío.

## Comportamiento ante manipulación de URL

Si un usuario modifica manualmente la URL para acceder a una sección restringida:

| Escenario | Comportamiento actual |
|---|---|
| Viewer → `/dashboard/quotes/new` | Redirige a `/forbidden` |
| Editor → `/dashboard/settings?section=team` | Contenido vacío (sin error) |
| Viewer → `/dashboard/settings?section=team` | Contenido vacío (sin error) |
| Viewer → `/dashboard/settings?section=quote-actions` | Contenido vacío (sin error) |

### Mejora futura recomendada

Agregar un mensaje de error o redirección suave cuando se accede a una sección sin permisos, en lugar de mostrar contenido vacío. Ejemplo:

```tsx
{activeSection === "team" && !canSeeTeam ? (
  <p className="text-sm text-gray-500">No tienes permiso para ver esta sección.</p>
) : (
  <TeamSection />
)}
```
