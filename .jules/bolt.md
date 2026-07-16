## 2026-07-16 - [Performance Optimization: React State to CSS Animations]
**Learning:** Using `setInterval` to drive rapid React state updates for animations (like setting element depth/scale every 30ms) triggers excessive component re-renders, causing severe CPU load and dropping frames on complex canvas components.
**Action:** Replace high-frequency React state updates with CSS animations (`@keyframes` and `transition`) combined with standard DOM removal (e.g., a single `setTimeout` that matches the animation duration). This hands off the animation work to the browser's compositor thread.
