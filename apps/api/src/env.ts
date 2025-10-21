import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(currentDir, "..");
const packageEnvPath = join(packageRoot, ".env");

if (existsSync(packageEnvPath)) {
  dotenv.config({ path: packageEnvPath });
} else {
  dotenv.config();
}
