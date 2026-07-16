import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const MOBILE_BREAKPOINT = 768;

describe('useIsMobile', () => {
  // Store the original innerWidth
  const originalInnerWidth = window.innerWidth;

  // Create a mock for matchMedia
  let addEventListenerMock: any;
  let removeEventListenerMock: any;

  beforeEach(() => {
    addEventListenerMock = vi.fn();
    removeEventListenerMock = vi.fn();

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    // Restore original window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it('should return false initially when width is above breakpoint', () => {
    setWindowWidth(1024);
    const { result } = renderHook(() => useIsMobile());

    // In our implementation, `useIsMobile` initializes with undefined then updates via useEffect,
    // but React's renderHook with useEffect might run it immediately.
    // The implementation specifically returns `!!isMobile` and initially undefined which resolves to false.
    // Inside useEffect, it sets `isMobile` based on width.
    expect(result.current).toBe(false);
  });

  it('should return true when width is below breakpoint', () => {
    setWindowWidth(500);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should update when the window is resized to mobile', () => {
    setWindowWidth(1024);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate resize event callback
    act(() => {
      setWindowWidth(500);
      // Retrieve the registered onChange callback
      const onChangeCallback = addEventListenerMock.mock.calls[0][1];
      onChangeCallback();
    });

    expect(result.current).toBe(true);
  });

  it('should update when the window is resized to desktop', () => {
    setWindowWidth(500);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);

    // Simulate resize event callback
    act(() => {
      setWindowWidth(1024);
      // Retrieve the registered onChange callback
      const onChangeCallback = addEventListenerMock.mock.calls[0][1];
      onChangeCallback();
    });

    expect(result.current).toBe(false);
  });

  it('should cleanup event listener on unmount', () => {
    setWindowWidth(1024);
    const { unmount } = renderHook(() => useIsMobile());

    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
