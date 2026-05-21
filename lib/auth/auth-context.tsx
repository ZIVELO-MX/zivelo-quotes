"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { HARDCODED_USERS, type OrgData } from "./hardcoded-users"

export interface User {
  email: string
  username: string
  name: string
  avatar: string
  role: string
  organization: OrgData
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (identifier: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  updateUser: (data: Partial<Pick<User, "name" | "avatar">>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = "zivelo-auth-user"

// HARDCODED: autenticación con datos fijos
// TODO: Reemplazar con sesión real de Supabase Auth
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((identifier: string, password: string) => {
    const found = HARDCODED_USERS.find(
      (u) =>
        (u.email === identifier || u.username === identifier) &&
        u.password === password
    )
    if (!found) {
      return { success: false, error: "Credenciales inválidas" }
    }
    const { password: _, ...userData } = found
    setUser(userData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const updateUser = useCallback(
    (data: Partial<Pick<User, "name" | "avatar">>) => {
      setUser((prev) => {
        if (!prev) return null
        const updated = { ...prev, ...data }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    },
    [],
  )

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
