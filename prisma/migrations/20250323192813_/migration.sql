-- CreateTable
CREATE TABLE "CestaProduto" (
    "quantidade" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "CestaProduto_pkey" PRIMARY KEY ("usuarioId","produtoId")
);

-- AddForeignKey
ALTER TABLE "CestaProduto" ADD CONSTRAINT "CestaProduto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CestaProduto" ADD CONSTRAINT "CestaProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
