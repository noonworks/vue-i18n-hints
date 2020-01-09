import * as ts from 'typescript';
export declare type HintTransformerFactory = (src: ts.SourceFile) => ts.TransformerFactory<ts.SourceFile>;
export interface HintTransformerOption {
    files: string[];
    tsconfig?: ts.CompilerOptions;
    transformers: ts.TransformerFactory<ts.SourceFile>[];
    transformerFactories: HintTransformerFactory[];
}
export interface HintTransformermResult {
    filename: string;
    source: string;
}
export declare class HintTransformer {
    private _opt;
    private _program;
    private _printer;
    constructor(opt: HintTransformerOption);
    compile(): HintTransformermResult[];
}
