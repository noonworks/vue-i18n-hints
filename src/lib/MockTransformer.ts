import * as ts from 'typescript';

export interface MockTransformerOption {
  files: string[];
  tsconfig?: ts.CompilerOptions;
  transformers: ts.TransformerFactory<ts.SourceFile>[];
}

export interface MockTransformResult {
  source: string;
}

export class MockTransformer {
  private _opt: MockTransformerOption;
  private _program: ts.Program;
  private _printer: ts.Printer;

  constructor(opt: MockTransformerOption) {
    this._opt = opt;
    this._program = ts.createProgram(opt.files, opt.tsconfig || {});
    this._printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed
    });
  }

  public compile(): MockTransformResult[] {
    const result: MockTransformResult[] = [];
    const sources = this._program.getSourceFiles();
    for (const src of sources) {
      const idx = this._opt.files.indexOf(src.fileName);
      if (idx < 0) continue;
      const dest = ts.transform(src, this._opt.transformers);
      if (dest.transformed.length === 1 && dest.transformed[0]) {
        result.push({
          source: this._printer.printFile(dest.transformed[0] as ts.SourceFile)
        });
      }
      dest.dispose();
    }
    return result;
  }
}
