/*
  Warnings:

  - You are about to drop the column `url` on the `Basics` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Social` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Basics" DROP COLUMN "url";

-- AlterTable
ALTER TABLE "Hackathon" ADD COLUMN     "technologies" TEXT[];

-- AlterTable
ALTER TABLE "Social" DROP COLUMN "url";
