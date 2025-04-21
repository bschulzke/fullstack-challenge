module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Optional but helpful:
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
  };
