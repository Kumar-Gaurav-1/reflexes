import { renderHook, act } from '@testing-library/react';
import { useCollection } from './use-collection';
import { onSnapshot } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('firebase/firestore', () => ({
  onSnapshot: vi.fn(),
}));

describe('useCollection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    errorEmitter.removeAllListeners();
  });

  it('handles null query', () => {
    const { result } = renderHook(() => useCollection(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it('sets loading state and calls onSnapshot with query', () => {
    const mockQuery = { _path: { toString: () => 'test-path' } } as any;
    const unsubscribe = vi.fn();
    vi.mocked(onSnapshot).mockReturnValue(unsubscribe);

    const { result } = renderHook(() => useCollection(mockQuery));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(onSnapshot).toHaveBeenCalledWith(
      mockQuery,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('updates data when snapshot is received', () => {
    const mockQuery = {} as any;
    const unsubscribe = vi.fn();

    // Capture the success callback
    let successCallback: any;
    vi.mocked(onSnapshot).mockImplementation((query, onNext, onError) => {
      successCallback = onNext;
      return unsubscribe;
    });

    const { result } = renderHook(() => useCollection(mockQuery));

    const mockDocs = [
      { id: '1', data: () => ({ name: 'Item 1' }) },
      { id: '2', data: () => ({ name: 'Item 2' }) },
    ];

    act(() => {
      successCallback({ docs: mockDocs });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ]);
  });

  it('handles error, sets state, and emits permission error event', async () => {
    const mockQuery = { _path: { toString: () => 'restricted-path' } } as any;
    const unsubscribe = vi.fn();

    let errorCallback: any;
    vi.mocked(onSnapshot).mockImplementation((query, onNext, onError) => {
      errorCallback = onError;
      return unsubscribe;
    });

    const emitSpy = vi.spyOn(errorEmitter, 'emit');

    const { result } = renderHook(() => useCollection(mockQuery));

    const mockError = new Error('Permission denied');

    await act(async () => {
      await errorCallback(mockError);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(emitSpy).toHaveBeenCalledWith('permission-error', expect.any(Error));

    const emittedError = emitSpy.mock.calls[0][1] as any;
    expect(emittedError.name).toBe('FirestorePermissionError');
    expect(emittedError.context.path).toBe('restricted-path');
  });

  it('unsubscribes on unmount', () => {
    const mockQuery = {} as any;
    const unsubscribe = vi.fn();
    vi.mocked(onSnapshot).mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useCollection(mockQuery));

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
