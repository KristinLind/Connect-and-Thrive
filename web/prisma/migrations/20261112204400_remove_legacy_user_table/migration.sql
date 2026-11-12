-- Remove legacy foreign keys to the obsolete User table.
ALTER TABLE "RSVP"
DROP CONSTRAINT "RSVP_userId_fkey";

ALTER TABLE "Favorite"
DROP CONSTRAINT "Favorite_userId_fkey";

-- Remove the obsolete password-based User table.
DROP TABLE "User";
