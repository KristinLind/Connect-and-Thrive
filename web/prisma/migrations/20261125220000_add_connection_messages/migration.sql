
-- Create the table for private messages between connected members.
CREATE TABLE "ConnectionMessage" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectionMessage_pkey" PRIMARY KEY ("id")
);

-- Speed up loading messages in chronological order.
CREATE INDEX "ConnectionMessage_connectionId_createdAt_idx"
ON "ConnectionMessage"("connectionId", "createdAt");

-- Associate messages with their connection.
ALTER TABLE "ConnectionMessage"
ADD CONSTRAINT "ConnectionMessage_connectionId_fkey"
FOREIGN KEY ("connectionId")
REFERENCES "ConnectionRequest"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
