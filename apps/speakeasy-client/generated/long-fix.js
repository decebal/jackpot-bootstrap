"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Re-export Long with proper default export
 * This fixes the import issue in the generated proto code
 */
const long_1 = __importDefault(require("long"));
exports.default = long_1.default;
//# sourceMappingURL=long-fix.js.map