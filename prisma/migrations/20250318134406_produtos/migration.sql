-- CreateEnum
CREATE TYPE "StatusProduto" AS ENUM ('ATIVO', 'EXCLUIDO');

-- CreateEnum
CREATE TYPE "CategoriaProduto" AS ENUM ('LIVRO', 'DISCO', 'CD', 'DVD', 'REVISTA', 'GIBI');

-- CreateEnum
CREATE TYPE "EstadoConservacaoProduto" AS ENUM ('NOVO', 'EXECELENTE', 'BOM', 'ACEITAVEL', 'RUIM');

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
    "seboId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoProduto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "FotoProduto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FotoProduto" ADD CONSTRAINT "FotoProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
