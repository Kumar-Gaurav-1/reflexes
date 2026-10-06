## 2024-10-06 - Unrolling High-Frequency Loops in requestAnimationFrame

**Learning:** In high-frequency rendering loops like `requestAnimationFrame` for AR tracking, allocating new objects or arrays, using iterators like `.forEach()`, and having nested loops with conditional bounds (like min/max operations per pixel) cause Garbage Collection (GC) micro-stutters and expensive branch evaluations.
**Action:** Unroll small static loops manually (like sampling 4 corners). For nested pixel processing loops, pre-calculate the exact minimum and maximum iteration boundaries outside the loop using `Math.max` and `Math.min` instead of evaluating conditionals (`if (x < 0 || x >= width) continue;`) inside the hottest part of the loop.
