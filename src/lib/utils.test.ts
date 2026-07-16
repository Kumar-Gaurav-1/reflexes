import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge basic string classes', () => {
    assert.strictEqual(cn('class1', 'class2'), 'class1 class2');
  });

  it('should handle array inputs', () => {
    assert.strictEqual(cn(['class1', 'class2']), 'class1 class2');
  });

  it('should handle conditional classes using objects', () => {
    assert.strictEqual(cn({ 'class1': true, 'class2': false, 'class3': true }), 'class1 class3');
  });

  it('should handle undefined and null inputs gracefully', () => {
    assert.strictEqual(cn('class1', undefined, null, 'class2'), 'class1 class2');
  });

  it('should override Tailwind CSS conflicts correctly', () => {
    // twMerge logic should remove bg-red-500 because bg-blue-500 comes after it
    assert.strictEqual(cn('p-4 bg-red-500', 'bg-blue-500 text-white'), 'p-4 bg-blue-500 text-white');
  });

  it('should combine complex nested inputs', () => {
    assert.strictEqual(
      cn('base-class', ['arr-class', { 'obj-true': true, 'obj-false': false }], undefined, 'end-class'),
      'base-class arr-class obj-true end-class'
    );
  });
});
