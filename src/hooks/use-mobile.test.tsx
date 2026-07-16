import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useIsMobile } from './use-mobile'

const MOBILE_BREAKPOINT = 768

describe('useIsMobile', () => {
  beforeEach(() => {
    // Default to desktop size
    vi.stubGlobal('innerWidth', 1024)

    // Mock matchMedia
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('should return false initially on desktop', () => {
    vi.stubGlobal('innerWidth', 1024)
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('should return true initially on mobile', () => {
    vi.stubGlobal('innerWidth', 375)
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('should update value when window resizes', () => {
    // We need to capture the event listener to call it manually
    let changeListener: (() => void) | undefined

    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event, callback) => {
        if (event === 'change') {
          changeListener = callback
        }
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))

    // Start as desktop
    vi.stubGlobal('innerWidth', 1024)
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    // Simulate resize to mobile
    act(() => {
      vi.stubGlobal('innerWidth', 375)
      if (changeListener) {
        changeListener()
      }
    })

    expect(result.current).toBe(true)

    // Simulate resize back to desktop
    act(() => {
      vi.stubGlobal('innerWidth', 1024)
      if (changeListener) {
        changeListener()
      }
    })

    expect(result.current).toBe(false)
  })

  it('should remove event listener on unmount', () => {
    const removeEventListenerMock = vi.fn()

    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    })))

    const { unmount } = renderHook(() => useIsMobile())

    unmount()

    expect(removeEventListenerMock).toHaveBeenCalledTimes(1)
    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
