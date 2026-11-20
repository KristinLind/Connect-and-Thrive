-- CreateTable
CREATE TABLE "MemberProfile" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "location" TEXT,
    "occupation" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "storyTitle" TEXT,
    "story" TEXT,
    "storyType" TEXT,
    "shareProfile" BOOLEAN NOT NULL DEFAULT false,
    "shareStory" BOOLEAN NOT NULL DEFAULT false,
    "allowMessages" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberProfile_authUserId_key" ON "MemberProfile"("authUserId");

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "UserAccess"("authUserId") ON DELETE CASCADE ON UPDATE CASCADE;

