/*
  Warnings:

  - You are about to drop the column `projectId` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_projectId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "github",
DROP COLUMN "url",
ADD COLUMN     "source" TEXT,
ADD COLUMN     "website" TEXT;
