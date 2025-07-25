/*
  Warnings:

  - Made the column `userId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Subscription_userId_key";

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "userId" SET NOT NULL;
