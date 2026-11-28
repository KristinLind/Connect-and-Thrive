CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "meetingSchedule" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GroupMembership" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMembership_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Group_name_idx" ON "Group"("name");

CREATE UNIQUE INDEX "GroupMembership_groupId_authUserId_key"
    ON "GroupMembership"("groupId", "authUserId");

CREATE INDEX "GroupMembership_authUserId_joinedAt_idx"
    ON "GroupMembership"("authUserId", "joinedAt");

ALTER TABLE "GroupMembership"
    ADD CONSTRAINT "GroupMembership_groupId_fkey"
    FOREIGN KEY ("groupId") REFERENCES "Group"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GroupMembership"
    ADD CONSTRAINT "GroupMembership_authUserId_fkey"
    FOREIGN KEY ("authUserId") REFERENCES "UserAccess"("authUserId")
    ON DELETE CASCADE ON UPDATE CASCADE;
