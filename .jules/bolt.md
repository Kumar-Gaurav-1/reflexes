
## 2024-05-24 - Canvas Rendering Loop GC & Bounds Checking Optimization
**Learning:** Dynamic object creation (like objects in arrays) inside a `requestAnimationFrame` loop creates constant garbage collection pressure, leading to frame stutters. Also, conditional bounds checking inside dense pixel processing loops executes thousands of times per frame unnecessarily.
**Action:** Extract repeated coordinate calculations to module-level `Int32Array` constants. Clamp array boundaries (`Math.max` / `Math.min`) before entering nested loops to skip conditional bounds checks inside the loop body.
