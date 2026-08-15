## 2024-05-24 - AR Tracking Loop Optimizations: Cache Locality and Garbage Collection

**Learning:** During AR tracking frame processing via `requestAnimationFrame`, two critical performance anti-patterns were found:
1.  **Garbage Collection Micro-stutters:** Creating temporary arrays (e.g., `cornerSamples = [{x,y}, ...]`) and using iteration methods like `.forEach()` per-frame led to frequent GC pauses. Static, unrolled array access mitigates this.
2.  **Cache Thrashing in Pixel Loops:** Iterating over 1D image data arrays `[x, y]` where `x` is the outer loop causes non-contiguous memory access. Swapping the order to `[y, x]` ensures contiguous, row-major cache locality.

**Action:**
1. Avoid creating temporary objects inside high-frequency loops (like AR/Canvas processing paths). Use unrolled statements or pre-allocated variables.
2. Structure 2D spatial nested loops with `y` (rows) as the outer loop and `x` (columns) as the inner loop to maintain sequential memory access.
