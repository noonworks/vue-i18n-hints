import { PathManager } from './PathManager';
import { HintTransformer, HintTransformerFactory } from './HintTransformer';
import { IF2ConstFactory } from './IF2Const';

export interface HintCompilerOptions {
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
    const factory: HintTransformerFactory = src => {
      return IF2ConstFactory(this._pmgr.importPath(src.fileName));
    };
    const trsfmr = new HintTransformer({
      files,
      transformers: [],
      transformerFactories: [factory]
    });
    const result = trsfmr.compile();
    result.forEach(r => {
      const i = files.indexOf(r.filename);
      if (i < 0) return;
      this.save(this._pmgr.dest(files[i]), r.source);
    });
  }

  private save(file: string, source: string): void {
    if (file.length === 0 || source.length === 0) return;
    this._pmgr.save(file, source);
  }
}
