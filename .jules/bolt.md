
## 2026-08-19 - AR Kinetic Optimization
**Learning:** Instantiating objects or arrays (like mapping over dynamic sets to sample pixels) and non-contiguous nested looping (x outside, y inside) within high-frequency `requestAnimationFrame` hooks causes critical Garbage Collection micro-stutters and cache misses in React AR components.
**Action:** Unroll small static pixel operations and structure dynamic 2D array traversals in row-major order (y outer, x inner) with clamped bounds in high-performance render paths.
