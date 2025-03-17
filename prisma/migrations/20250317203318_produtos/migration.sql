-- CreateEnum
CREATE TYPE "StatusProduto" AS ENUM ('ATIVO', 'EXCLUIDO');

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "status" "StatusProduto" NOT NULL DEFAULT 'ATIVO',
    "categoria" TEXT NOT NULL,
    "qtdEstoque" INTEGER NOT NULL,
    "estadoConservacao" TEXT NOT NULL,
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
CREATE TABLE "ProdutoFoto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "ProdutoFoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProdutoFoto" ADD CONSTRAINT "ProdutoFoto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
