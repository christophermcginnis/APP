import type { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma.js";

type Session = {
  user: {
    id: string;
  };
};

export type TrpcContext = {
  prisma: typeof prisma;
  req: FastifyRequest;
  reply: FastifyReply;
  session: Session | null;
};

function resolveSession(request: FastifyRequest): Session | null {
  const header = request.headers["x-circlecast-user-id"];

  if (!header) {
    return null;
  }

  const userId = Array.isArray(header) ? header[0] : header;

  if (typeof userId !== "string" || userId.trim().length === 0) {
    return null;
  }

  return {
    user: {
      id: userId
    }
  };
}

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
    reply: res,
    session: resolveSession(req)
  };
}
