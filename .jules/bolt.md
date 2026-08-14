## 2025-08-13 - Frame Loop GC Stutters
**Learning:** Allocating array/object literals and using iterator methods like `.forEach()` inside a high-frequency rendering loop (e.g., `requestAnimationFrame` for AR hand tracking) causes substantial garbage collection pressure.
**Action:** Unroll static arrays and precompute offsets statically outside of loops to eliminate per-frame allocations and prevent rendering micro-stutters.
