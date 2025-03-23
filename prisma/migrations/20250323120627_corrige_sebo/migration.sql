/*
  Warnings:

  - You are about to drop the column `horarioFim` on the `Sebo` table. All the data in the column will be lost.
  - You are about to drop the column `horarioInicio` on the `Sebo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sebo" DROP COLUMN "horarioFim",
DROP COLUMN "horarioInicio",
ADD COLUMN     "horarioFuncionamento" TEXT;
