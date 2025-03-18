/*
  Warnings:

  - You are about to drop the column `papel` on the `Conta` table. All the data in the column will be lost.
  - The `status` column on the `Conta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isPublic` on the `EnderecoSebo` table. All the data in the column will be lost.
  - Added the required column `tipo` to the `Conta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ehPublico` to the `EnderecoSebo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoConta" AS ENUM ('SEBO', 'USUARIO');

-- CreateEnum
CREATE TYPE "StatusConta" AS ENUM ('ATIVA', 'EXCLUIDA');

-- AlterTable
ALTER TABLE "Conta" DROP COLUMN "papel",
ADD COLUMN     "tipo" "TipoConta" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusConta" NOT NULL DEFAULT 'ATIVA';

-- AlterTable
ALTER TABLE "EnderecoSebo" DROP COLUMN "isPublic",
ADD COLUMN     "ehPublico" BOOLEAN NOT NULL;

-- DropEnum
DROP TYPE "Papel";

-- DropEnum
DROP TYPE "Status";
