## 2026-08-10 - AR Tracking Loop Overhead
**Learning:** Found a major bottleneck in the AR motion detection loop within a `requestAnimationFrame` handler. Object/array allocations (`[{x, y}, ...]`) and `.forEach` on every frame trigger excessive GC pressure, causing micro-stutters.
**Action:** Unroll fixed-length arrays and pre-calculate linear offset indices (e.g., `(y * width + x) * 4`) when dealing with Canvas `ImageData` in high-frequency render loops.

## 2026-08-10 - 2D Array Cache Locality
**Learning:** Inner loop bounds checking (`if (x < 0) continue`) inside a hot 2D loop processing a 1D pixel array is extremely slow due to branch prediction failures. Additionally, iterating `x` on the outer loop and `y` on the inner loop causes strided memory access.
**Action:** Always pre-calculate bounding boxes outside the nested loops using `Math.max`/`Math.min`. Always order nested image processing loops with `y` (rows) on the outside and `x` (columns) on the inside to ensure contiguous memory reads and maximize CPU cache hits.
