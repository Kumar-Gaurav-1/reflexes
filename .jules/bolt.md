
## 2024-05-18 - Loop Invariants and Sequential Memory Access in Hot Code Paths
**Learning:** Pre-calculating loop bounds to avoid inner-loop conditionals and swapping loop iterations (Y outside, X inside) to ensure sequential 1D array access (preventing cache misses) significantly improves execution time in hot requestAnimationFrame loops.
**Action:** When working on pixel arrays or frequent data parsing loops, ensure sequential memory access (`pos += 4`) instead of recalculating index from x/y on every iteration, and lift all non-changing conditionals (like boundary checks) outside of the loop.
