import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { cn } from './utils';

describe('cn utility', () => {
  test('merges basic classes', () => {
    assert.equal(cn('foo', 'bar'), 'foo bar');
  });

  test('merges tailwind classes and resolves conflicts', () => {
    assert.equal(cn('p-4 text-red-500', 'p-2 text-blue-500'), 'p-2 text-blue-500');
  });

  test('handles objects and conditional classes', () => {
    assert.equal(cn('foo', { 'bar': true, 'baz': false }), 'foo bar');
  });

  test('handles arrays', () => {
    assert.equal(cn(['foo', 'bar'], 'baz'), 'foo bar baz');
  });

  test('handles undefined, null, and false', () => {
    assert.equal(cn('foo', undefined, null, false, 'bar'), 'foo bar');
  });
});
