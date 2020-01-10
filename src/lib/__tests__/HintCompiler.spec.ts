import { HintCompiler } from '../HintCompiler';
import { unlink, exists, ExistsResult, read } from '../TestUtil';

describe('HintCompiler', () => {
  test('create hint file', () => {
    const src = 'lang/src/i18n.d.ts';
    const dest = 'lang/build/i18nHints.ts';
    unlink([dest]);
    expect(exists([dest])).toBe(ExistsResult.AllNothing);
    const compiler = new HintCompiler();
    compiler.compile([src]);
    const exs = exists([dest]);
    expect(exs).toBe(ExistsResult.AllExists);
    if (exs != ExistsResult.AllExists) return;
    const content = read(dest);
    expect(content).toEqual(`import { I18n } from "../src/i18n";
export const I18nHints: I18n = {
    elem1: "elem1",
    elem2: "elem2",
    nested: {
        elem3: "nested.elem3",
        elem4: "nested.elem4"
    }
};
`);
  });
});
