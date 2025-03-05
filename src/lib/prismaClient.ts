import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient().$extends({
  result: {
    conta: {
      senha: {
        compute() {
          return undefined;
        },
      },
    },
  },
});
