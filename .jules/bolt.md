## 2024-10-14 - Precompute loop boundaries in high-frequency loops
**Learning:** In high-frequency rendering loops like `requestAnimationFrame` for AR hand tracking, recalculating and clamping loop boundaries per iteration with if/continue branching introduces significant CPU overhead (e.g., ~10x slower locally).
**Action:** Always precalculate and clamp boundaries (using `Math.max` and `Math.min`) strictly outside the nested processing loops to eliminate expensive per-pixel conditional evaluations.
