// Increase timeout for all tests to accommodate integration tests
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.NODE_ENV = 'test';

// Global beforeAll hook
beforeAll(() => {
  console.log('Starting integration tests...');
});

// Global afterAll hook
afterAll(() => {
  console.log('Finished integration tests');
});
