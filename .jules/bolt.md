
## 2024-09-23 - Optimize high-frequency AR loop
**Learning:** In high-frequency `requestAnimationFrame` rendering loops, inline array allocation and array iteration methods like `.forEach()` create memory allocations leading to Garbage Collection micro-stutters. Moreover, executing conditional boundary checks on a per-pixel basis inside deeply nested loops significantly burns CPU cycles.
**Action:** Unroll static arrays to direct variable assignments/hardcoded indices. Pre-calculate and clamp dynamic boundaries (e.g., using `Math.max` and `Math.min`) outside the nested loops to avoid expensive per-iteration branch evaluations.
