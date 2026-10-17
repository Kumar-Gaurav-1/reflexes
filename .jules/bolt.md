## 2024-10-17 - Optimize AR Tracking Loop
**Learning:** High-frequency loops like `requestAnimationFrame` for AR tracking are sensitive to array iterations (`.forEach`) and object allocations, leading to Garbage Collection micro-stutters. Nested loops also suffer from redundant evaluations without pre-clamped boundaries.
**Action:** Unroll static arrays and pre-calculate/clamp loop boundaries using `Math.max` and `Math.min` outside nested loops to avoid per-pixel conditional evaluations.
