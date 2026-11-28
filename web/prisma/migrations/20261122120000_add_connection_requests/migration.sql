
-- Create the connection status enum.
CREATE TYPE "ConnectionStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'DECLINED',
    'BLOCKED'
);

-- Create the connection requests table.
CREATE TABLE "ConnectionRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- Prevent duplicate requests from the same sender to the same recipient.
CREATE UNIQUE INDEX "ConnectionRequest_senderId_recipientId_key"
ON "ConnectionRequest"("senderId", "recipientId");

-- Improve recipient connection request lookups.
CREATE INDEX "ConnectionRequest_recipientId_status_idx"
ON "ConnectionRequest"("recipientId", "status");

-- Link the sender to UserAccess.
ALTER TABLE "ConnectionRequest"
ADD CONSTRAINT "ConnectionRequest_senderId_fkey"
FOREIGN KEY ("senderId")
REFERENCES "UserAccess"("authUserId")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Link the recipient to UserAccess.
ALTER TABLE "ConnectionRequest"
ADD CONSTRAINT "ConnectionRequest_recipientId_fkey"
FOREIGN KEY ("recipientId")
REFERENCES "UserAccess"("authUserId")
ON DELETE CASCADE
ON UPDATE CASCADE;
