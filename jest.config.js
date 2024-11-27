/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },

    // becuase of verbose true , test cases will show in proper structured way
    verbose: true,

    // below three setup while setup test coverage
    collectCoverage: true,
    coverageProvider: "v8",
    collectCoverageFrom: ["src/**/*.ts", "!tests/**", "!**/node_modules/**"],
};
