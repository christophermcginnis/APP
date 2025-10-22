import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(rootDir, '..');
const pnpmModulesRoot = path.join(workspaceRoot, "node_modules", ".pnpm");

if (!existsSync(pnpmModulesRoot)) {
  process.exit(0);
}

const packagesToRepair = [
  {
    matches: (entry) => entry.startsWith("fastify@"),
    packageJsonPath: (entry) =>
      path.join(pnpmModulesRoot, entry, "node_modules", "avvio", "package.json"),
    template: {
      name: "avvio",
      version: "8.4.1",
      description: "Asynchronous bootstrapping framework",
      main: "avvio.js",
      types: "types/index.d.ts",
      type: "commonjs",
    },
  },
  {
    matches: (entry) => entry.startsWith("next@"),
    packageJsonPath: (entry) =>
      path.join(
        pnpmModulesRoot,
        entry,
        "node_modules",
        "next",
        "dist",
        "compiled",
        "commander",
        "package.json",
      ),
    template: {
      name: "commander",
      version: "9.5.0",
      main: "./index.js",
    },
  },
];

function ensureValidJson(targetPath, template) {
  if (!existsSync(targetPath)) {
    return;
  }

  let needsRewrite = false;

  try {
    const contents = readFileSync(targetPath, "utf8");

    if (contents.trim().length === 0) {
      needsRewrite = true;
    } else {
      JSON.parse(contents);
    }
  } catch (error) {
    needsRewrite = true;
  }

  if (!needsRewrite) {
    return;
  }

  const payload = `${JSON.stringify(template, null, 2)}\n`;
  writeFileSync(targetPath, payload, "utf8");
  console.log(`[fix-deps] Repaired invalid JSON at ${path.relative(workspaceRoot, targetPath)}`);
}

for (const entry of readdirSync(pnpmModulesRoot)) {
  for (const candidate of packagesToRepair) {
    if (!candidate.matches(entry)) {
      continue;
    }

    const candidatePath = candidate.packageJsonPath(entry);
    ensureValidJson(candidatePath, candidate.template);
  }
}
