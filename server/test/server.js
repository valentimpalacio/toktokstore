import { server } from "./server/test/server";
import { rest } from "msw";
import { setupServer } from "msw/node";

// API handlers
const handlers = [
  // Auth handlers
  rest.post("http://localhost:5000/api/auth/login", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: "test-token",
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          role: "USER",
        },
      }),
    );
  }),

  rest.post("http://localhost:5000/api/auth/register", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        token: "test-token",
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
        },
      }),
    );
  }),

  rest.get("http://localhost:5000/api/auth/me", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      }),
    );
  }),

  // Product handlers
  rest.get("http://localhost:5000/api/products", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: "1",
          name: "Test Product 1",
          price: 2999,
          stock: 10,
          description: "Test product 1",
          category: { id: "1", name: "Electronics" },
        },
        {
          id: "2",
          name: "Test Product 2",
          price: 4999,
          stock: 5,
          description: "Test product 2",
          category: { id: "2", name: "Accessories" },
        },
      ]),
    );
  }),

  rest.get("http://localhost:5000/api/products/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        name: "Test Product",
        price: 2999,
        stock: 10,
        description: "Test product description",
        category: { id: "1", name: "Electronics" },
      }),
    );
  }),

  // Order handlers
  rest.post("http://localhost:5000/api/orders", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: "order-123",
        items: req.body.items,
        total: 5998,
      }),
    );
  }),

  // Category handlers
  rest.get("http://localhost:5000/api/products/categories", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: "1", name: "Electronics" },
        { id: "2", name: "Accessories" },
      ]),
    );
  }),
];

export const server = setupServer(...handlers);
