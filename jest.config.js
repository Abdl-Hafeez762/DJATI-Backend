/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "<rootDir>/src/tests/globalSetup.js",
  globalTeardown: "<rootDir>/src/tests/globalTeardown.js",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  testMatch: ["**/*.test.ts"],
  forceExit: true,
  testTimeout: 30000,
};
