-- CreateTable
CREATE TABLE "MarcacaoFavorito" (
    "usuarioId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "MarcacaoFavorito_pkey" PRIMARY KEY ("usuarioId","produtoId")
);

-- AddForeignKey
ALTER TABLE "MarcacaoFavorito" ADD CONSTRAINT "MarcacaoFavorito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarcacaoFavorito" ADD CONSTRAINT "MarcacaoFavorito_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
