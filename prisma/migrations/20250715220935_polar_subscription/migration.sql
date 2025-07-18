/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `customizable` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `priceId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `trial` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkoutId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentPeriodEnd` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentPeriodStart` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recurringInterval` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropIndex
DROP INDEX "Portfolio_organizationId_idx";

-- DropIndex
DROP INDEX "Subscription_organizationId_idx";

-- DropIndex
DROP INDEX "Subscription_organizationId_key";

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "customizable",
DROP COLUMN "endDate",
DROP COLUMN "frequency",
DROP COLUMN "organizationId",
DROP COLUMN "priceId",
DROP COLUMN "startDate",
DROP COLUMN "trial",
DROP COLUMN "type",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "checkoutId" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "currentPeriodStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "customFieldData" JSONB,
ADD COLUMN     "customerCancellationComment" TEXT,
ADD COLUMN     "customerCancellationReason" TEXT,
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "discountId" TEXT,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "recurringInterval" TEXT NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "userType";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "OrganizationMember";

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "Permission";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "UserType";
