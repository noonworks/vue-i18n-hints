import * as pt from 'path';

interface PathManagerOptions {
  curDir?: string;
  hintsDir?: string;
  rootDir?: string;
  postfix?: string;
}

const D_TS_EXT = /\.d\.ts$/i;

export class PathManager {
  private _curDir: string;
  private _hintsDir: string;
  private _rootDir: string;
  private _postfix: string;

  constructor(opt?: PathManagerOptions) {
    opt = opt || {};
    this._curDir = opt.curDir || process.cwd();
    this._hintsDir = pt.resolve(opt.hintsDir || '.');
    this._rootDir = pt.resolve(opt.rootDir || '.');
    this._postfix = opt.postfix || 'Hints';
  }

  private getExt(path: string): string {
    if (D_TS_EXT.test(path)) return '.d.ts';
    return pt.extname(path);
  }

  public transformPath(path: string): string {
    const abs = pt.resolve(path);
    const ext = this.getExt(path);
    const base = pt.basename(path, ext);
    const distext = ext === '.d.ts' ? '.ts' : ext;
    const distname = base + this._postfix + distext;
    if (abs.startsWith(this._rootDir)) {
      const dir = pt.dirname(abs.replace(this._rootDir, ''));
      const out = pt.join(this._hintsDir, dir, distname);
      return pt.relative(this._curDir, out);
    }
    const dir = pt.dirname(path);
    const out = pt.join(this._hintsDir, dir, distname);
    return pt.relative(this._curDir, out);
  }
}
