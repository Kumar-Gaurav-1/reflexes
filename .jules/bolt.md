
## 2026-11-03 - Optimize AR Frame Loop (Row-Major & Unrolling)
**Learning:** Iterating canvas image data in column-major order and using array allocations like .forEach in requestAnimationFrame loops degrades performance due to cache misses and GC stutters.
**Action:** For canvas/image processing, iterate rows (Y) then columns (X) to align with memory layout, hoist calculations, clamp boundaries outside, and avoid array iteration methods in hot render loops.
