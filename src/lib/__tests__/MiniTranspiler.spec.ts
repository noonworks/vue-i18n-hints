import { MiniTranspiler } from '../MiniTranspiler';
import { unlink, exists, ExistsResult } from '../TestUtil';

describe('MiniTranspiler', () => {
  test('create js file', () => {
    const src = 'lang/src/en-US.ts';
    const dest = 'lang/build/en-US.js';
    unlink([dest]);
    expect(exists([dest])).toBe(ExistsResult.AllNothing);
    const compiler = new MiniTranspiler();
    const result = compiler.compile([src]);
    expect(result).toBeTruthy();
    expect(exists([dest])).toBe(ExistsResult.AllExists);
  });

  test('does not create js file if source has error', () => {
    const src = 'lang/src/invalid.ts';
    const dest = 'lang/build/invalid.js';
    expect(unlink([dest])).toBeFalsy();
    expect(exists([dest])).toBe(ExistsResult.AllNothing);
    const compiler = new MiniTranspiler();
    const result = compiler.compile([src]);
    expect(result).toBeFalsy();
    expect(exists([dest])).toBe(ExistsResult.AllNothing);
  });

  test('create js file with import', () => {
    const src = 'lang/src/ja-JP.ts';
    const dests = ['lang/build/ja-JP.js', 'lang/build/subdir/ja-JP.js'];
    unlink(dests);
    expect(exists(dests)).toBe(ExistsResult.AllNothing);
    const compiler = new MiniTranspiler();
    const result = compiler.compile([src]);
    expect(result).toBeTruthy();
    expect(exists(dests)).toBe(ExistsResult.AllExists);
  });

  test('create js file from multi source', () => {
    const srcs = ['lang/src/ja-JP.ts', 'lang/src/en-US.ts'];
    const dests = [
      'lang/build/ja-JP.js',
      'lang/build/subdir/ja-JP.js',
      'lang/build/en-US.js'
    ];
    unlink(dests);
    expect(exists(dests)).toBe(ExistsResult.AllNothing);
    const compiler = new MiniTranspiler();
    const result = compiler.compile(srcs);
    expect(result).toBeTruthy();
    expect(exists(dests)).toBe(ExistsResult.AllExists);
  });
});
