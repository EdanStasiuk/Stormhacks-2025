/*
  Warnings:

  - You are about to drop the column `analysis` on the `Portfolio` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[candidateId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candidateId` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "analysis",
ADD COLUMN     "analysisData" JSONB,
ADD COLUMN     "analyzedAt" TIMESTAMP(3),
ADD COLUMN     "candidateId" TEXT NOT NULL,
ADD COLUMN     "concerns" TEXT[],
ADD COLUMN     "overallScore" DOUBLE PRECISION,
ADD COLUMN     "recommendation" TEXT,
ADD COLUMN     "resumeAlignment" DOUBLE PRECISION,
ADD COLUMN     "standoutQualities" TEXT[],
ADD COLUMN     "strengths" TEXT[],
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "technicalLevel" TEXT,
ADD COLUMN     "weaknesses" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_candidateId_key" ON "Portfolio"("candidateId");
