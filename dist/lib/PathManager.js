"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const D_TS_EXT = /\.d\.ts$/i;
class PathManager {
    constructor(opt) {
        this._opt = opt;
        this._absSrc = path_1.posix.resolve(opt.sourceDir);
    }
    getBase(path) {
        const ext = D_TS_EXT.test(path) ? '.d.ts' : path_1.posix.extname(path);
        return { base: path_1.posix.basename(path, ext), ext };
    }
    getDestFilename(path) {
        const base = this.getBase(path);
        const distext = base.ext === '.d.ts' ? '.ts' : base.ext;
        return base.base + this._opt.postfix + distext;
    }
    dest(src) {
        const absSrc = path_1.posix.resolve(src);
        const relSrc = path_1.posix.relative(this._absSrc, absSrc);
        const relDir = path_1.posix.dirname(relSrc);
        const destbase = this.getDestFilename(src);
        return path_1.posix.normalize(path_1.posix.join(this._opt.hintsDir, relDir, destbase));
    }
    importPath(path) {
        const destdir = path_1.posix.dirname(this.dest(path));
        const impdir = path_1.posix.relative(destdir, path_1.posix.dirname(path));
        const imp = path_1.posix.join(impdir, this.getBase(path).base);
        return path_1.posix.normalize(imp);
    }
    inDir(dir, file) {
        const absDir = path_1.posix.resolve(dir);
        const absFile = path_1.posix.resolve(file);
        return absFile.indexOf(absDir) === 0;
    }
    save(path, source) {
        const dir = path_1.posix.dirname(path);
        try {
            fs_1.mkdirSync(dir, { recursive: true });
            fs_1.writeFileSync(path, source);
            return null;
        }
        catch (error) {
            return error;
        }
    }
}
exports.PathManager = PathManager;
