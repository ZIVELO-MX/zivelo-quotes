# Footer

Este documento describe el footer principal del proyecto, definido en `components/layout/footer.tsx`, y sirve como referencia para implementarlo en otros proyectos.

## Ubicación

El footer principal se usa en la landing page desde `app/page.tsx`.

Existe también un `MinimalFooter` para vistas internas o páginas con menor carga visual, pero este documento se enfoca en el footer completo con secciones de Product, Company y Contact.

## Stack técnico

- Framework: Next.js (App Router)
- Lenguaje: TypeScript
- Estilos: Tailwind CSS v4 con CSS custom properties
- Fuente: Inter (variable) cargada desde Google Fonts mediante `next/font/google`
- Iconos: `lucide-react`
- Internacionalización: contexto `useTranslate` con claves en `lib/i18n/locales/{en,es}.ts`

## Configuración de fuente

La fuente se define en `app/layout.tsx`:

```tsx
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})
```

Y se mapea en `globals.css` mediante el bloque `@theme inline`:

```css
@theme inline {
  --font-sans: var(--font-inter), 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-inter), 'Inter', ui-sans-serif, sans-serif;
}
```

Todas las tipografías del footer usan `font-sans` (Inter) por herencia del body.

## Estructura general

El footer es un componente cliente de React/Next.js (`"use client"`). Usa:

- `next/image` para mostrar el logo.
- Iconos de `lucide-react` (`Linkedin`, `Twitter`, `Instagram`) para redes sociales.
- `LanguageSelector` para cambiar idioma.
- `useTranslate` para textos internacionalizados.

La composición visual se divide en una grilla responsive con Tailwind:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-16">
```

- **Mobile:** una sola columna (`grid-cols-1`).
- **Tablet (sm):** dos columnas (`sm:grid-cols-2`).
- **Desktop (lg):** cinco columnas (`lg:grid-cols-5`).

La primera zona ocupa dos columnas en desktop (`lg:col-span-2`) y contiene la identidad del proyecto. Las otras tres columnas corresponden a Product, Company y Contact.

Se usa `gap-16` para separar columnas generosamente, lo que evita que el footer se vea apretado en desktop.

## Identidad del proyecto

La zona principal del footer incluye:

- Logo del proyecto (apunta a `#hero` mediante un `<a>` tag).
- Frase descriptiva del producto (`t("footer.tagline")`).
- Texto de autoría y mantenimiento (`t("footer.built-by")`).
- Links sociales a LinkedIn, X e Instagram.
- Selector de idioma (`LanguageSelector`).

### Logo

```tsx
<a href="#hero" aria-label="Zivelo home">
  <Image
    src="/logos/zivelo-bars-dark-full.svg"
    alt="Zivelo"
    width={120}
    height={28}
    style={{ height: "28px", width: "auto" }}
  />
</a>
```

Usa `next/image` con dimensiones fijas de width/height pero `style={{ height: "28px", width: "auto" }}` para mantener la proporción del SVG.

### Redes sociales

```tsx
const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/company/zivelo", icon: Linkedin },
  { label: "X", href: "https://x.com/zivelo", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com/zivelo", icon: Instagram },
]
```

Se renderizan con `Icon size={20} strokeWidth={1.5}` y en hover cambian a `color-accent`.

## Product

La sección Product agrupa accesos a las secciones clave del proyecto, como la landing principal, vista pública de una cotización de ejemplo, y el dashboard interno. En este proyecto los links son:

- Demo: `/q/demo` — ejemplo funcional de una cotización pública.
- Features: `#features` — sección de capacidades en la landing.
- Dashboard: `/dashboard` — panel operativo interno.

## Company

La sección Company enlaza al sitio corporativo de Zivelo:

- About: `https://www.zivelo.dev/#about`.
- Projects: `https://www.zivelo.dev/#projects`.
- Services: `https://www.zivelo.dev/#services`.

## Contact

- Email: `contacto@zivelo.dev`.
- Teléfono: `+52 1 392 110 7274` (con emoji de bandera mexicana como indicador visual).
- Link externo a `https://zivelo.dev` con estilo `font-medium` y hover hacia accent.

## Sistema de diseño y CSS tokens

El footer se apoya en los tokens globales definidos en `app/globals.css`, organizados en dos niveles:

### 1. Variables CSS (en `:root`)

```css
:root {
  --background: #ffffff;
  --background-secondary: #f7f7f5;
  --background-tertiary: #efefed;
  --foreground: #191919;
  --foreground-muted: #6b6b6b;
  --foreground-dim: #a0a0a0;
  --accent: #cc0000;
  --accent-hover: #aa0000;
  --accent-subtle: #fff0f0;
  --border: #e9e9e7;
  --border-strong: #d3d3cf;
}
```

### 2. Mapeo a Tailwind (en `@theme inline`)

```css
@theme inline {
  --color-background: var(--background);
  --color-background-secondary: var(--background-secondary);
  --color-foreground: var(--foreground);
  --color-foreground-muted: var(--foreground-muted);
  --color-foreground-dim: var(--foreground-dim);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --font-sans: var(--font-inter), 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

Esto permite usar clases como `bg-background`, `text-foreground-muted`, `border-border`, `text-accent`, etc.

**Nota:** El footer actual usa colores fijos en hex en lugar de las variables CSS (por ejemplo `bg-[#f5f5f5]` en lugar de `bg-background-secondary`, `text-[#5a5a5a]` en lugar de `text-foreground-muted`). Esto es una decisión explícita para mantener el footer visualmente independiente del theme del dashboard, pero en una implementación limpia deberían usarse las variables CSS.

## Estilo visual

### Light mode (activo actualmente)

| Elemento | Clase / Valor | Token CSS equivalente |
|---|---|---|
| Fondo del footer | `bg-[#f5f5f5]` | `--background-secondary: #f7f7f5` (cercano) |
| Borde superior | `border-t` con `rgba(0,0,0,0.1)` | `--border: #e9e9e7` |
| Títulos de sección | `text-[#1d1d1b]` + `text-xs font-semibold uppercase tracking-widest` | `--foreground: #191919` |
| Links de navegación | `text-[#5a5a5a] hover:text-[#1d1d1b]` | `--foreground-muted: #6b6b6b` → `--foreground: #191919` |
| Links sociales | `text-[#5a5a5a] hover:text-accent` | `--foreground-muted` → `--accent` |
| Texto tagline | `text-[#5a5a5a]` | `--foreground-muted: #6b6b6b` |
| Texto built-by | `text-[#8a8a8a]` | `--foreground-dim: #a0a0a0` |
| Copyright | `text-[#8a8a8a]` | `--foreground-dim: #a0a0a0` |
| Separador copyright | `rgba(0,0,0,0.1)` | `--border: #e9e9e7` |
| Link "Explore" | `text-[#1d1d1b] hover:text-accent` | `--foreground` → `--accent` |

### Dark mode (no activo actualmente, documentado para referencia)

El proyecto está forzado a light mode (`forcedTheme="light"` en `ThemeProvider`), pero si se activara dark mode, los valores cambiarían a:

| Elemento | Valor |
|---|---|
| Fondo del footer | `--background-secondary: #110000` |
| Borde superior | `rgba(255,255,255,0.07)` |
| Títulos de sección | `--foreground: #f5f0f0` |
| Links de navegación | `--foreground-muted: #9a8585` hover `--foreground: #f5f0f0` |
| Links sociales | `--foreground-muted: #9a8585` hover `--accent: #CC0000` |
| Texto tagline | `--foreground-muted: #9a8585` |
| Texto built-by / copyright | `--foreground-dim: #5a4040` |
| Logo | `zivelo-bars-light-full.svg` (blanco sobre fondo oscuro) |

En dark mode el contraste principal depende de la relación entre `#110000` y `#f5f0f0`. Los textos secundarios usan `#9a8585` para mantener jerarquía sin competir con los títulos, y los elementos de menor prioridad usan `#5a4040`. Los hover de navegación y sociales se distinguen: navegación hacia foreground, sociales hacia accent.

## Secciones del footer en detalle

### Títulos de sección

Cada sección (Product, Company, Contact) tiene un título con el mismo patrón:

```tsx
<p className="text-xs font-semibold uppercase tracking-widest mb-1 text-[#1d1d1b]" style={{ letterSpacing: "0.1em" }}>
  {t("footer.section.product")}
</p>
```

- `text-xs`: tamaño pequeño.
- `font-semibold`: peso seminegrita.
- `uppercase`: mayúsculas.
- `tracking-widest`: espaciado entre letras amplio.
- `letterSpacing: "0.1em"`: refuerzo del tracking (redundante con `tracking-widest`, pero mantenido por consistencia).

### Links de navegación

```tsx
<a className="text-sm text-[#5a5a5a] hover:text-[#1d1d1b] transition-colors duration-200">
  {link.label}
</a>
```

- `text-sm`: tamaño estándar para links.
- `text-[#5a5a5a]`: color gris medio en reposo.
- `hover:text-[#1d1d1b]`: oscurece al hover.
- `transition-colors duration-200`: animación suave de color.

### Links sociales

```tsx
<a className="text-[#5a5a5a] hover:text-accent transition-colors duration-200">
  <Icon size={20} strokeWidth={1.5} />
</a>
```

- `hover:text-accent`: cambia al rojo de marca en hover.
- `size={20} strokeWidth={1.5}`: iconos medianos con trazo fino.

### Link destacado (Explore)

```tsx
<a className="text-sm font-medium text-[#1d1d1b] hover:text-accent transition-colors duration-200 mt-2">
  {t("footer.contact.explore")}
</a>
```

- `font-medium`: peso mayor para destacar.
- `text-[#1d1d1b]`: color oscuro en reposo.
- `hover:text-accent`: cambia a rojo en hover.

### Teléfono con bandera

```tsx
<a className="text-sm text-[#5a5a5a] hover:text-[#1d1d1b] transition-colors duration-200 flex items-center gap-1.5">
  <span aria-label="Mexico flag" role="img">🇲🇽</span>
  +52 1 392 110 7274
</a>
```

Usa `flex items-center gap-1.5` para alinear el emoji de la bandera con el número.

## Copyright

```tsx
<div className="mt-20 pt-12 text-center" style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
  <p className="text-sm text-[#8a8a8a]">
    {t("footer.copyright", { year })}
  </p>
</div>
```

- Separado del contenido principal con `mt-20 pt-12`.
- Separador visual con `borderTop`.
- El año se calcula con `new Date().getFullYear()`.
- Texto con la llave de traducción `footer.copyright` que recibe `{ year }` como parámetro.

## Layout completo del contenedor

```tsx
<footer className="border-t px-5 py-16 bg-[#f5f5f5]" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
  <div className="max-w-7xl mx-auto">
    {/* grid de 5 columnas */}
    {/* separador + copyright */}
  </div>
</footer>
```

- `py-16`: padding vertical generoso (64px).
- `px-5`: padding horizontal (20px).
- `max-w-7xl mx-auto`: ancho máximo de 1280px centrado.
- `border-t`: línea superior delgada.
- `borderColor: rgba(0,0,0,0.1)`: color sutil para el borde.

## Resumen para implementar en otro proyecto

Para replicar este footer necesitas:

1. **Tailwind CSS v4** con `@theme inline` block que mapee las variables CSS a colores de Tailwind.
2. **Fuente Inter** cargada desde `next/font/google` y mapeada a `--font-sans`.
3. **Las variables CSS** en `:root` para los colores base (background, foreground, accent, border, etc.).
4. **Los componentes:** `LanguageSelector` (o eliminarlo si no aplica), `useTranslate` (o reemplazar textos fijos).
5. **Iconos:** `lucide-react` para las redes sociales.
6. **Estructura de grilla:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5` con `lg:col-span-2` para la identidad.
7. **Los mismos valores de color** o mapearlos a tus tokens de diseño.

Si tu proyecto usa las variables CSS de Tailwind (`bg-background-secondary`, `text-foreground-muted`, etc.), puedes reemplazar los colores fijos del footer por las clases equivalentes para mantener consistencia con el theme.
