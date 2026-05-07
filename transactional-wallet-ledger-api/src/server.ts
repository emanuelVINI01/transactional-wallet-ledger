import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import cors from "@fastify/cors";
import Fastify from "fastify";
import { authRoutes } from "@/src/modules/auth";
import { paymentRoutes } from "@/src/modules/payment";
import { paymentKeyRoutes } from "@/src/modules/payment-key";
import { userRoutes } from "@/src/modules/user";

export function buildApp() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== "test",
  });

  app.register(cors, {
    origin: process.env.FRONTEND_URL?.split(",") ?? [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
  });

  app.get("/health", async () => {
    return { ok: true };
  });

  app.register(authRoutes, {
    prefix: "/auth",
  });

  app.register(userRoutes, {
    prefix: "/users",
  });

  app.register(paymentKeyRoutes, {
    prefix: "/payment-keys",
  });

  app.register(paymentRoutes, {
    prefix: "/payments",
  });

  return app;
}

export async function startServer() {
  const app = buildApp();
  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? "0.0.0.0";

  try {
    await app.listen({ port, host });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

const currentFile = fileURLToPath(import.meta.url);
const entryFile = process.argv[1] ? resolve(process.argv[1]) : "";

if (entryFile === currentFile) {
  void startServer();
}
