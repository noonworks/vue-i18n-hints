import ts = require('typescript');
export interface MiniTranspilerOptions {
    sourceDir: string;
    outDir: string;
    compileOptions: ts.CompilerOptions;
}
export declare const DEFAULT_COMPILER_OPTIONS: {
    target: ts.ScriptTarget;
    module: ts.ModuleKind;
    moduleResolution: ts.ModuleResolutionKind;
    declaration: boolean;
    sourceMap: boolean;
    noEmit: boolean;
    noEmitOnError: boolean;
    allowJs: boolean;
    newLine: ts.NewLineKind;
    skipLibCheck: boolean;
};
export declare class MiniTranspiler {
    private _opt;
    constructor(opt?: Partial<MiniTranspilerOptions>);
    compile(files: string[]): boolean;
}
