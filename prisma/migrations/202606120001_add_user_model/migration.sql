CREATE TYPE "Role" AS ENUM ('Owner', 'Manager', 'Editor', 'Viewer');

CREATE TABLE "User" (
  "id"                 TEXT         NOT NULL,
  "email"              TEXT         NOT NULL,
  "name"               TEXT         NOT NULL,
  "role"               "Role"       NOT NULL DEFAULT 'Manager',
  "passwordHash"       TEXT,
  "mustChangePassword" BOOLEAN      NOT NULL DEFAULT true,
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
