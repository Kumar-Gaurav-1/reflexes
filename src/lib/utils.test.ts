import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { cn } from './utils';

describe('cn utility', () => {
  test('merges basic classes', () => {
    assert.strictEqual(cn('px-2 py-1', 'bg-red-500'), 'px-2 py-1 bg-red-500');
  });

  test('handles conditional classes', () => {
    assert.strictEqual(cn('px-2', true && 'py-1', false && 'bg-red-500'), 'px-2 py-1');
  });

  test('resolves tailwind conflicts', () => {
    assert.strictEqual(cn('p-4', 'p-8'), 'p-8');
    assert.strictEqual(cn('text-red-500', 'text-blue-500'), 'text-blue-500');
    assert.strictEqual(cn('px-2 py-1', 'p-4'), 'p-4');
  });

  test('supports arrays and objects', () => {
    assert.strictEqual(cn(['px-2', 'py-1'], { 'bg-red-500': true, 'text-white': false }), 'px-2 py-1 bg-red-500');
  });

  test('handles undefined, null, and empty string', () => {
    assert.strictEqual(cn('px-2', undefined, null, '', 'py-1'), 'px-2 py-1');
  });
});
