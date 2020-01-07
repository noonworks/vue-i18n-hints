import { ASTTransformer } from '../ASTTransformer';

describe('ASTTransformer', () => {
  test('transform simple interface', () => {
    const trfmr = new ASTTransformer({
      files: [
        {
          source: 'example/simple.d.ts',
          dest: 'simpleHints.ts'
        }
      ]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].path).toBe('simpleHints.ts');
  });
});
