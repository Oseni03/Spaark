/*
  Warnings:

  - You are about to drop the column `icon` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[network]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Made the column `url` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "icon",
ALTER COLUMN "url" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_network_key" ON "Profile"("network");
