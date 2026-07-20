## 2026-07-20 - [Optimize AR rendering loop]
**Learning:** For high-performance AR/Canvas rendering loops (e.g., requestAnimationFrame), dynamic array allocations and out-of-bounds checks evaluated on every iteration can severely impact frame rate.
**Action:** Extract arrays into module-level typed constants (like Int32Array) and clamp array bounds mathematically before entering nested pixel loops to improve processing speed.
