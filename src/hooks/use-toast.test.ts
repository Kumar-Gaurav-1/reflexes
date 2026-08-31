import test, { describe, it, mock, afterEach, beforeEach } from "node:test";
import assert from "node:assert";
import { reducer } from "./use-toast";

describe("useToast reducer", () => {
  beforeEach(() => {
    mock.timers.enable({ apis: ["setTimeout"] });
  });

  afterEach(() => {
    mock.timers.reset();
    mock.restoreAll();
  });

  it("should handle ADD_TOAST", () => {
    const initialState = { toasts: [] };
    const action = {
      type: "ADD_TOAST" as const,
      toast: { id: "1", title: "Test Toast" },
    };
    const state = reducer(initialState, action);
    assert.strictEqual(state.toasts.length, 1);
    assert.strictEqual(state.toasts[0].id, "1");
  });

  it("should handle UPDATE_TOAST", () => {
    const initialState = { toasts: [{ id: "1", title: "Old Title" }] };
    const action = {
      type: "UPDATE_TOAST" as const,
      toast: { id: "1", title: "New Title" },
    };
    const state = reducer(initialState, action);
    assert.strictEqual(state.toasts.length, 1);
    assert.strictEqual(state.toasts[0].title, "New Title");
  });

  it("should handle UPDATE_TOAST for non-existent id", () => {
    const initialState = { toasts: [{ id: "1", title: "Old Title" }] };
    const action = {
      type: "UPDATE_TOAST" as const,
      toast: { id: "2", title: "New Title" },
    };
    const state = reducer(initialState, action);
    assert.strictEqual(state.toasts.length, 1);
    assert.strictEqual(state.toasts[0].title, "Old Title");
  });

  it("should handle DISMISS_TOAST for a specific id", () => {
    const initialState = { toasts: [{ id: "1", open: true }, { id: "2", open: true }] };
    const action = { type: "DISMISS_TOAST" as const, toastId: "1" };
    const state = reducer(initialState, action);
    assert.strictEqual(state.toasts[0].open, false);
    assert.strictEqual(state.toasts[1].open, true);
  });

  it("should handle DISMISS_TOAST for all toasts", () => {
    const initialState = { toasts: [{ id: "1", open: true }, { id: "2", open: true }] };
    const action = { type: "DISMISS_TOAST" as const };
    const state = reducer(initialState, action);
    assert.strictEqual(state.toasts[0].open, false);
    assert.strictEqual(state.toasts[1].open, false);
  });

  it("should handle REMOVE_TOAST for a specific id", () => {
    const initialState = { toasts: [{ id: "1" }, { id: "2" }] };
    const action = { type: "REMOVE_TOAST" as const, toastId: "1" };
    const state = reducer(initialState, action);
    assert.strictEqual(state.toasts.length, 1);
    assert.strictEqual(state.toasts[0].id, "2");
  });

  it("should handle REMOVE_TOAST for all toasts", () => {
    const initialState = { toasts: [{ id: "1" }, { id: "2" }] };
    const action = { type: "REMOVE_TOAST" as const };
    const state = reducer(initialState, action);
    assert.strictEqual(state.toasts.length, 0);
  });
});
