"use server"

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
