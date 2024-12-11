/*
  Warnings:

  - You are about to drop the column `logoURL` on the `Experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "logoURL",
ADD COLUMN     "picture" TEXT;
