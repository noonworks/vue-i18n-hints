import * as ts from 'typescript';
import { IF2Const } from './IF2Const';

export interface ASTTransformerOption {
  files: {
    source: string;
    dest: string;
  }[];
  tsconfig?: ts.CompilerOptions;
}

export interface ASTTransformResult {
  path: string;
  source: string;
}

export class ASTTransformer {
  private _opt: ASTTransformerOption;
  private _srcFiles: string[] = [];
  private _program: ts.Program;
  private _printer: ts.Printer;
  private _sources: ts.SourceFile[];

  constructor(opt: ASTTransformerOption) {
    this._opt = { ...opt, tsconfig: opt.tsconfig || {} };
    this._srcFiles = this._opt.files.map(f => f.source);
    this._program = ts.createProgram(
      this._opt.files.map(f => f.source),
      this._opt.tsconfig || {}
    );
    this._printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed
    });
    this._sources = this._program.getSourceFiles() as ts.SourceFile[];
  }

  public compile(): ASTTransformResult[] {
    const result: ASTTransformResult[] = [];
    for (const src of this._sources) {
      const idx = this._srcFiles.indexOf(src.fileName);
      if (idx < 0) continue;
      const dest = ts.transform(src, [IF2Const]);
      if (dest.transformed.length === 1 && dest.transformed[0]) {
        result.push({
          path: this._opt.files[idx].dest,
          source: this._printer.printFile(dest.transformed[0] as ts.SourceFile)
        });
      }
      dest.dispose();
    }
    return result;
  }
}
