import {
  basename,
  extname,
  dirname,
  resolve,
  relative,
  normalize,
  join
} from 'path';

interface PathManagerOptions {
  sourceDir: string;
  hintsDir: string;
  postfix: string;
}

const D_TS_EXT = /\.d\.ts$/i;

export class PathManager {
  private _opt: PathManagerOptions;
  private _absSrc: string;

  constructor(opt: PathManagerOptions) {
    this._opt = opt;
    this._absSrc = resolve(opt.sourceDir);
  }

  private getDestBase(path: string): string {
    const ext = D_TS_EXT.test(path) ? '.d.ts' : extname(path);
    const distext = ext === '.d.ts' ? '.ts' : ext;
    const base = basename(path, ext);
    return base + this._opt.postfix + distext;
  }

  public transformPath(src: string): string {
    const absSrc = resolve(src);
    const relSrc = relative(this._absSrc, absSrc);
    const relDir = dirname(relSrc);
    const destbase = this.getDestBase(src);
    return normalize(join(this._opt.hintsDir, relDir, destbase));
  }
}
