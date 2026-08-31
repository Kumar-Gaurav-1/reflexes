## 2024-06-25 - Avoid O(N) Array Lookups in Render Loops
**Learning:** Performing `Array.prototype.find()` operations within render loops or component bodies creates an O(N) performance bottleneck on every render, especially when the array is large or the component re-renders frequently.
**Action:** Always precompute a `Map` or dictionary (e.g., `new Map(data.map(item => [item.id, item]))`) at the module level outside the component to achieve O(1) lookups and significantly improve rendering performance.
