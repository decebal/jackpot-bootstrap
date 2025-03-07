"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestFixture = void 0;
exports.createFixture = createFixture;
exports.randomString = randomString;
exports.randomNumber = randomNumber;
exports.randomDate = randomDate;
class TestFixture {
    createMany(count, overrides) {
        return Array.from({ length: count }, () => this.create(overrides));
    }
}
exports.TestFixture = TestFixture;
function createFixture(defaultValues) {
    return new (class extends TestFixture {
        create(overrides = {}) {
            return {
                ...defaultValues,
                ...overrides,
            };
        }
    })();
}
function randomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
function randomNumber(min = 0, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDate(start = new Date(2020, 0, 1), end = new Date()) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
//# sourceMappingURL=test-fixtures.js.map