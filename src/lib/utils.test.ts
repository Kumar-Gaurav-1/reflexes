import test from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './utils';

test('cn utility function', async (t) => {
  await t.test('merges standard class names', () => {
    assert.equal(cn('class1', 'class2'), 'class1 class2');
  });

  await t.test('handles conditional class names', () => {
    assert.equal(cn('class1', true && 'class2', false && 'class3'), 'class1 class2');
  });

  await t.test('resolves conflicting tailwind classes', () => {
    // twMerge behavior: later class overrides earlier conflicting class
    assert.equal(cn('p-2', 'p-4'), 'p-4');
    assert.equal(cn('text-red-500', 'text-blue-500'), 'text-blue-500');
    assert.equal(cn('bg-red-500', 'bg-blue-500'), 'bg-blue-500');
  });

  await t.test('handles arrays of classes', () => {
    assert.equal(cn(['class1', 'class2']), 'class1 class2');
    assert.equal(cn(['class1', 'class2'], 'class3'), 'class1 class2 class3');
  });

  await t.test('handles objects with boolean values', () => {
    assert.equal(cn({ 'class1': true, 'class2': false }), 'class1');
  });

  await t.test('handles empty inputs or undefined', () => {
    assert.equal(cn(), '');
    assert.equal(cn(undefined, null, false, ''), '');
  });
});
