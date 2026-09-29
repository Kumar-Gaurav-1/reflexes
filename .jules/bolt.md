## 2024-06-18 - Avoid Garbage Collection micro-stutters in requestAnimationFrame

**Learning:** In high-frequency `requestAnimationFrame` loops (e.g., AR tracking or canvas rendering), allocating new objects/arrays and using array iteration methods like `.forEach()` on every frame can trigger Garbage Collection (GC) micro-stutters. Also, relying on per-pixel branch evaluations (like `if (x < 0 || x >= 160 || y < 0 || y >= 120) continue`) in dense loops can significantly slow down performance.

**Action:** Unroll static arrays and use direct variable assignments instead of array iterators. Pre-calculate and clamp loop boundaries outside nested loops (e.g., using `Math.max` and `Math.min`) to avoid expensive conditional branch evaluations per pixel.
