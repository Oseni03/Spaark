/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_subscriptionId_fkey";

-- DropIndex
DROP INDEX "Organization_subscriptionId_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "subscriptionId";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "organizationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");

-- CreateIndex
CREATE INDEX "Subscription_organizationId_idx" ON "Subscription"("organizationId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
