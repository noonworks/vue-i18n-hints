export interface HintCompilerOptions {
    sourceDir: string;
    outDir: string;
    postfix: string;
}
export declare class HintCompiler {
    private _opt;
    private _pmgr;
    constructor(opt?: Partial<HintCompilerOptions>);
    compile(files: string[]): void;
    private save;
}
