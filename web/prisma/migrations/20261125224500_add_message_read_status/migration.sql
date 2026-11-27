-- Add read tracking to private connection messages
ALTER TABLE "ConnectionMessage"
ADD COLUMN "readAt" TIMESTAMP(3);
