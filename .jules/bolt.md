## 2024-05-24 - O(N) lookup in render loop
**Learning:** Found multiple instances where an array `find` operation (`PlaceHolderImages.find`) was being recreated and executed on every render cycle within React components (O(N) operation).
**Action:** Always precompute lookups using Maps (O(1)) and move lookup function definitions outside the component body to avoid recreating them on every render.
