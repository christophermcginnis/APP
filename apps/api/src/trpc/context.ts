import { createHmac, timingSafeEqual } from "crypto";
import type { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../lib/prisma.js";

type Session = {
  user: {
    id: string;
    handle?: string | null;
  };
};

export type TrpcContext = {
  prisma: typeof prisma;
  req: FastifyRequest;
  reply: FastifyReply;
  session: Session | null;
};

const SESSION_COOKIE_NAMES = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
  "__Secure-authjs.session-token",
  "authjs.session-token"
] as const;

function extractBearerToken(request: FastifyRequest): string | null {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim().length > 0 ? token.trim() : null;
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader
    .split(";")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .reduce<Record<string, string>>((all, segment) => {
      const separatorIndex = segment.indexOf("=");

      if (separatorIndex === -1) {
        return all;
      }

      const name = segment.slice(0, separatorIndex).trim();
      const value = segment.slice(separatorIndex + 1);

      if (name.length === 0) {
        return all;
      }

      try {
        all[name] = decodeURIComponent(value);
      } catch {
        all[name] = value;
      }

      return all;
    }, {});
}

function extractSessionToken(request: FastifyRequest): string | null {
  const bearerToken = extractBearerToken(request);

  if (bearerToken) {
    return bearerToken;
  }

  const cookieHeader = Array.isArray(request.headers.cookie)
    ? request.headers.cookie.join("; ")
    : request.headers.cookie;
  const cookies = parseCookies(cookieHeader);

  for (const name of SESSION_COOKIE_NAMES) {
    const value = cookies[name];

    if (value) {
      return value;
    }
  }

  return null;
}

async function resolveSession(request: FastifyRequest): Promise<Session | null> {
  const token = extractSessionToken(request);

  if (!token) {
    return null;
  }

  const secret = request.server.env?.NEXTAUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret) {
    request.log.warn("NEXTAUTH_SECRET is not configured; rejecting session token.");
    return null;
  }

  try {
    const decoded = decodeSessionToken(token, secret);
    if (!decoded) {
      request.log.warn("Failed to verify session token signature.");
      return null;
    }
    const userId = typeof decoded?.sub === "string" ? decoded.sub : null;

    if (!userId) {
      return null;
    }

    return {
      user: {
        id: userId,
        handle: typeof decoded?.handle === "string" ? decoded.handle : null
      }
    };
  } catch (error) {
    request.log.warn({ err: error }, "Failed to decode session token");
    return null;
  }
}

type JwtHeader = {
  alg?: string;
};

type JwtPayload = Record<string, unknown> | null;

const HMAC_ALGORITHMS: Record<string, string> = {
  HS256: "sha256",
  HS384: "sha384",
  HS512: "sha512"
};

function base64UrlDecode(segment: string): Buffer {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4);
  return Buffer.from(normalized + "=".repeat(padding), "base64");
}

function parseJwtComponent<T>(segment: string): T | null {
  try {
    const json = base64UrlDecode(segment).toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function verifyHmacSignature(
  header: JwtHeader,
  token: string,
  signatureSegment: string,
  secret: string
): boolean {
  const algorithm = typeof header.alg === "string" ? header.alg.toUpperCase() : null;

  if (!algorithm) {
    return false;
  }

  const nodeAlgorithm = HMAC_ALGORITHMS[algorithm];

  if (!nodeAlgorithm) {
    return false;
  }

  const signature = base64UrlDecode(signatureSegment);
  const payloadToSign = token.slice(0, token.lastIndexOf("."));

  const candidates = [Buffer.from(secret, "utf8"), Buffer.from(secret, "base64")];

  for (const candidate of candidates) {
    const hmac = createHmac(nodeAlgorithm, candidate);
    hmac.update(payloadToSign);
    const digest = hmac.digest();

    if (digest.length === signature.length && timingSafeEqual(digest, signature)) {
      return true;
    }
  }

  return false;
}

function decodeSessionToken(token: string, secret: string): JwtPayload {
  const segments = token.split(".");

  if (segments.length !== 3) {
    return null;
  }

  const [headerSegment, payloadSegment, signatureSegment] = segments;
  const header = parseJwtComponent<JwtHeader>(headerSegment);
  const payload = parseJwtComponent<Record<string, unknown>>(payloadSegment);

  if (!header || !payload) {
    return null;
  }

  if (!verifyHmacSignature(header, token, signatureSegment, secret)) {
    return null;
  }

  return payload;
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
    session: await resolveSession(req)
  };
}
