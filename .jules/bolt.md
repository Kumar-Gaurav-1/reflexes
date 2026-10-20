## 2024-10-24 - [Optimized requestAnimationFrame Loop in AR Drill View]
**Learning:** When processing 1D canvas image data arrays representing 2D space inside a requestAnimationFrame loop, nested loops iterating columns (x) then rows (y) with per-pixel boundary checks cause significant CPU overhead and cache misses.
**Action:** Optimize nested loops by iterating y (rows) first, then x (columns) to match row-major memory layout. Pre-calculate and clamp loop boundaries outside the nested loops, and hoist row-invariant calculations (like y * width) out of the inner loop to minimize computation.
