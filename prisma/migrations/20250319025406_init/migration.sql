-- CreateEnum
CREATE TYPE "TipoConta" AS ENUM ('SEBO', 'USUARIO');

-- CreateEnum
CREATE TYPE "StatusConta" AS ENUM ('ATIVA', 'EXCLUIDA');

-- CreateEnum
CREATE TYPE "StatusProduto" AS ENUM ('ATIVO', 'EXCLUIDO');

-- CreateEnum
CREATE TYPE "CategoriaProduto" AS ENUM ('LIVRO', 'DISCO', 'CD', 'DVD', 'REVISTA', 'GIBI');

-- CreateEnum
CREATE TYPE "EstadoConservacaoProduto" AS ENUM ('NOVO', 'EXECELENTE', 'BOM', 'ACEITAVEL', 'RUIM');

-- CreateTable
CREATE TABLE "Conta" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "TipoConta" NOT NULL,
    "status" "StatusConta" NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),

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
    "mercadoLivre" TEXT,
    "enjoei" TEXT,
    "amazon" TEXT,
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
    "ehPublico" BOOLEAN NOT NULL,
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
    "cpf" CHAR(11) NOT NULL,
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

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "status" "StatusProduto" NOT NULL DEFAULT 'ATIVO',
    "categoria" "CategoriaProduto" NOT NULL,
    "qtdEstoque" INTEGER NOT NULL,
    "estadoConservacao" "EstadoConservacaoProduto" NOT NULL,
    "anoEdicao" INTEGER NOT NULL,
    "anoLancamento" INTEGER NOT NULL,
    "autores" TEXT,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "seboId" INTEGER NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoProduto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "FotoProduto_pkey" PRIMARY KEY ("id")
);

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

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_seboId_fkey" FOREIGN KEY ("seboId") REFERENCES "Sebo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoProduto" ADD CONSTRAINT "FotoProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
