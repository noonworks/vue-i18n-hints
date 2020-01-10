"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function unlink(paths) {
    try {
        paths.forEach(path => fs_1.unlinkSync(path));
        return true;
    }
    catch (_) {
        return false;
    }
}
exports.unlink = unlink;
function exists(paths) {
    const exs = paths.map(path => fs_1.existsSync(path));
    const hasTrue = exs.indexOf(true) >= 0;
    const hasFalse = exs.indexOf(false) >= 0;
    if (hasTrue && hasFalse)
        return 2 /* PartialExists */;
    if (hasTrue)
        return 0 /* AllExists */;
    return 1 /* AllNothing */;
}
exports.exists = exists;
function read(path) {
    if (!fs_1.existsSync(path))
        return null;
    const content = fs_1.readFileSync(path);
    return content.toString();
}
exports.read = read;
