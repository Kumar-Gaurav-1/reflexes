## 2025-02-12 - [React Render Optimization]
**Learning:** React state updates inside intervals (e.g., `setInterval` to drive animations) trigger excessive re-renders, stalling the main thread which is critical for other logic like `requestAnimationFrame` canvas loops.
**Action:** When animating elements programmatically, offload the work to CSS (`@keyframes` and transitions) and use a single timeout to coordinate lifecycle events instead of manually updating React state frames.
