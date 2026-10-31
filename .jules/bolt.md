## 2024-10-31 - Optimize Canvas Pixel Access in requestAnimationFrame
**Learning:** Nested loops processing 1D arrays of 2D data (like canvas images) suffer poor CPU cache locality if iterated column-first. Branching inside hot inner loops (bounds checking) kills performance.
**Action:** Pre-calculate and clamp bounds using Math.max/Math.min outside loops. Iterate Y (rows) then X (cols) to match memory layout. Hoist row-invariant calculations (like y * width) to the outer loop.
