/*
  Warnings:

  - You are about to drop the column `keywords` on the `Skill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "keywords",
ADD COLUMN     "description" TEXT;
