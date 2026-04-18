// server/src/index.ts with proper error handling
import express, { json, urlencoded } from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { errorHandler, configurePassport } from "./middleware";
import { logger } from "./utils/logger";

const app = express();
const prisma = new PrismaClient();

// Security middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(json({ limit: "10mb" }));
app.use(urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Passport configuration
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    method: req.method,
    path: req.path,
  });
  next();
});

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes would be mounted here
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// ... etc

app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API",
    version: "2.0.0",
    status: "running",
  });
});

// Error handling (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
