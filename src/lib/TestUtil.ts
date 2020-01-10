import { unlinkSync, existsSync, readFileSync } from 'fs';

export function unlink(paths: string[]): boolean {
  try {
    paths.forEach(path => unlinkSync(path));
    return true;
  } catch (_) {
    return false;
  }
}

export const enum ExistsResult {
  AllExists,
  AllNothing,
  PartialExists
}

export function exists(paths: string[]): ExistsResult {
  const exs = paths.map(path => existsSync(path));
  const hasTrue = exs.indexOf(true) >= 0;
  const hasFalse = exs.indexOf(false) >= 0;
  if (hasTrue && hasFalse) return ExistsResult.PartialExists;
  if (hasTrue) return ExistsResult.AllExists;
  return ExistsResult.AllNothing;
}

export function read(path: string): string | null {
  if (!existsSync(path)) return null;
  const content = readFileSync(path);
  return content.toString();
}
