/*
  Warnings:

  - You are about to drop the column `template` on the `Portfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "template",
ADD COLUMN     "metadata" JSONB;
