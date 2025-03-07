/**
 * Base class for test fixtures
 */
export abstract class TestFixture<T> {
  /**
   * Creates a single entity with default values
   * @param overrides - Properties to override default values
   * @returns A single entity
   */
  abstract create(overrides?: Partial<T>): T;

  /**
   * Creates multiple entities with default values
   * @param count - Number of entities to create
   * @param overrides - Properties to override default values
   * @returns An array of entities
   */
  createMany(count: number, overrides?: Partial<T>): T[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Factory function to create a test fixture
 * @param defaultValues - Default values for the fixture
 * @returns A test fixture
 */
export function createFixture<T>(defaultValues: T): TestFixture<T> {
  return new (class extends TestFixture<T> {
    create(overrides: Partial<T> = {}): T {
      return {
        ...defaultValues,
        ...overrides,
      };
    }
  })();
}

/**
 * Helper function to generate a random string
 * @param length - Length of the string
 * @returns A random string
 */
export function randomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Helper function to generate a random number
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns A random number
 */
export function randomNumber(min: number = 0, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Helper function to generate a random date
 * @param start - Start date
 * @param end - End date
 * @returns A random date
 */
export function randomDate(
  start: Date = new Date(2020, 0, 1),
  end: Date = new Date()
): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
