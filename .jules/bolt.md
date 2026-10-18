## 2023-10-27 - Optimize AR Tracking requestAnimationFrame loop
**Learning:** Object allocation (cornerSamples) and array iteration (.forEach) inside high-frequency `requestAnimationFrame` loops cause GC micro-stutters. Nested loops with per-pixel bounds checking (if (x < 0 || x >= 160 || y < 0 || y >= 120) continue) add unnecessary conditional branch evaluations.
**Action:** Pre-calculate and unroll static array positions. Use `Math.max` and `Math.min` to clamp loop boundaries outside the inner loops to avoid expensive per-pixel conditional checks.
