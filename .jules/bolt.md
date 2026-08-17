## 2026-08-17 - Optimize AR tracking loop
**Learning:** For high-frequency `requestAnimationFrame` loops doing pixel processing, avoiding GC micro-stutters by unrolling arrays/`.forEach()` and improving cache locality via row-major iteration (outer `y`, inner `x`) significantly improves execution speed without architectural changes.
**Action:** When working on pixel processing loops, pre-calculate array positions, unroll static small loops, clamp bounds outside of nested loops, and ensure nested loops iterate row-by-row (`y` then `x`) instead of column-by-column to leverage contiguous memory.
