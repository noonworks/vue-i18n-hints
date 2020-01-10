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
        const result = trsfmr.compile();
        result.forEach(r => {
            const i = files.indexOf(r.filename);
            if (i < 0)
                return;
            this.save(this._pmgr.dest(files[i]), r.source);
        });
    }
    save(file, source) {
        if (file.length === 0 || source.length === 0)
            return;
        this._pmgr.save(file, source);
    }
}
exports.HintCompiler = HintCompiler;
