// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "^\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "vitest-environment-jsdom-global",
    },
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[tj]s?(x)",
    ],
  },
});

// vitest.setup.ts
import "@testing-library/jest-dom";
