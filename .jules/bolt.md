## 2024-05-17 - requestAnimationFrame motion detection optimization
**Learning:** Found a nested loop inside `detectMotion` bounded by `canvasX/Y +/- searchRadius` (a 16x16 window). Even though the window is small, doing per-pixel boundary checks (`if (x < 0 || x >= 160 || y < 0 || y >= 120) continue`) inside the hot loop causes unnecessary branching during every frame for multiple targets.
**Action:** Pre-calculate and clamp the loop bounds using `Math.max` and `Math.min` outside the nested loops to avoid per-pixel conditional checks.
