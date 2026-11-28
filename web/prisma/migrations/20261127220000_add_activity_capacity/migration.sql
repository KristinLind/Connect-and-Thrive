-- Add optional maximum participant capacity to activities.
ALTER TABLE "Activity" ADD COLUMN "capacity" INTEGER;

-- Ensure specified capacity is between 1 and 500.
ALTER TABLE "Activity"
ADD CONSTRAINT "Activity_capacity_check"
CHECK ("capacity" IS NULL OR "capacity" BETWEEN 1 AND 500);
