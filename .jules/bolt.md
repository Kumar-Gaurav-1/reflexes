
## 2024-02-13 - [Pre-calculating nested loop boundaries for high-frequency handlers]
**Learning:** [When dealing with high-frequency handlers (such as requestAnimationFrame processing video pixel data), evaluating branch conditions like `if (x < 0 || x >= bounds) continue;` inside the innermost part of double for loops generates massive branch mispredictions and wastes performance.]
**Action:** [Move the boundary checks and clamping logic outside nested loops by using `Math.max` and `Math.min` to pre-calculate `startX`, `endX`, `startY`, and `endY` values so the loop safely executes its core iterations without needing inner branch conditionals.]
