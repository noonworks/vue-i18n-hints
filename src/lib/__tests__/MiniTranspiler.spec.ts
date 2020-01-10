import { MiniTranspiler } from '../MiniTranspiler';

describe('MiniTranspiler', () => {
  test('create js file', () => {
    const compiler = new MiniTranspiler();
    const result = compiler.compile(['lang/src/en-US.ts']);
    expect(result).toBeTruthy();
  });

  test('does not create js file if source has error', () => {
    const compiler = new MiniTranspiler();
    const result = compiler.compile(['lang/src/invalid.ts']);
    expect(result).toBeFalsy();
  });

  test('create js file with import', () => {
    const compiler = new MiniTranspiler();
    const result = compiler.compile(['lang/src/ja-JP.ts']);
    expect(result).toBeTruthy();
  });
});
