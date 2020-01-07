import { PathManager } from '../PathManager';
import * as pt from 'path';

describe('PathManager', () => {
  test('transform path', () => {
    const mgr = new PathManager();
    {
      const path = 'example/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('example', 'simpleHints.ts'));
    }
    {
      const path = 'example/simple.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('example', 'simpleHints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('example', 'dir', 'simpleHints.ts'));
    }
  });

  test('transform path with postfix', () => {
    const mgr = new PathManager({
      postfix: 'hints'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('example', 'simplehints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('example', 'dir', 'simplehints.ts'));
    }
  });

  test('transform path to hintsDir', () => {
    const mgr = new PathManager({
      hintsDir: 'lang'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('lang', 'example', 'simpleHints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('lang', 'example', 'dir', 'simpleHints.ts'));
    }
  });

  test('transform path in rootDir', () => {
    const mgr = new PathManager({
      rootDir: 'example'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('simpleHints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('dir', 'simpleHints.ts'));
    }
  });

  test('transform path out of rootDir', () => {
    const mgr = new PathManager({
      hintsDir: 'lang',
      rootDir: 'example'
    });
    {
      const path = 'dummy/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('lang', 'dummy', 'simpleHints.ts'));
    }
    {
      const path = './example/simple.d.ts';
      const dist = mgr.transformPath(path);
      expect(dist).toBe(pt.join('lang', 'simpleHints.ts'));
    }
  });
});
