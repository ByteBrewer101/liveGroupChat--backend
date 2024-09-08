"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(username, ws) {
        (this.username = username), (this.usersocket = ws);
    }
}
exports.User = User;
