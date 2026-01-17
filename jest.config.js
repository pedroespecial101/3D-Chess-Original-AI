/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@logic/(.*)$': '<rootDir>/src/logic/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    collectCoverageFrom: [
        'src/logic/**/*.ts',
        'src/utils/chess.ts',
        '!src/**/*.d.ts',
    ],
}
