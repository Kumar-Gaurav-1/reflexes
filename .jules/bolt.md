
## 2024-05-24 - [AR rendering loop optimization]
**Learning:** Found a performance bottleneck in the AR rendering loop (`requestAnimationFrame`) caused by dynamic array allocation on every frame (`const cornerSamples = [{x: 5, y: 5}, ...]`) and poor cache locality in nested pixel processing loops where `x` was the outer loop and `y` was the inner loop.
**Action:** Always extract static constants, especially arrays/objects, outside of rendering loops and define them as typed arrays (like `Int32Array`) to eliminate garbage collection pressure. Structure pixel processing loops so that the axis representing contiguous memory (usually `x`) is the inner loop to maximize cache hits.
