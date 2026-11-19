-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'APPROVED', 'BLOCKED');

-- CreateTable
CREATE TABLE "UserAccess" (
    "authUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'PENDING',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccess_pkey" PRIMARY KEY ("authUserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccess_email_key" ON "UserAccess"("email");

-- CreateIndex
CREATE INDEX "UserAccess_status_createdAt_idx" ON "UserAccess"("status", "createdAt");

