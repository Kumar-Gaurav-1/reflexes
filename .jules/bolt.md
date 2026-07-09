## 2025-05-18 - Canvas Pixel Loop Micro-Optimizations
**Learning:** In high-frequency motion detection (e.g., kinetic hand-tracking), inner loops running per frame (60fps) are extremely sensitive to conditional branching. Bounds checking inside a pixel iteration loop causes significant branch prediction overhead.
**Action:** When searching local areas in an ImageData array, precalculate bounding coordinates (`Math.max(0, canvasX - searchRadius)`) outside the loop and cache row offsets to avoid repeated multiplications and branch conditionals in the innermost loop.
