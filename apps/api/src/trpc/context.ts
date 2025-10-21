import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";

type JwtDecodeParams = {
  token: string;
  secret: string;
  salt?: string;
};

type JwtPayload = {
  sub?: string;
  handle?: unknown;
  [key: string]: unknown;
};

type JwtDecode = (params: JwtDecodeParams) => Promise<JwtPayload | null>;

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

let cachedJwtDecode: JwtDecode | null = null;
let attemptedToLoadJwtDecode = false;

const SESSION_COOKIE_NAMES = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
  "__Secure-authjs.session-token",
  "authjs.session-token"
] as const;

function resolveAuthSecret(request: FastifyRequest): string | null {
  const candidateSecrets = [
    request.server.env?.NEXTAUTH_SECRET,
    request.server.env?.AUTH_SECRET,
    process.env.NEXTAUTH_SECRET,
    process.env.AUTH_SECRET
  ];

  for (const secret of candidateSecrets) {
    if (secret && secret.trim().length > 0) {
      return secret;
    }
  }

  return null;
}

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

  const secret = resolveAuthSecret(request);

  if (!secret) {
    request.log.warn(
      "No Auth.js secret configured; rejecting session token. Set NEXTAUTH_SECRET or AUTH_SECRET to enable session verification."
    );
    return null;
  }

  const decodeJwt = await loadJwtDecode(request);

  if (!decodeJwt) {
    return null;
  }

  try {
    const decoded = await decodeJwt({ token, secret });
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

async function loadJwtDecode(request: FastifyRequest): Promise<JwtDecode | null> {
  if (cachedJwtDecode) {
    return cachedJwtDecode;
  }

  if (attemptedToLoadJwtDecode) {
    return null;
  }

  attemptedToLoadJwtDecode = true;

  const candidates = ["@auth/core/jwt", "next-auth/jwt"] as const;

  for (const specifier of candidates) {
    try {
      const mod = await import(specifier);
      const candidate = (mod as { decode?: unknown }).decode;

      if (typeof candidate === "function") {
        cachedJwtDecode = candidate as JwtDecode;
        request.log.debug({ provider: specifier }, "Loaded Auth.js JWT decoder");
        return cachedJwtDecode;
      }
    } catch (error) {
      request.log.debug({ err: error, provider: specifier }, "Failed to load Auth.js JWT decoder");
    }
  }

  request.log.warn(
    "Auth.js JWT helpers are not available; session tokens will not be processed. Install `@auth/core` or `next-auth` to enable session verification."
  );

  return null;
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
