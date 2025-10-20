import type { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma.js";

export type TrpcContext = {
  prisma: typeof prisma;
  req: FastifyRequest;
  reply: FastifyReply;
};

export async function createContext({
  req,
  res
}: {
  req: FastifyRequest;
  res: FastifyReply;
}): Promise<TrpcContext> {
  return {
    prisma,
    req,
    reply: res
  };
}
