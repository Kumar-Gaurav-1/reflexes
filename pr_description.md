**💡 What:**
Optimized the `detectMotion` loop inside `ARDrillView` by pre-calculating corner positions into a static module-level `Int32Array`, avoiding 4 object allocations per frame. Furthermore, pre-calculated the clamped search bounds for the kinetic isolation loop (using `Math.max`/`min`), swapping the iteration order to be row-major (y then x), and caching the `y * 160` offset.

**🎯 Why:**
During high-frequency `requestAnimationFrame` loops manipulating HTMLCanvas pixel buffers, object allocations trigger garbage collection which causes UI stutters. Similarly, performing `if (x < 0 || x >= 160 ...)` boundary checks hundreds of times per frame inside the tightest inner loop is CPU-intensive. Modifying loop bounds and memory access patterns improves frame processing time significantly.

**📊 Impact:**
- Eliminates 240 object allocations per second (assuming 60fps * 4 corners).
- Removes bounds-checking conditional branching completely from the inner motion detection loop, saving thousands of checks per frame.
- Improves spatial CPU caching by iterating the `data` array linearly.

**🔬 Measurement:**
Verify the optimization by building the Next.js app (`npm run build`) and observing no loss in hand-tracking fidelity when neutralizing targets in the AR view, while memory profiling in Chrome DevTools should show reduced GC spikes.
