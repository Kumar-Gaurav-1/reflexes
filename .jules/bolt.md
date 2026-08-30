## 2025-02-14 - Optimize Image Lookups with Precomputed Map
**Learning:** O(N) array `.find()` operations inside React component render loops (e.g., when rendering lists or looking up multiple images) can cause performance bottlenecks.
**Action:** Always precompute a `Map` (or dictionary) at the module level outside the component (e.g., `new Map(data.map(item => [item.id, item]))`) to enable O(1) lookups and significantly improve render performance.
