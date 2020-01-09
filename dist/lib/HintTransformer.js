"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
class HintTransformer {
    constructor(opt) {
        this._opt = opt;
        this._program = ts.createProgram(opt.files, opt.tsconfig || {});
        this._printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed
        });
    }
    compile() {
        const result = [];
        const sources = this._program.getSourceFiles();
        for (const src of sources) {
            const idx = this._opt.files.indexOf(src.fileName);
            if (idx < 0)
                continue;
            const dest = ts.transform(src, [
                ...this._opt.transformers,
                ...this._opt.transformerFactories.map(tff => tff(src))
            ]);
            if (dest.transformed.length === 1 && dest.transformed[0]) {
                result.push({
                    filename: src.fileName,
                    source: this._printer.printFile(dest.transformed[0])
                });
            }
            dest.dispose();
        }
        return result;
    }
}
exports.HintTransformer = HintTransformer;
