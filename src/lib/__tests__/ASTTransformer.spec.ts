import { ASTTransformer } from '../ASTTransformer';

describe('ASTTransformer', () => {
  test('transform simple interface', () => {
    const trfmr = new ASTTransformer({
      files: [
        {
          source: 'example/simple.d.ts',
          dest: 'lang/hints/simpleHints.ts'
        }
      ]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].path).toEqual('lang/hints/simpleHints.ts');
    expect(result[0].source).toEqual(
      `export const SimpleHints = {
    elem1: "elem1",
    elem2: "elem2"
};
`
    );
  });
});
