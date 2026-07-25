import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './utils';

describe('cn utility', () => {
  test('merges basic classes', () => {
    assert.equal(cn('foo', 'bar'), 'foo bar');
  });

  test('merges tailwind classes and resolves conflicts', () => {
    assert.equal(cn('text-red-500', 'text-blue-500'), 'text-blue-500');
    assert.equal(cn('px-2 py-1', 'p-4'), 'p-4');
  });

  test('handles conditional classes (objects)', () => {
    assert.equal(cn('foo', { bar: true, baz: false }), 'foo bar');
  });

  test('handles conditional classes (arrays)', () => {
    assert.equal(cn('foo', ['bar', 'baz']), 'foo bar baz');
  });

  test('ignores falsy values', () => {
    assert.equal(cn('foo', null, undefined, false, 0, '', 'bar'), 'foo bar');
  });
});
