import type { PrismaClient } from "@prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";

export function createContext(request: FastifyRequest, reply: FastifyReply) {
  return {
    request,
    reply,
  };
}

export type Context = ReturnType<typeof createContext> & {
  prisma: PrismaClient;
};
