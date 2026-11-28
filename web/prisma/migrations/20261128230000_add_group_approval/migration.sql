
BEGIN;

-- Create group approval status enum
CREATE TYPE "GroupStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

-- Add approval status and optional creator ownership
-- Existing groups will remain approved
ALTER TABLE "Group"
ADD COLUMN "status" "GroupStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN "createdById" TEXT;

-- Future group submissions will default to pending
ALTER TABLE "Group"
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- Create indexes for approval and ownership queries
CREATE INDEX "Group_status_createdAt_idx"
ON "Group"("status", "createdAt");

CREATE INDEX "Group_createdById_idx"
ON "Group"("createdById");

-- Link group creators to their existing member accounts
ALTER TABLE "Group"
ADD CONSTRAINT "Group_createdById_fkey"
FOREIGN KEY ("createdById")
REFERENCES "UserAccess"("authUserId")
ON DELETE SET NULL
ON UPDATE CASCADE;

COMMIT;
