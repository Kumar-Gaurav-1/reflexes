## 2024-07-11 - [Optimize AR Engine Kinetic Loop]
**Learning:** Allocating arrays and using array methods like `.forEach` inside high-frequency loops (like `requestAnimationFrame`) causes unnecessary garbage collection (GC) pauses and micro-stutters.
**Action:** Extract dynamically created array allocations and their internal methods (like `.forEach()`) into pre-calculated static arrays or constants and use `for` loops inside the hot path to avoid GC pauses and improve performance in AR/Canvas rendering scenarios.
