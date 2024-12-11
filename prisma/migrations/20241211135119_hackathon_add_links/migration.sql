-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "hackathonId" TEXT;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
