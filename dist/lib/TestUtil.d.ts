export declare function unlink(paths: string[]): boolean;
export declare const enum ExistsResult {
    AllExists = 0,
    AllNothing = 1,
    PartialExists = 2
}
export declare function exists(paths: string[]): ExistsResult;
export declare function read(path: string): string | null;
