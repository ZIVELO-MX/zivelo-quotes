import { vi } from "vitest"

// Test stub for @/auth — returns an authenticated session by default.
// Tests that need an unauthenticated session can override with vi.mocked(auth).mockResolvedValueOnce(null).
export const auth = vi.fn().mockResolvedValue({
  user: { email: "test@zivelo.dev", name: "Test User" },
})

export const handlers = {}
export const signIn = vi.fn()
export const signOut = vi.fn()
