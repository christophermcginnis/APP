import type { Buffer } from "node:buffer";

export interface PasswordHashComponents {
  algorithm: string;
  version: string;
  cost: number;
  blockSize: number;
  parallelization: number;
  keyLength: number;
  salt: Buffer;
  hash: Buffer;
}

export interface PasswordHashOptions {
  cost: number;
  blockSize: number;
  parallelization: number;
  keyLength: number;
  saltLength: number;
}

export type PasswordHash = `${string}:${string}:${number}:${number}:${number}:${number}:${string}:${string}`;

export declare function isLegacyBcryptHash(hash: string): boolean;

export declare function hashPassword(password: string, options?: Partial<PasswordHashOptions>): Promise<PasswordHash>;

export declare function verifyPassword(password: string, storedHash: string): Promise<boolean>;

export declare function needsRehash(storedHash: string, options?: Partial<PasswordHashOptions>): boolean;

