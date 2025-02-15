/*
  Warnings:

  - You are about to drop the column `portfolioLimit` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscriptionId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "subscriptionId" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "portfolioLimit" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "portfolioLimit";

-- CreateIndex
CREATE UNIQUE INDEX "Organization_subscriptionId_key" ON "Organization"("subscriptionId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
