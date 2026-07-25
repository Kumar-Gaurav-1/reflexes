import { describe, it } from 'node:test';
import assert from 'node:assert';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges basic classes', () => {
    assert.strictEqual(cn('px-2', 'py-1'), 'px-2 py-1');
  });

  it('handles conditional classes (clsx)', () => {
    assert.strictEqual(cn('px-2', { 'py-1': true, 'bg-red-500': false }), 'px-2 py-1');
  });

  it('merges tailwind classes (twMerge)', () => {
    // p-3 overrides px-2 py-1
    assert.strictEqual(cn('px-2 py-1 bg-red-500', 'p-3 bg-[#B91C1C]'), 'p-3 bg-[#B91C1C]');
  });

  it('handles arrays of classes', () => {
    // mt-4 overrides mt-2
    assert.strictEqual(cn(['mt-2', 'mb-1'], ['bg-red-500', 'mt-4']), 'mb-1 bg-red-500 mt-4');
  });

  it('handles empty and undefined inputs safely', () => {
    assert.strictEqual(cn('', undefined, null, false, 'px-2'), 'px-2');
  });
});
