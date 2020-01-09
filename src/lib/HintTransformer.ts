import * as ts from 'typescript';

export type HintTransformerFactory = (
  src: ts.SourceFile
) => ts.TransformerFactory<ts.SourceFile>;

export interface HintTransformerOption {
  files: string[];
  tsconfig?: ts.CompilerOptions;
  transformers: ts.TransformerFactory<ts.SourceFile>[];
  transformerFactories: HintTransformerFactory[];
}

export interface HintTransformermResult {
  filename: string;
  source: string;
}

export class HintTransformer {
  private _opt: HintTransformerOption;
  private _program: ts.Program;
  private _printer: ts.Printer;

  constructor(opt: HintTransformerOption) {
    this._opt = opt;
    this._program = ts.createProgram(opt.files, opt.tsconfig || {});
    this._printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed
    });
  }

  public compile(): HintTransformermResult[] {
    const result: HintTransformermResult[] = [];
    const sources = this._program.getSourceFiles();
    for (const src of sources) {
      const idx = this._opt.files.indexOf(src.fileName);
      if (idx < 0) continue;
      const dest = ts.transform(src, [
        ...this._opt.transformers,
        ...this._opt.transformerFactories.map(tff => tff(src))
      ]);
      if (dest.transformed.length === 1 && dest.transformed[0]) {
        result.push({
          filename: src.fileName,
          source: this._printer.printFile(dest.transformed[0] as ts.SourceFile)
        });
      }
      dest.dispose();
    }
    return result;
  }
}
