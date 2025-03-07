module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testEnvironment: 'node',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['src/**/*.(t|j)s'],
	coverageDirectory: './coverage',
	testMatch: [
		'<rootDir>/src/**/*.spec.ts',
		'<rootDir>/test/**/*.spec.ts',
	],
	moduleNameMapper: {
		'^@jackpot/testing-utils$': '<rootDir>/../../packages/testing-utils/src',
	},
	setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
	testPathIgnorePatterns: ['/node_modules/'],
	coveragePathIgnorePatterns: ['/node_modules/'],
};
