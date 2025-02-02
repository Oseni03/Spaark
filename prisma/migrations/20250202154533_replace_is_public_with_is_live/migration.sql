/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Portfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "isPublic",
ADD COLUMN     "isLive" BOOLEAN NOT NULL DEFAULT false;
