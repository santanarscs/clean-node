module.exports = {
  preset: '@shelf/jest-mongodb',
  roots: ['<rootDir>/tests'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/test/**',
    '!**/config/**'
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '@test/(.*)$': '<rootDir>/tests/$1'
  }
}
