/*
  Warnings:

  - You are about to alter the column `cpf` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(16)` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE "Sebo" ADD COLUMN     "amazon" TEXT,
ADD COLUMN     "enjoei" TEXT,
ADD COLUMN     "mercadoLivre" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(11);
