## 2024-05-24 - Canvas rendering loop optimization
**Learning:** dynamic object/array allocation in `requestAnimationFrame` causes garbage collection pauses and stutters.
**Action:** avoid dynamic array/object allocations and prefer pre-calculated static constants with standard `for` loops to minimize garbage collection pauses and stutters.
