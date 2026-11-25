CREATE TYPE "StoryStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "StoryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Story" ADD CONSTRAINT "Story_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "UserAccess"("authUserId") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Story_status_createdAt_idx" ON "Story"("status", "createdAt");
CREATE INDEX "Story_authorId_createdAt_idx" ON "Story"("authorId", "createdAt");
