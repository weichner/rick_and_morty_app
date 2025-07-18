"use client";

import { useEffect, useRef, useCallback } from 'react';

/**
 * Configuration options for the intersection observer
 */
interface UseIntersectionObserverOptions {
  /** Percentage of the target element that must be visible to trigger the callback (0.0 to 1.0) */
  threshold?: number;
  /** Margin around the root element - allows triggering before element is fully visible */
  rootMargin?: string;
  /** Whether the observer is currently active */
  enabled?: boolean;
}

/**
 * Custom hook that implements the Intersection Observer API for infinite scroll functionality
 * 
 * This hook is essential for performance-optimized infinite scrolling. Instead of listening
 * to scroll events (which can be expensive), it uses the browser's native Intersection Observer
 * to detect when a target element becomes visible in the viewport.
 * 
 * Key Benefits:
 * - Performance: Uses native browser API instead of scroll event listeners
 * - Precise: Can trigger before element is fully visible using rootMargin
 * - Flexible: Configurable threshold and margins
 * - Memory Safe: Properly cleans up observers on unmount
 * 
 * Common Use Cases:
 * - Infinite scroll pagination
 * - Lazy loading images
 * - Analytics tracking (viewport visibility)
 * - Progressive content loading
 * 
 * @param {() => void} callback - Function to call when target element intersects with viewport
 * @param {UseIntersectionObserverOptions} options - Configuration options for the observer
 * @returns {React.RefObject<HTMLDivElement>} Ref to attach to the target element
 * 
 */
export const useIntersectionObserver = (
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) => {
  // Extract options with sensible defaults
  const {
    threshold = 0.1,                    // Trigger when 10% of element is visible
    rootMargin = '0px 0px 100px 0px',   // Trigger 100px before element reaches viewport
    enabled = true,                     // Observer is active by default
  } = options;

  // Ref for the target element that will be observed
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Ref to store the observer instance for cleanup
  const observerRef = useRef<IntersectionObserver | null>(null);

  /**
   * Handles intersection events from the Intersection Observer
   * 
   * This callback is triggered whenever the target element's visibility changes.
   * It checks if the element is intersecting (visible) and if the observer is enabled
   * before calling the provided callback function.
   * 
   * @param {IntersectionObserverEntry[]} entries - Array of intersection entries
   */
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries; // We only observe one element
      
      // Only trigger callback if element is intersecting and observer is enabled
      if (entry.isIntersecting && enabled) {
        callback();
      }
    },
    [callback, enabled] // Re-create when callback or enabled state changes
  );

  /**
   * Effect: Set up and manage the Intersection Observer
   * 
   * This effect handles:
   * 1. Creating a new observer with current options
   * 2. Observing the target element
   * 3. Cleaning up previous observers
   * 4. Handling option changes
   */
  useEffect(() => {
    // Don't create observer if disabled
    if (!enabled) return;

    // Clean up existing observer before creating new one
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer with current options
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,   // When to trigger (percentage of visibility)
      rootMargin,  // Margin around the root viewport
    });

    // Start observing the target element if it exists
    const currentTarget = targetRef.current;
    if (currentTarget) {
      observerRef.current.observe(currentTarget);
    }

    // Cleanup function: disconnect observer when effect re-runs or component unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  // Return the ref to attach to the target element
  return targetRef;
}; 