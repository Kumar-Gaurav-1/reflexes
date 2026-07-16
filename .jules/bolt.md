## 2026-07-16 - Module-level In-Memory API Caching
**Learning:** In Next.js Genkit flows (using `use server`), module-level arrays act as in-memory state that persists between invocations. This can be leveraged to fetch batches of items and cache them, drastically reducing network round-trips for repetitive generation tasks.
**Action:** When integrating third-party APIs that return randomized data, check if the API supports bulk fetching (e.g. `amount=X`) or fire multiple concurrent requests using `Promise.all` and cache the results to minimize latency.
