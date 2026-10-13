## 2025-02-18 - Optimized loop and allocations inside requestAnimationFrame

**Learning:** During analysis of high-frequency visual loop logic (like `detectMotion` inside `requestAnimationFrame`), I identified several micro-stutter triggers. Repeated object allocations like the `cornerSamples` array inside `detectMotion` function and uses of `Array.prototype.forEach()` in hot code paths add to CPU and Garbage Collection overhead. Furthermore, nested loops checking bounds iteratively within the loop body can be optimized by statically clamping boundaries with `Math.max` and `Math.min` before iterating.

**Action:** When optimizing high-frequency loops (e.g. `requestAnimationFrame`, canvas processing loops), move static array configurations (like sampling corner coords) out of the loop block completely to prevent continuous reallocation. Replace `.forEach` arrays with direct local assignments or `for` loops, and clamp nested loop coordinates outside of the processing loops.
