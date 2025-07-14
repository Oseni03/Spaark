/*
  Warnings:

  - You are about to drop the column `codeId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `subscribed` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Basics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Certification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Code` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Education` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeatureRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeatureRequestComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeatureVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hackathon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Newsletter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Portfolio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Social` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BlogToTag` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `updatedAt` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Basics" DROP CONSTRAINT "Basics_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Code" DROP CONSTRAINT "Code_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_blogId_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureRequest" DROP CONSTRAINT "FeatureRequest_authorId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureRequestComment" DROP CONSTRAINT "FeatureRequestComment_featureRequestId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureRequestComment" DROP CONSTRAINT "FeatureRequestComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureVote" DROP CONSTRAINT "FeatureVote_featureRequestId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureVote" DROP CONSTRAINT "FeatureVote_userId_fkey";

-- DropForeignKey
ALTER TABLE "Hackathon" DROP CONSTRAINT "Hackathon_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_hackathonId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BlogToTag" DROP CONSTRAINT "_BlogToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogToTag" DROP CONSTRAINT "_BlogToTag_B_fkey";

-- DropIndex
DROP INDEX "user_codeId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "codeId",
DROP COLUMN "subscribed",
DROP COLUMN "userType",
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- DropTable
DROP TABLE "Basics";

-- DropTable
DROP TABLE "Blog";

-- DropTable
DROP TABLE "Certification";

-- DropTable
DROP TABLE "Code";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "Education";

-- DropTable
DROP TABLE "Experience";

-- DropTable
DROP TABLE "FeatureRequest";

-- DropTable
DROP TABLE "FeatureRequestComment";

-- DropTable
DROP TABLE "FeatureVote";

-- DropTable
DROP TABLE "Hackathon";

-- DropTable
DROP TABLE "Link";

-- DropTable
DROP TABLE "Newsletter";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "OrganizationMember";

-- DropTable
DROP TABLE "Portfolio";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "Skill";

-- DropTable
DROP TABLE "Social";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "_BlogToTag";

-- DropEnum
DROP TYPE "Permission";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "UserType";
