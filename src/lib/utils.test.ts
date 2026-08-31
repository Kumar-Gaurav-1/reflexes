import { describe, it } from 'node:test';
import assert from 'node:assert';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge simple classes', () => {
    assert.strictEqual(cn('a', 'b', 'c'), 'a b c');
  });

  it('should override classes with tailwind-merge', () => {
    assert.strictEqual(cn('p-4 text-red-500', 'p-8 text-blue-500'), 'p-8 text-blue-500');
    assert.strictEqual(cn('px-2 py-1 bg-red-500', 'p-3 bg-[#B91C1C]'), 'p-3 bg-[#B91C1C]');
  });

  it('should handle conditional classes using clsx', () => {
    assert.strictEqual(cn('a', true && 'b', false && 'c'), 'a b');
    assert.strictEqual(cn({ 'a': true, 'b': false, 'c': true }), 'a c');
  });

  it('should handle arrays and nested arrays', () => {
    assert.strictEqual(cn(['a', 'b'], ['c', 'd']), 'a b c d');
    assert.strictEqual(cn(['a', ['b', 'c']], 'd'), 'a b c d');
  });

  it('should ignore null, undefined, and false values', () => {
    assert.strictEqual(cn('a', null, 'b', undefined, 'c', false, 'd'), 'a b c d');
  });

  it('should properly merge complex real-world examples', () => {
    const isHovered = true;
    const isFocused = false;
    const isError = true;

    assert.strictEqual(
      cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        {
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': isError,
          'hover:bg-accent hover:text-accent-foreground': isHovered && !isError,
          'ring-2 ring-offset-2 ring-blue-500': isFocused
        },
        'h-9 px-4 py-2' // overriding the base padding
      ),
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-4 py-2'
    );
  });
});
