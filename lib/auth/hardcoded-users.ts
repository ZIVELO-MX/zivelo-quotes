// HARDCODED: usuarios demo + organización
// TODO: Reemplazar con Supabase Auth + Prisma (Fase 1 del auth-plan)
export interface OrgData {
  name: string
  slug: string
  branding: {
    primaryColor: string
    logo: string
  }
}

export interface HardcodedUser {
  email: string
  username: string
  password: string
  name: string
  avatar: string
  role: "Owner" | "Manager" | "Editor" | "Viewer"
  organization: OrgData
}

export const HARDCODED_ORGANIZATION: OrgData = {
  name: "Zivelo Studio",
  slug: "zivelo",
  branding: {
    primaryColor: "#cc0000",
    logo: "/logos/zivelo-bars-dark-full.svg",
  },
}

export const HARDCODED_USERS: HardcodedUser[] = [
  {
    email: "tomas@zivelo.dev",
    username: "tomas",
    password: "demo1234",
    name: "Tomás Zivelo",
    avatar: "/logos/zivelo-bars-dark-full.svg",
    role: "Owner",
    organization: HARDCODED_ORGANIZATION,
  },
  {
    email: "manager@zivelo.dev",
    username: "manager",
    password: "demo1234",
    name: "María Manager",
    avatar: "",
    role: "Manager",
    organization: HARDCODED_ORGANIZATION,
  },
  {
    email: "editor@zivelo.dev",
    username: "editor",
    password: "demo1234",
    name: "Edmundo Editor",
    avatar: "",
    role: "Editor",
    organization: HARDCODED_ORGANIZATION,
  },
  {
    email: "viewer@zivelo.dev",
    username: "viewer",
    password: "demo1234",
    name: "Violeta Viewer",
    avatar: "",
    role: "Viewer",
    organization: HARDCODED_ORGANIZATION,
  },
]
