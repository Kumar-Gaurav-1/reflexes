import { test, describe, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { reducer } from "./use-toast";

describe("useToast reducer", () => {
  beforeEach(() => {
    // Only mock setTimeout since it's the only timer used in addToRemoveQueue
    mock.timers.enable({ apis: ['setTimeout'] });
  });

  afterEach(() => {
    mock.timers.reset();
    mock.restoreAll();
  });

  test("ADD_TOAST should add a toast and respect TOAST_LIMIT", () => {
    const initialState = { toasts: [] };
    // @ts-ignore
    const state1 = reducer(initialState, {
      type: "ADD_TOAST",
      toast: { id: "1", title: "First" },
    });
    assert.deepEqual(state1, { toasts: [{ id: "1", title: "First" }] });

    // TOAST_LIMIT is set to 1 in the actual code! So adding another will replace it
    // @ts-ignore
    const state2 = reducer(state1, {
      type: "ADD_TOAST",
      toast: { id: "2", title: "Second" },
    });

    assert.deepEqual(state2, { toasts: [{ id: "2", title: "Second" }] });
  });

  test("UPDATE_TOAST should update the correct toast", () => {
    // @ts-ignore
    const initialState = { toasts: [{ id: "1", title: "First", open: true }] };
    // @ts-ignore
    const state = reducer(initialState, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "Updated" },
    });
    assert.deepEqual(state.toasts[0], { id: "1", title: "Updated", open: true });
  });

  test("DISMISS_TOAST should set open: false for a specific toast", () => {
    // @ts-ignore
    const initialState = { toasts: [{ id: "1", title: "First", open: true }, { id: "2", title: "Second", open: true }] };
    // @ts-ignore
    const state = reducer(initialState, {
      type: "DISMISS_TOAST",
      toastId: "1",
    });
    // @ts-ignore
    assert.equal(state.toasts[0].open, false);
    // @ts-ignore
    assert.equal(state.toasts[1].open, true);
  });

  test("DISMISS_TOAST should set open: false for all toasts if no toastId is provided", () => {
    // @ts-ignore
    const initialState = { toasts: [{ id: "1", title: "First", open: true }, { id: "2", title: "Second", open: true }] };
    // @ts-ignore
    const state = reducer(initialState, {
      type: "DISMISS_TOAST",
    });
    // @ts-ignore
    assert.equal(state.toasts[0].open, false);
    // @ts-ignore
    assert.equal(state.toasts[1].open, false);
  });

  test("REMOVE_TOAST should remove a specific toast", () => {
    // @ts-ignore
    const initialState = { toasts: [{ id: "1", title: "First" }, { id: "2", title: "Second" }] };
    // @ts-ignore
    const state = reducer(initialState, {
      type: "REMOVE_TOAST",
      toastId: "1",
    });
    assert.deepEqual(state.toasts, [{ id: "2", title: "Second" }]);
  });

  test("REMOVE_TOAST should remove all toasts if no toastId is provided", () => {
    // @ts-ignore
    const initialState = { toasts: [{ id: "1", title: "First" }, { id: "2", title: "Second" }] };
    // @ts-ignore
    const state = reducer(initialState, {
      type: "REMOVE_TOAST",
    });
    assert.deepEqual(state.toasts, []);
  });
});
