-- AlterTable
ALTER TABLE "Produto" ALTER COLUMN "anoEdicao" DROP NOT NULL,
ALTER COLUMN "anoLancamento" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sebo" ADD COLUMN     "horarioFim" TIMESTAMP(3),
ADD COLUMN     "horarioInicio" TIMESTAMP(3);
