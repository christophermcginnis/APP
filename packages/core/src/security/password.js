import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const HASH_IDENTIFIER = "scrypt";
const HASH_VERSION = "1";

const DEFAULT_COST = 16384;
const DEFAULT_BLOCK_SIZE = 8;
const DEFAULT_PARALLELIZATION = 1;
const DEFAULT_KEY_LENGTH = 64;
const DEFAULT_SALT_LENGTH = 16;

const DEFAULT_OPTIONS = {
  cost: DEFAULT_COST,
  blockSize: DEFAULT_BLOCK_SIZE,
  parallelization: DEFAULT_PARALLELIZATION,
  keyLength: DEFAULT_KEY_LENGTH,
  saltLength: DEFAULT_SALT_LENGTH
};

function encodeHash(components) {
  const salt = typeof components.salt === "string" ? components.salt : components.salt.toString("base64");
  const hash = typeof components.hash === "string" ? components.hash : components.hash.toString("base64");

  return `${components.algorithm}:${components.version}:${components.cost}:${components.blockSize}:${components.parallelization}:${components.keyLength}:${salt}:${hash}`;
}

function decodeHash(hash) {
  const parts = hash.split(":");
  if (parts.length !== 8) {
    return null;
  }

  const [algorithm, version, costStr, blockStr, parallelStr, keyLengthStr, saltB64, hashB64] = parts;

  const cost = Number.parseInt(costStr, 10);
  const blockSize = Number.parseInt(blockStr, 10);
  const parallelization = Number.parseInt(parallelStr, 10);
  const keyLength = Number.parseInt(keyLengthStr, 10);

  if (!Number.isFinite(cost) || !Number.isFinite(blockSize) || !Number.isFinite(parallelization) || !Number.isFinite(keyLength)) {
    return null;
  }

  if (saltB64.length === 0 || hashB64.length === 0) {
    return null;
  }

  try {
    const salt = Buffer.from(saltB64, "base64");
    const hashBuffer = Buffer.from(hashB64, "base64");

    return {
      algorithm,
      version,
      cost,
      blockSize,
      parallelization,
      keyLength,
      salt,
      hash: hashBuffer
    };
  } catch (error) {
    return null;
  }
}

export function isLegacyBcryptHash(hash) {
  return hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$");
}

export async function hashPassword(password, options = {}) {
  const resolvedOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const salt = randomBytes(resolvedOptions.saltLength);

  const derivedKey = await scrypt(password, salt, resolvedOptions.keyLength, {
    N: resolvedOptions.cost,
    r: resolvedOptions.blockSize,
    p: resolvedOptions.parallelization,
    maxmem: resolvedOptions.cost * resolvedOptions.blockSize * 128 * 2
  });

  return encodeHash({
    algorithm: HASH_IDENTIFIER,
    version: HASH_VERSION,
    cost: resolvedOptions.cost,
    blockSize: resolvedOptions.blockSize,
    parallelization: resolvedOptions.parallelization,
    keyLength: resolvedOptions.keyLength,
    salt,
    hash: derivedKey
  });
}

export async function verifyPassword(password, storedHash) {
  if (isLegacyBcryptHash(storedHash)) {
    throw new Error(
      "Encountered legacy bcrypt hash. Please re-hash credentials using the updated password utilities."
    );
  }

  const decoded = decodeHash(storedHash);
  if (!decoded) {
    return false;
  }

  if (decoded.algorithm !== HASH_IDENTIFIER || decoded.version !== HASH_VERSION) {
    return false;
  }

  const derivedKey = await scrypt(password, decoded.salt, decoded.keyLength, {
    N: decoded.cost,
    r: decoded.blockSize,
    p: decoded.parallelization,
    maxmem: decoded.cost * decoded.blockSize * 128 * 2
  });

  if (derivedKey.length !== decoded.hash.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, decoded.hash);
}

export function needsRehash(storedHash, options = {}) {
  const decoded = decodeHash(storedHash);

  if (!decoded) {
    return true;
  }

  if (decoded.algorithm !== HASH_IDENTIFIER || decoded.version !== HASH_VERSION) {
    return true;
  }

  const resolvedOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  return (
    decoded.cost !== resolvedOptions.cost ||
    decoded.blockSize !== resolvedOptions.blockSize ||
    decoded.parallelization !== resolvedOptions.parallelization ||
    decoded.keyLength !== resolvedOptions.keyLength
  );
}

