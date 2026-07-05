## 2025-07-05 - Replace React State animation with CSS Transitions
**Learning:** Animating visual properties (like target scaling and depth in AR views) via high-frequency React state updates (e.g., `setInterval` running every 30ms) triggers excessive component tree re-renders and degrades CPU performance and frame rates.
**Action:** Use CSS transitions (`transition-all` or specific `transitionDuration`) combined with single state updates instead of multi-step React state animations to leverage hardware acceleration and keep the main thread unblocked.
