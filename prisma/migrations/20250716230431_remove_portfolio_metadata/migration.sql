/*
  Warnings:

  - You are about to drop the column `metadata` on the `Portfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "metadata",
ADD COLUMN     "template" TEXT NOT NULL DEFAULT 'default';
