import "dotenv/config";
import { buildServer } from "./app.js";
import { prisma } from "./lib/prisma.js";

const port = Number(process.env.PORT ?? 3030);
const host = process.env.HOST ?? "0.0.0.0";

async function start() {
  const server = await buildServer();
  try {
    await server.listen({ port, host });
    server.log.info(`CircleCast API running at http://${host}:${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

shutdownSignals.forEach((signal) => {
  process.on(signal, async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
