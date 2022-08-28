import fp from "fastify-plugin";
import { PrismaClient, type Prisma } from "@prisma/client";

export default fp<Prisma.PrismaClientOptions>(async (fastify, opts) => {
  const prisma = new PrismaClient();

  void fastify.decorate("prisma", prisma);

  await prisma.$connect();
  fastify.addHook("onClose", async (server) => {
    server.log.info("disconnecting Prisma from DB");
    await server.prisma.$disconnect();
  });
});

declare module "fastify" {
  export interface FastifyInstance {
    prisma: PrismaClient;
  }
}
