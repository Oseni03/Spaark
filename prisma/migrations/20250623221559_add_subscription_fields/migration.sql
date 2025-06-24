-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "blogEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "blogLimit" INTEGER,
ADD COLUMN     "customArticleLimit" INTEGER,
ADD COLUMN     "customPortfolioLimit" INTEGER,
ADD COLUMN     "customizable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trial" INTEGER;
