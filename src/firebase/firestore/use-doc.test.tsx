import { renderHook, waitFor } from '@testing-library/react';
import { useDoc } from './use-doc';
import { errorEmitter } from '../error-emitter';
import { onSnapshot, DocumentReference } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  onSnapshot: jest.fn(),
}));

describe('useDoc', () => {
  const mockUnsubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (onSnapshot as jest.Mock).mockImplementation(() => mockUnsubscribe);
  });

  it('handles null reference', () => {
    const { result } = renderHook(() => useDoc(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it('handles snapshot with existing data', async () => {
    const mockData = { name: 'Test Doc' };
    const mockRef = { path: 'test/doc' } as DocumentReference;

    (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
      // Synchronously call the callback to simulate snapshot received
      onNext({
        exists: () => true,
        data: () => mockData,
        id: 'doc-123'
      });
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useDoc(mockRef));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ ...mockData, id: 'doc-123' });
    expect(result.current.error).toBeNull();
    expect(onSnapshot).toHaveBeenCalledWith(mockRef, expect.any(Function), expect.any(Function));
  });

  it('handles snapshot with no data', async () => {
    const mockRef = { path: 'test/doc' } as DocumentReference;

    (onSnapshot as jest.Mock).mockImplementation((ref, onNext) => {
      onNext({
        exists: () => false,
      });
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useDoc(mockRef));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('handles error in onSnapshot and emits permission error', async () => {
    const mockRef = { path: 'test/doc' } as DocumentReference;
    const mockError = new Error('Permission denied');

    // Spy on errorEmitter
    const emitSpy = jest.spyOn(errorEmitter, 'emit');

    (onSnapshot as jest.Mock).mockImplementation((ref, onNext, onError) => {
      // Using setTimeout to simulate async error
      setTimeout(() => {
        onError(mockError);
      }, 0);
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useDoc(mockRef));

    // Initially loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(emitSpy).toHaveBeenCalledWith('permission-error', expect.objectContaining({
      name: 'FirestorePermissionError',
      context: {
        path: 'test/doc',
        operation: 'get'
      }
    }));

    emitSpy.mockRestore();
  });

  it('unsubscribes on unmount', () => {
    const mockRef = { path: 'test/doc' } as DocumentReference;

    const { unmount } = renderHook(() => useDoc(mockRef));

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
