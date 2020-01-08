import { PathManager } from './PathManager';
import { ASTTransformer } from './ASTTransformer';

export interface HintCompilerOptions {
  rootDir: string;
  sourceDir: string;
  hintsDir: string;
  jsDir: string;
  postfix: string;
}

export class HintCompiler {
  private _opt: HintCompilerOptions;
  private _pmgr: PathManager;

  constructor(opt?: Partial<HintCompilerOptions>) {
    opt = opt || {};
    this._opt = {
      rootDir: opt.rootDir || '',
      sourceDir: opt.sourceDir || 'lang/src',
      hintsDir: opt.hintsDir || 'lang/build',
      jsDir: opt.jsDir || 'lang/build',
      postfix: opt.postfix || 'Hints'
    };
    this._pmgr = new PathManager({
      sourceDir: this._opt.sourceDir,
      hintsDir: this._opt.hintsDir,
      postfix: this._opt.postfix
    });
  }

  public compile(files: string[]): void {
    const fls = files.map(f => {
      return { source: f, dest: this._pmgr.transformPath(f) };
    });
    const trsfmr = new ASTTransformer({
      files: fls,
      tsconfig: {}
    });
    trsfmr.compile();
  }
}
