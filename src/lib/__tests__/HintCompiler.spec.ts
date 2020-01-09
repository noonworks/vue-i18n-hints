import { HintCompiler } from '../HintCompiler';

describe('HintCompiler', () => {
  test('create hint file', () => {
    const compiler = new HintCompiler();
    compiler.compile(['lang/src/i18n.d.ts']);
  });
});
