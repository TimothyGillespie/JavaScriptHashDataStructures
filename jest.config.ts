/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coveragePathIgnorePatterns: ['/node_modules/', '/src(/.*)?/index.ts'],

	coverageProvider: 'v8',
	collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],

	coverageReporters: ['text'],

	// use undefined for no minimum
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},

	// An array of file extensions your modules use
	moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
	testPathIgnorePatterns: ['/node_modules/'],

	transform: {
		'^.+\\.(t|j)sx?$': 'ts-jest',
	},
};
