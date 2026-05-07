import { expect, test } from "@playwright/test";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../src/server";

let app: FastifyInstance;

test.beforeAll(async () => {
  process.env.NODE_ENV = "test";

  app = buildApp();
  await app.ready();
});

test.afterAll(async () => {
  await app.close();
});

test("GET /health returns ok", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/health",
  });

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.payload)).toEqual({ ok: true });
});

test("POST /auth/register rejects invalid body before hitting the database", async () => {
  const response = await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: {
      name: "Em",
      email: "invalid-email",
      password: "password",
      taxId: 12345678,
    },
  });

  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.payload)).toMatchObject({ message: "Invalid request body" });
});

test("POST /auth/login rejects invalid body before hitting the database", async () => {
  const response = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: {
      email: "invalid-email",
      password: "short",
    },
  });

  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.payload)).toMatchObject({ message: "Invalid request body" });
});

test("GET /users/transactions rejects invalid query before hitting auth or database", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/users/transactions?paidToTaxIdLast3=12&minAmount=100&maxAmount=10",
  });

  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.payload)).toMatchObject({
    message: "Invalid query params",
  });
});

test("GET /payment-keys/:key requires auth before validating params", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/payment-keys/not-a-uuid",
  });

  expect(response.statusCode).toBe(401);
  expect(JSON.parse(response.payload)).toMatchObject({
    message: "Token não enviado",
  });
});

test("POST /payments requires auth before creating payment", async () => {
  const response = await app.inject({
    method: "POST",
    url: "/payments",
    payload: {
      paymentKey: "not-a-uuid",
      amount: 0,
    },
  });

  expect(response.statusCode).toBe(401);
  expect(JSON.parse(response.payload)).toMatchObject({
    message: "Token não enviado",
  });
});
