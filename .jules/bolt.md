## 2023-10-27 - Pre-calculated static loops
**Learning:** In hot code paths like `requestAnimationFrame` canvas rendering, pre-calculating offset array indices mapped into a typed `Int32Array` completely avoids allocating `[x,y]` object matrices per frame, resulting in lower GC overhead.
**Action:** Use global typed arrays and standard `for` loops in place of literal array construction and `forEach` calls in 60fps loops.
