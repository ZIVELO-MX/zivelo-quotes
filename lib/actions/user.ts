"use server"

import { scryptSync, randomBytes } from "crypto"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export type UserSummary = {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export async function listUsers(): Promise<{ success: true; users: UserSummary[] } | { success: false; error: string }> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "No autorizado" }
  try {
    const rows = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    })
    return {
      success: true,
      users: rows.map((u) => ({ ...u, role: u.role as string, createdAt: u.createdAt.toISOString() })),
    }
  } catch {
    return { success: false, error: "Error al obtener usuarios" }
  }
}

export async function changePassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.email) return { success: false, error: "No autorizado" }

  if (newPassword.length < 8) {
    return { success: false, error: "La contraseña debe tener al menos 8 caracteres" }
  }

  try {
    const salt = randomBytes(16).toString("hex")
    const hash = scryptSync(newPassword, salt, 64).toString("hex")
    const passwordHash = `${salt}:${hash}`

    await prisma.user.update({
      where: { email: session.user.email },
      data: { passwordHash, mustChangePassword: false },
    })

    return { success: true }
  } catch {
    return { success: false, error: "Error al actualizar la contraseña" }
  }
}
