## 2024-10-03 - Pre-calculate loop boundaries for requestAnimationFrame loops

**Learning:** In high-frequency rendering loops, specifically those running per-frame in `requestAnimationFrame` involving multi-dimensional nested loops for pixel processing, checking boundary conditions (e.g., `x < 0 || x >= width || y < 0 || y >= height`) *inside* the innermost loop adds unnecessary conditional branch evaluations for every single pixel iteration. This is a common performance bottleneck in kinetic/AR motion detection features.

**Action:** Pre-calculate and clamp the loop start and end boundaries outside the nested loops using `Math.max` and `Math.min`. This ensures the loop inherently stays within bounds, eliminating the need for internal conditional skipping (`continue`), which removes branching overhead and achieves much more consistent per-frame execution times.
