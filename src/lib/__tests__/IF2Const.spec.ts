import { IF2ConstFactory } from '../IF2Const';
import { MockTransformer, Factory } from '../MockTransformer';

const factory: Factory = src => {
  return IF2ConstFactory(src.fileName);
};

describe('IF2Const', () => {
  test('transform simple interface', () => {
    const trfmr = new MockTransformer({
      files: ['example/simple.d.ts'],
      transformers: [],
      transformerFactories: [factory]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].source).toEqual(
      `import { Simple } from "example/simple.d.ts";
export const SimpleHints: Simple = {
    elem1: "elem1",
    elem2: "elem2"
};
`
    );
  });

  test('transform nested interface', () => {
    const trfmr = new MockTransformer({
      files: ['example/nest.d.ts'],
      transformers: [],
      transformerFactories: [factory]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].source).toEqual(
      `import { Nest } from "example/nest.d.ts";
export const NestHints: Nest = {
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
    const trfmr = new MockTransformer({
      files: ['example/stringArr.d.ts'],
      transformers: [],
      transformerFactories: [factory]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].source).toEqual(
      `import { StringArr } from "example/stringArr.d.ts";
export const StringArrHints: StringArr = {
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
    const trfmr = new MockTransformer({
      files: ['example/stringArr2.d.ts'],
      transformers: [],
      transformerFactories: [factory]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].source).toEqual(
      `import { StringArr2 } from "example/stringArr2.d.ts";
export const StringArr2Hints: StringArr2 = {
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
    const trfmr = new MockTransformer({
      files: ['example/ObjectArr.d.ts'],
      transformers: [],
      transformerFactories: [factory]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].source).toEqual(
      `import { ObjectArr } from "example/ObjectArr.d.ts";
export const ObjectArrHints: ObjectArr = {
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
    const trfmr = new MockTransformer({
      files: ['example/ObjectArr2.d.ts'],
      transformers: [],
      transformerFactories: [factory]
    });
    const result = trfmr.compile();
    expect(result.length).toBe(1);
    expect(result[0].source).toEqual(
      `import { ObjectArr2 } from "example/ObjectArr2.d.ts";
export const ObjectArr2Hints: ObjectArr2 = {
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
