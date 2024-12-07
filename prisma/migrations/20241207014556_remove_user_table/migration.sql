/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Basics" DROP CONSTRAINT "Basics_userId_fkey";

-- DropTable
DROP TABLE "User";
