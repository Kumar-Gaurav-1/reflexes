
## 2024-05-14 - Optimize AR drill motion detection loop
**Learning:** In high-frequency `requestAnimationFrame` loops for image processing (like AR motion detection), even minor garbage collection (GC) pauses caused by allocating small arrays or creating inline functions for `.forEach` can cause noticeable micro-stutters. Also, iterating over 1D canvas image data in column-major order (x then y) causes CPU cache misses, whereas row-major (y then x) is significantly faster.
**Action:** Unroll small static array operations, replace `.forEach` with standard `for` loops to prevent function recreation, pre-calculate/clamp loop boundaries outside the inner loop to avoid per-pixel conditional evaluations, and iterate y then x for better CPU cache locality.
