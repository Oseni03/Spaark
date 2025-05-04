/*
  Warnings:

  - You are about to drop the column `teamId` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_portfolioId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "teamId";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "Testimonial";
