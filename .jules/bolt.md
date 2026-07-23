## 2026-07-23 - AR/Canvas Loop Optimizations
**Learning:** High-frequency `requestAnimationFrame` loops processing image data benefit heavily from pre-calculated 1D byte indices, avoiding `(y * width + x) * channels` recalculations, and replacing conditional bounds checks with loop boundaries via `Math.max`/`min`.
**Action:** Extract repeated coordinate calculations to static `Int32Array` offsets outside React components, and clamp processing boundaries beforehand to keep inner pixel loops tight and branchless.
