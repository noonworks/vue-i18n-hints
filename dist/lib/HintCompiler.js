"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PathManager_1 = require("./PathManager");
const HintTransformer_1 = require("./HintTransformer");
const IF2Const_1 = require("./IF2Const");
class HintCompiler {
    constructor(opt) {
        opt = opt || {};
        this._opt = {
            sourceDir: opt.sourceDir || 'lang/src',
            outDir: opt.outDir || 'lang/build',
            postfix: opt.postfix || 'Hints'
        };
        this._pmgr = new PathManager_1.PathManager({
            sourceDir: this._opt.sourceDir,
            hintsDir: this._opt.outDir,
            postfix: this._opt.postfix
        });
    }
    compile(files) {
        const factory = src => {
            return IF2Const_1.IF2ConstFactory(this._pmgr.importPath(src.fileName));
        };
        const trsfmr = new HintTransformer_1.HintTransformer({
            files,
            transformers: [],
            transformerFactories: [factory]
        });
        const result = { succeed: [], failed: [] };
        const compiled = trsfmr.compile();
        compiled.forEach(r => {
            if (!this._pmgr.inDir(this._opt.sourceDir, r.filename))
                return;
            const destination = this._pmgr.dest(r.filename);
            if (destination.length === 0 || r.source.length === 0)
                return;
            const err = this._pmgr.save(destination, r.source);
            if (!err)
                result.succeed.push({ source: r.filename, destination });
            else
                result.failed.push({ source: r.filename, destination, error: err });
        });
        return result;
    }
}
exports.HintCompiler = HintCompiler;
