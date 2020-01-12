import { posix } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

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
    this._absSrc = posix.resolve(opt.sourceDir);
  }

  private getBase(path: string): { base: string; ext: string } {
    const ext = D_TS_EXT.test(path) ? '.d.ts' : posix.extname(path);
    return { base: posix.basename(path, ext), ext };
  }

  private getDestFilename(path: string): string {
    const base = this.getBase(path);
    const distext = base.ext === '.d.ts' ? '.ts' : base.ext;
    return base.base + this._opt.postfix + distext;
  }

  public dest(src: string): string {
    const absSrc = posix.resolve(src);
    const relSrc = posix.relative(this._absSrc, absSrc);
    const relDir = posix.dirname(relSrc);
    const destbase = this.getDestFilename(src);
    return posix.normalize(posix.join(this._opt.hintsDir, relDir, destbase));
  }

  public importPath(path: string): string {
    const destdir = posix.dirname(this.dest(path));
    const impdir = posix.relative(destdir, posix.dirname(path));
    const imp = posix.join(impdir, this.getBase(path).base);
    return posix.normalize(imp);
  }

  public inDir(dir: string, file: string): boolean {
    const absDir = posix.resolve(dir);
    const absFile = posix.resolve(file);
    return absFile.indexOf(absDir) === 0;
  }

  public save(path: string, source: string): Error | null {
    const dir = posix.dirname(path);
    try {
      mkdirSync(dir, { recursive: true });
      writeFileSync(path, source);
      return null;
    } catch (error) {
      return error;
    }
  }
}
