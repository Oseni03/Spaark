/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_portfolioId_fkey";

-- AlterTable
ALTER TABLE "Basics" ADD COLUMN     "years" INTEGER;

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "technologies" TEXT[];

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "level" TEXT;

-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "Social" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "network" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Social_portfolioId_idx" ON "Social"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "Social_portfolioId_network_key" ON "Social"("portfolioId", "network");

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
