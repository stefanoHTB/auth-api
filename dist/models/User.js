"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var UserRole;
(function (UserRole) {
    UserRole["User"] = "2001";
    UserRole["Editor"] = "";
    UserRole["Admin"] = "";
})(UserRole || (UserRole = {}));
exports.userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    roles: {
        User: {
            type: String,
            default: UserRole.User,
        },
        Editor: {
            type: String,
            default: UserRole.Editor,
        },
        Admin: {
            type: String,
            default: UserRole.Admin,
        },
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: [String],
});
exports.User = mongoose_1.default.model("User", exports.userSchema);
exports.default = exports.User;
//# sourceMappingURL=User.js.map