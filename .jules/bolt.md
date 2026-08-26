## 2024-05-24 - Optimizing AR motion detection loop

**Learning:** Nested loops processing image pixel data suffer from severe cache locality issues if iterated column-major (`x` outer, `y` inner) instead of row-major (`y` outer, `x` inner). Additionally, conditional bounds checking (`if (x < 0 || x >= width)`) on every inner iteration adds significant overhead.
**Action:** Pre-clamp boundaries using `Math.max()` and `Math.min()` before the loops, and ensure nested loops are structured with `y` (rows) as the outer loop and `x` (columns) as the inner loop to guarantee contiguous memory access in `ImageData`.
