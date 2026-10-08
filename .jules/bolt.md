## 2024-05-18 - Optimize Image Lookups to O(1)
**Learning:** High-frequency `find()` operations on arrays, particularly inside React components or rendering loops (like mapping over sports), cause O(N) linear time complexity per lookup and recreate the function object on every render.
**Action:** Precompute a `Map` or dictionary (e.g., `new Map(data.map(item => [item.id, item]))`) at the module level outside the React component to achieve O(1) lookups, and move the helper function outside the component body.
