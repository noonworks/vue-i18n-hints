import * as ts from 'typescript';
import { PathManager } from './PathManager';

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
}
