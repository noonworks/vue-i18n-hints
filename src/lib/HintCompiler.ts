import * as ts from 'typescript';
import { PathManager } from './PathManager';
import { ASTTransformer } from './ASTTransformer';

export interface HintCompilerOptions {
  tsconfig?: ts.CompilerOptions;
  curDir?: string;
  hintsDir?: string;
  rootDir?: string;
  postfix?: string;
}

export class HintCompiler {
  private _opt: HintCompilerOptions;
  private _pmgr: PathManager;

  constructor(opt?: HintCompilerOptions) {
    opt = opt || {};
    opt.tsconfig = opt.tsconfig || {};
    this._opt = opt;
    this._pmgr = new PathManager({
      curDir: opt.curDir || process.cwd(),
      hintsDir: opt.hintsDir || opt.tsconfig.outDir || '.',
      rootDir: opt.rootDir || opt.tsconfig.rootDir || '.',
      postfix: opt.postfix || 'Hints'
    });
  }

  public compile(files: string[]): void {
    const fls = files.map(f => {
      return { source: f, dest: this._pmgr.transformPath(f) };
    });
    const trsfmr = new ASTTransformer({
      files: fls,
      tsconfig: this._opt.tsconfig
    });
    trsfmr.compile();
  }
}
