/*
  Warnings:

  - You are about to drop the `perfis` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('SEBO', 'USUARIO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'EXCLUIDO');

-- DropTable
DROP TABLE "perfis";

-- CreateTable
CREATE TABLE "Conta" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "papel" "Papel" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sebo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpfCnpj" VARCHAR(16) NOT NULL,
    "concordaVender" BOOLEAN NOT NULL,
    "telefone" CHAR(11),
    "biografia" TEXT,
    "estanteVirtual" TEXT,
    "instagram" TEXT,
    "curadores" TEXT,
    "historia" TEXT,
    "fotoPerfil" TEXT,
    "contaId" INTEGER NOT NULL,

    CONSTRAINT "Sebo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnderecoSebo" (
    "id" SERIAL NOT NULL,
    "cep" CHAR(8) NOT NULL,
    "estado" CHAR(2) NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "isPublic" BOOLEAN NOT NULL,
    "seboId" INTEGER NOT NULL,

    CONSTRAINT "EnderecoSebo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoSebo" (
    "url" TEXT NOT NULL,
    "seboId" INTEGER NOT NULL,

    CONSTRAINT "FotoSebo_pkey" PRIMARY KEY ("seboId","url")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" VARCHAR(16) NOT NULL,
    "telefone" CHAR(11) NOT NULL,
    "biografia" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "skoob" TEXT,
    "goodreads" TEXT,
    "fotoPerfil" TEXT,
    "contaId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conta_email_key" ON "Conta"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sebo_contaId_key" ON "Sebo"("contaId");

-- CreateIndex
CREATE UNIQUE INDEX "EnderecoSebo_seboId_key" ON "EnderecoSebo"("seboId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_contaId_key" ON "Usuario"("contaId");

-- AddForeignKey
ALTER TABLE "Sebo" ADD CONSTRAINT "Sebo_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnderecoSebo" ADD CONSTRAINT "EnderecoSebo_seboId_fkey" FOREIGN KEY ("seboId") REFERENCES "Sebo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSebo" ADD CONSTRAINT "FotoSebo_seboId_fkey" FOREIGN KEY ("seboId") REFERENCES "Sebo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
