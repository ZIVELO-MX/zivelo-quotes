import nextConfig from "eslint-config-next/core-web-vitals"

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    // Pre-existing violations — to be fixed in follow-up PRs
    ignores: [
      "app/dashboard/(dashboard)/quotes/*/edit/page.tsx",
      "app/dashboard/(dashboard)/settings/page.tsx",
      "app/forbidden/page.tsx",
      "app/not-found.tsx",
      "components/ui/carousel.tsx",
      "components/ui/sidebar.tsx",
      "components/ui/use-mobile.tsx",
      "hooks/use-mobile.ts",
      "lib/auth/auth-context.tsx",
      "lib/i18n/language-context.tsx",
    ],
  },
  ...nextConfig,
]

export default config
