## 2026-07-27 - Optimize AR rendering loop by removing inner bounds checks and static allocations
**Learning:** For AR/Canvas rendering loops (e.g., `requestAnimationFrame`), avoiding dynamic array/object allocations and preferring pre-calculated static constants (e.g., `Int32Array`) with standard `for` loops minimizes garbage collection pauses and stutters.
**Action:** Extract pre-calculated offsets out of rendering loops and use standard bounded `for` loops rather than performing bounds checks on each pixel.
