interface PathManagerOptions {
    sourceDir: string;
    hintsDir: string;
    postfix: string;
}
export declare class PathManager {
    private _opt;
    private _absSrc;
    constructor(opt: PathManagerOptions);
    private getBase;
    private getDestFilename;
    dest(src: string): string;
    importPath(path: string): string;
    inDir(dir: string, file: string): boolean;
    save(path: string, source: string): Error | null;
}
export {};
