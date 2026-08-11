## 2024-11-20 - [Avoid array iterators and nested objects in AR loops]
**Learning:** High-frequency rendering pipelines like React `requestAnimationFrame` hooks are highly sensitive to Javascript Garbage Collection pauses. Allocating inline objects and arrays (e.g. `[{x:5,y:5}, ...]`) and using array iterative methods like `.forEach` cause unnecessary microstutters due to rapid memory consumption.
**Action:** Unroll small static arrays manually when possible and favor standard `for` loops inside rAF code to eliminate allocation overhead completely.
