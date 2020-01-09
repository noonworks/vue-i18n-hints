import { PathManager } from '../PathManager';
import { posix } from 'path';

describe('PathManager', () => {
  test('transform path', () => {
    const mgr = new PathManager({
      sourceDir: '',
      hintsDir: '',
      postfix: 'Hints'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('example', 'simpleHints.ts'));
    }
    {
      const path = 'example/simple.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('example', 'simpleHints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('example', 'dir', 'simpleHints.ts'));
    }
  });

  test('transform path with postfix', () => {
    const mgr = new PathManager({
      sourceDir: '',
      hintsDir: '',
      postfix: 'hints'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('example', 'simplehints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('example', 'dir', 'simplehints.ts'));
    }
  });

  test('transform path to hintsDir', () => {
    const mgr = new PathManager({
      sourceDir: '',
      hintsDir: 'lang',
      postfix: 'Hints'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('lang', 'example', 'simpleHints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('lang', 'example', 'dir', 'simpleHints.ts'));
    }
  });

  test('transform path in rootDir', () => {
    const mgr = new PathManager({
      sourceDir: 'example',
      hintsDir: '',
      postfix: 'Hints'
    });
    {
      const path = 'example/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('simpleHints.ts'));
    }
    {
      const path = 'example/dir/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('dir', 'simpleHints.ts'));
    }
  });

  test('transform path out of rootDir', () => {
    const mgr = new PathManager({
      sourceDir: 'example',
      hintsDir: 'lang',
      postfix: 'Hints'
    });
    {
      const path = 'dummy/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('dummy', 'simpleHints.ts'));
    }
    {
      const path = './example/simple.d.ts';
      const dist = mgr.dest(path);
      expect(dist).toBe(posix.join('lang', 'simpleHints.ts'));
    }
  });
});
