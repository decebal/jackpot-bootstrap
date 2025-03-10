module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/__tests__"],
  transform: {
    "^.+\.tsx?$": "ts-jest",
  },
  testRegex: "(.*\.test\.ts$)",
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "./coverage",
};
