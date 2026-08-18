## 2023-10-27 - Optimize AR Drill Motion Detection Loop
**Learning:** In high-frequency `requestAnimationFrame` loops for AR rendering, allocating objects like `[{x, y}]` and using `.forEach()` causes GC micro-stutters. Additionally, iterating image data arrays with `x` as outer loop and `y` as inner loop causes poor cache locality (non-contiguous memory access).
**Action:** Unroll static arrays, use direct variable assignments, and structure nested loops with `y` (rows) as the outer loop and `x` (columns) as the inner loop to ensure row-major memory access.
