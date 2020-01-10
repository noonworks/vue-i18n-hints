"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
exports.DEFAULT_COMPILER_OPTIONS = {
    target: ts.ScriptTarget.ES2018,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    declaration: false,
    sourceMap: false,
    noEmit: false,
    noEmitOnError: true,
    allowJs: false,
    newLine: ts.NewLineKind.LineFeed,
    skipLibCheck: true
};
class MiniTranspiler {
    constructor(opt) {
        opt = opt || {};
        this._opt = {
            sourceDir: opt.sourceDir || 'lang/src',
            outDir: opt.outDir || 'lang/build',
            compileOptions: {}
        };
        this._opt.compileOptions = {
            ...exports.DEFAULT_COMPILER_OPTIONS,
            ...(opt.compileOptions || {}),
            outDir: this._opt.outDir,
            rootDir: this._opt.sourceDir
        };
    }
    compile(files) {
        const program = ts.createProgram(files, this._opt.compileOptions);
        const result = program.emit();
        return !result.emitSkipped;
    }
}
exports.MiniTranspiler = MiniTranspiler;
