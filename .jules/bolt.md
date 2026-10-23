## 2024-05-20 - [Performance Optimization Canvas Loop]
**Learning:** Nested loops processing canvas pixels can cause performance issues if not optimized, especially with high-frequency calls like `requestAnimationFrame`. Bounds checking inside the inner loop is expensive.
**Action:** Pre-calculate and clamp the loop bounds using `Math.max` and `Math.min` outside the loop, and move repetitive calculations out of the inner loop to improve cache hits and minimize branching.
