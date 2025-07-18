import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const mockUnobserve = jest.fn();

beforeAll(() => {
  global.IntersectionObserver = mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: mockUnobserve,
    callback,
  }));
});

describe('useIntersectionObserver', () => {
  const mockCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver.mockClear();
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    mockUnobserve.mockClear();
    mockCallback.mockClear();
  });

  it('should return a ref object', () => {
    const { result } = renderHook(() => 
      useIntersectionObserver(mockCallback)
    );

    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it('should create IntersectionObserver with default options', () => {
    renderHook(() => useIntersectionObserver(mockCallback));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px',
      }
    );
  });

  it('should create IntersectionObserver with custom options', () => {
    const customOptions = {
      threshold: 0.5,
      rootMargin: '10px',
    };

    renderHook(() => 
      useIntersectionObserver(mockCallback, customOptions)
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      customOptions
    );
  });

  it('should not create observer when enabled is false', () => {
    renderHook(() => 
      useIntersectionObserver(mockCallback, { enabled: false })
    );

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });

  it('should disconnect observer on unmount', () => {
    const { unmount } = renderHook(() => 
      useIntersectionObserver(mockCallback)
    );

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should call callback when intersection occurs', () => {
    let observerCallback: (entries: IntersectionObserverEntry[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      };
    });

    renderHook(() => useIntersectionObserver(mockCallback));

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      target: {} as Element,
    } as IntersectionObserverEntry;

    observerCallback!([mockEntry]);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback when not intersecting', () => {
    let observerCallback: (entries: IntersectionObserverEntry[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      };
    });

    renderHook(() => useIntersectionObserver(mockCallback));

    // Simulate no intersection
    const mockEntry = {
      isIntersecting: false,
      target: {} as Element,
    } as IntersectionObserverEntry;

    observerCallback!([mockEntry]);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not call callback when disabled', () => {
    let observerCallback: (entries: IntersectionObserverEntry[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      };
    });

    renderHook(() => 
      useIntersectionObserver(mockCallback, { enabled: false })
    );

    // This shouldn't be called since enabled is false, but let's test the behavior
    if (observerCallback!) {
      const mockEntry = {
        isIntersecting: true,
        target: {} as Element,
      } as IntersectionObserverEntry;

      observerCallback([mockEntry]);
    }

    expect(mockCallback).not.toHaveBeenCalled();
  });
}); 