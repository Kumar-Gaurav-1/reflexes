## 2024-07-12 - AR Render Loop Dynamic Allocation Bottleneck
**Learning:** Found that the `requestAnimationFrame` loop in `ar-drill-view.tsx` was dynamically allocating arrays and objects (`cornerSamples`) on every single frame, causing significant garbage collection pressure which leads to stutters in the kinetic tracking.
**Action:** Always pre-calculate static values (like corner indices) outside of React components and use standard `for` loops instead of `.forEach` or `.map` inside hot rendering paths like `requestAnimationFrame`.
