export declare abstract class TestFixture<T> {
    abstract create(overrides?: Partial<T>): T;
    createMany(count: number, overrides?: Partial<T>): T[];
}
export declare function createFixture<T>(defaultValues: T): TestFixture<T>;
export declare function randomString(length?: number): string;
export declare function randomNumber(min?: number, max?: number): number;
export declare function randomDate(start?: Date, end?: Date): Date;
