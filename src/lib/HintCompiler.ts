import { PathManager } from './PathManager';
import { HintTransformer, HintTransformerFactory } from './HintTransformer';
import { IF2ConstFactory } from './IF2Const';

export interface HintCompilerOptions {
  sourceDir: string;
  outDir: string;
  postfix: string;
}

interface ResultPath {
  source: string;
  destination: string;
  error?: Error | string;
}

interface Result {
  succeed: ResultPath[];
  failed: ResultPath[];
}

export class HintCompiler {
  private _opt: HintCompilerOptions;
  private _pmgr: PathManager;

  constructor(opt?: Partial<HintCompilerOptions>) {
    opt = opt || {};
    this._opt = {
      sourceDir: opt.sourceDir || 'lang/src',
      outDir: opt.outDir || 'lang/build',
      postfix: opt.postfix || 'Hints'
    };
    this._pmgr = new PathManager({
      sourceDir: this._opt.sourceDir,
      hintsDir: this._opt.outDir,
      postfix: this._opt.postfix
    });
  }

  public compile(files: string[]): Result {
    const factory: HintTransformerFactory = src => {
      return IF2ConstFactory(this._pmgr.importPath(src.fileName));
    };
    const trsfmr = new HintTransformer({
      files,
      transformers: [],
      transformerFactories: [factory]
    });
    const result: Result = { succeed: [], failed: [] };
    const compiled = trsfmr.compile();
    compiled.forEach(r => {
      if (!this._pmgr.inDir(this._opt.sourceDir, r.filename)) return;
      const destination = this._pmgr.dest(r.filename);
      if (destination.length === 0 || r.source.length === 0) return;
      const err = this._pmgr.save(destination, r.source);
      if (!err) result.succeed.push({ source: r.filename, destination });
      else result.failed.push({ source: r.filename, destination, error: err });
    });
    return result;
  }
}
