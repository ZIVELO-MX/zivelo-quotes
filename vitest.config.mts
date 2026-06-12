import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  resolve: {
    alias: [
      // Stub @/auth BEFORE the generic @ alias so it takes precedence
      {
        find: "@/auth",
        replacement: path.resolve(__dirname, "tests/__mocks__/auth.ts"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "."),
      },
    ],
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
})
