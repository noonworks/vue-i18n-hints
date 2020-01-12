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
export declare class HintCompiler {
    private _opt;
    private _pmgr;
    constructor(opt?: Partial<HintCompilerOptions>);
    compile(files: string[]): Result;
}
export {};
