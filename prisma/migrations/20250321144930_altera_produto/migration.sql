/*
  Warnings:

  - The values [GIBI] on the enum `CategoriaProduto` will be removed. If these variants are still used in the database, this will fail.
  - The values [EXECELENTE,BOM,ACEITAVEL,RUIM] on the enum `EstadoConservacaoProduto` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoriaProduto_new" AS ENUM ('LIVRO', 'REVISTA', 'QUADRINHOS', 'DISCO', 'CD', 'DVD');
ALTER TABLE "Produto" ALTER COLUMN "categoria" TYPE "CategoriaProduto_new" USING ("categoria"::text::"CategoriaProduto_new");
ALTER TYPE "CategoriaProduto" RENAME TO "CategoriaProduto_old";
ALTER TYPE "CategoriaProduto_new" RENAME TO "CategoriaProduto";
DROP TYPE "CategoriaProduto_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoConservacaoProduto_new" AS ENUM ('NOVO', 'SEMINOVO', 'USADO');
ALTER TABLE "Produto" ALTER COLUMN "estadoConservacao" TYPE "EstadoConservacaoProduto_new" USING ("estadoConservacao"::text::"EstadoConservacaoProduto_new");
ALTER TYPE "EstadoConservacaoProduto" RENAME TO "EstadoConservacaoProduto_old";
ALTER TYPE "EstadoConservacaoProduto_new" RENAME TO "EstadoConservacaoProduto";
DROP TYPE "EstadoConservacaoProduto_old";
COMMIT;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "generos" TEXT[];
