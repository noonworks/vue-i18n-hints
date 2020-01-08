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

  test('transform nested interface', () => {
    const trfmr = new ASTTransformer({
      files: [
        {
          source: 'example/nest.d.ts',
          dest: 'lang/hints/nestHints.ts'
        }
      ]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].path).toEqual('lang/hints/nestHints.ts');
    expect(result[0].source).toEqual(
      `export const NestHints = {
    elem1: "elem1",
    elem2: "elem2",
    nested: {
        elem3: "nested.elem3",
        nested2: {
            elem4: "nested.nested2.elem4"
        },
        elem5: "nested.elem5"
    },
    elem6: "elem6"
};
`
    );
  });

  test('transform interface with string[]', () => {
    const trfmr = new ASTTransformer({
      files: [
        {
          source: 'example/stringArr.d.ts',
          dest: 'lang/hints/stringArrHints.ts'
        }
      ]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].path).toEqual('lang/hints/stringArrHints.ts');
    expect(result[0].source).toEqual(
      `export const StringArrHints = {
    elem1: "elem1",
    elem2: [
        "elem2[0]",
        "elem2[1]",
        "elem2[2]",
        "elem2[3]",
        "elem2[4]"
    ]
};
`
    );
  });

  test('transform interface with Array<string>', () => {
    const trfmr = new ASTTransformer({
      files: [
        {
          source: 'example/stringArr2.d.ts',
          dest: 'lang/hints/stringArr2Hints.ts'
        }
      ]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].path).toEqual('lang/hints/stringArr2Hints.ts');
    expect(result[0].source).toEqual(
      `export const StringArr2Hints = {
    elem1: "elem1",
    elem2: [
        "elem2[0]",
        "elem2[1]",
        "elem2[2]",
        "elem2[3]",
        "elem2[4]"
    ]
};
`
    );
  });

  test('transform interface with object array', () => {
    const trfmr = new ASTTransformer({
      files: [
        {
          source: 'example/ObjectArr.d.ts',
          dest: 'lang/hints/ObjectArrHints.ts'
        }
      ]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].path).toEqual('lang/hints/ObjectArrHints.ts');
    expect(result[0].source).toEqual(
      `export const ObjectArrHints = {
    elem1: "elem1",
    elem2: [
        {
            elem3: "elem2[0].elem3",
            elem4: "elem2[0].elem4"
        },
        {
            elem3: "elem2[1].elem3",
            elem4: "elem2[1].elem4"
        },
        {
            elem3: "elem2[2].elem3",
            elem4: "elem2[2].elem4"
        }
    ]
};
`
    );
  });

  test('transform interface with object array', () => {
    const trfmr = new ASTTransformer({
      files: [
        {
          source: 'example/ObjectArr2.d.ts',
          dest: 'lang/hints/ObjectArr2Hints.ts'
        }
      ]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].path).toEqual('lang/hints/ObjectArr2Hints.ts');
    expect(result[0].source).toEqual(
      `export const ObjectArr2Hints = {
    elem1: "elem1",
    elem2: [
        {
            elem3: "elem2[0].elem3",
            elem4: "elem2[0].elem4"
        },
        {
            elem3: "elem2[1].elem3",
            elem4: "elem2[1].elem4"
        },
        {
            elem3: "elem2[2].elem3",
            elem4: "elem2[2].elem4"
        }
    ]
};
`
    );
  });
});
