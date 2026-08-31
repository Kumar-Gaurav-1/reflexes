
## 2024-05-18 - [Optimize Array lookups with Map]
**Learning:** O(N) array `.find()` calls inside render loops or high-frequency loops can cause performance bottlenecks.
**Action:** Precompute a `Map` or dictionary at the module level (outside the React component) to achieve O(1) lookups for static or slowly changing data.
