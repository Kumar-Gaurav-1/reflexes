## 2024-05-18 - Replacing setInterval with CSS transitions in AR Drill View
**Learning:** Replaced a 30ms interval doing manual float increments for 'z' depth scaling with a native CSS transition triggered via setTimeout.
**Action:** Always prefer CSS transitions over high-frequency JavaScript intervals or requestAnimationFrame for simple state interpolations (like opacity or scale) in React, as it avoids unnecessary main-thread execution and React state churn, especially in performance-critical areas like AR rendering.
