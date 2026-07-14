## 2025-02-12 - AR Rendering Loop Optimization
**Learning:** In high-frequency rendering loops like `requestAnimationFrame` for AR canvas processing (`detectMotion`), inline array allocations (like `[{x:5, y:5}, ...]`) and `.forEach` callbacks cause excessive garbage collection (GC) pressure, leading to measurable frame stutters.
**Action:** Always extract static configurations into constants outside the component scope and use traditional `for` loops to iterate over lists inside `requestAnimationFrame`.
