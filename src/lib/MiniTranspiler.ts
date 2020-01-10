import ts = require('typescript');

export interface MiniTranspilerOptions {
  sourceDir: string;
  outDir: string;
  compileOptions: ts.CompilerOptions;
}

export const DEFAULT_COMPILER_OPTIONS = {
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

export class MiniTranspiler {
  private _opt: MiniTranspilerOptions;

  constructor(opt?: Partial<MiniTranspilerOptions>) {
    opt = opt || {};
    this._opt = {
      sourceDir: opt.sourceDir || 'lang/src',
      outDir: opt.outDir || 'lang/build',
      compileOptions: {}
    };
    this._opt.compileOptions = {
      ...DEFAULT_COMPILER_OPTIONS,
      ...(opt.compileOptions || {}),
      outDir: this._opt.outDir,
      rootDir: this._opt.sourceDir
    };
  }

  public compile(files: string[]): boolean {
    const program = ts.createProgram(files, this._opt.compileOptions);
    const result = program.emit();
    return !result.emitSkipped;
  }
}
