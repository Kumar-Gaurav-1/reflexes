## 2024-05-18 - Avoid array allocations and inner-loop bounds checks in requestAnimationFrame

**Learning:** In highly sensitive `requestAnimationFrame` loops doing pixel processing, creating objects inside the loop (e.g., `const cornerSamples = [{x: 5, y: 5}, ...]`) forces unnecessary garbage collection and repeated offset calculations. Also, executing conditional bounds checks (`if (x < 0 || x >= 160 || y < 0 || y >= 120)`) inside a double nested loop per target runs hundreds of times per frame, hurting performance, plus iterating `x` on outer loop and `y` on inner loop destroys cache locality.

**Action:** Precalculate static offset arrays outside the component (`new Int32Array`), calculate loop bounds beforehand using `Math.max` and `Math.min`, and structure nested loops with `y` (rows) as the outer loop and `x` (columns) as the inner loop to ensure row-major memory access.
