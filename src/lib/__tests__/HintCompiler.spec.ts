import { HintCompiler } from '../HintCompiler';
import * as pt from 'path';

describe('HintCompiler', () => {
  test('transform path', () => {
    const compiler = new HintCompiler();
    {
      const path = 'example/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('example', 'simpleHints.ts'));
    }
    {
      const path = 'example/simple.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('example', 'simpleHints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('example', 'dir', 'simpleHints.ts'));
    }
  });

  test('transform path with postfix', () => {
    const compiler = new HintCompiler({
      postfix: 'hints'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('example', 'simplehints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('example', 'dir', 'simplehints.ts'));
    }
  });

  test('transform path to hintsDir', () => {
    const compiler = new HintCompiler({
      hintsDir: 'lang'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('lang', 'example', 'simpleHints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('lang', 'example', 'dir', 'simpleHints.ts'));
    }
  });

  test('transform path in rootDir', () => {
    const compiler = new HintCompiler({
      rootDir: 'example'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('simpleHints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('dir', 'simpleHints.ts'));
    }
  });

  test('transform path out of rootDir', () => {
    const compiler = new HintCompiler({
      hintsDir: 'lang',
      rootDir: 'example'
    });
    {
      const path = 'dummy/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('lang', 'dummy', 'simpleHints.ts'));
    }
    {
      const path = './example/simple.d.ts';
      const dist = compiler.transformPath(path);
      expect(dist).toBe(pt.join('lang', 'simpleHints.ts'));
    }
  });
});
