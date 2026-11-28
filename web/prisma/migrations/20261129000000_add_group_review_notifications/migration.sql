BEGIN;

ALTER TABLE "Group"
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "reviewNotificationReadAt" TIMESTAMP(3);

CREATE INDEX "Group_createdById_reviewNotificationReadAt_idx"
ON "Group"("createdById", "reviewNotificationReadAt");

COMMIT;
