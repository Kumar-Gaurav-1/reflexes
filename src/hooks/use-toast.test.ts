import { test, describe, afterEach, beforeEach, mock } from 'node:test'
import * as assert from 'node:assert'
import { reducer } from './use-toast'

describe('useToast reducer', () => {
  test('ADD_TOAST should add a new toast and respect TOAST_LIMIT', () => {
    const initialState = { toasts: [] }
    const toast1 = { id: '1', title: 'First' } as any
    const toast2 = { id: '2', title: 'Second' } as any

    let state = reducer(initialState, { type: 'ADD_TOAST', toast: toast1 })
    assert.deepStrictEqual(state.toasts, [toast1])

    state = reducer(state, { type: 'ADD_TOAST', toast: toast2 })
    // TOAST_LIMIT is 1 in the code, so only the newest should be kept
    assert.deepStrictEqual(state.toasts, [toast2])
  })

  test('UPDATE_TOAST should update an existing toast', () => {
    const toast = { id: '1', title: 'First', open: true } as any
    const initialState = { toasts: [toast] }

    const state = reducer(initialState, { type: 'UPDATE_TOAST', toast: { id: '1', open: false } })
    assert.deepStrictEqual(state.toasts[0].open, false)
    assert.deepStrictEqual(state.toasts[0].title, 'First')
  })

  test('UPDATE_TOAST should not update if toast id does not exist', () => {
    const toast = { id: '1', title: 'First', open: true } as any
    const initialState = { toasts: [toast] }

    const state = reducer(initialState, { type: 'UPDATE_TOAST', toast: { id: '2', open: false } })
    assert.deepStrictEqual(state.toasts, [toast])
  })

  test('REMOVE_TOAST should remove a toast by id', () => {
    const toast1 = { id: '1', title: 'First' } as any
    const toast2 = { id: '2', title: 'Second' } as any
    const initialState = { toasts: [toast1, toast2] }

    const state = reducer(initialState, { type: 'REMOVE_TOAST', toastId: '1' })
    assert.deepStrictEqual(state.toasts, [toast2])
  })

  test('REMOVE_TOAST should remove all toasts if no id is provided', () => {
    const toast1 = { id: '1', title: 'First' } as any
    const toast2 = { id: '2', title: 'Second' } as any
    const initialState = { toasts: [toast1, toast2] }

    const state = reducer(initialState, { type: 'REMOVE_TOAST' })
    assert.deepStrictEqual(state.toasts, [])
  })
})

describe('DISMISS_TOAST', () => {
  beforeEach(() => {
    mock.timers.enable({ apis: ['setTimeout'] })
  })

  afterEach(() => {
    mock.timers.reset()
    mock.restoreAll()
  })

  test('should dismiss a specific toast by id and queue it for removal', () => {
    const toast1 = { id: '1', title: 'First', open: true } as any
    const toast2 = { id: '2', title: 'Second', open: true } as any
    const initialState = { toasts: [toast1, toast2] }

    const state = reducer(initialState, { type: 'DISMISS_TOAST', toastId: '1' })
    assert.deepStrictEqual(state.toasts[0].open, false)
    assert.deepStrictEqual(state.toasts[1].open, true)
  })

  test('should dismiss all toasts if no id is provided', () => {
    const toast1 = { id: '1', title: 'First', open: true } as any
    const toast2 = { id: '2', title: 'Second', open: true } as any
    const initialState = { toasts: [toast1, toast2] }

    const state = reducer(initialState, { type: 'DISMISS_TOAST' })
    assert.deepStrictEqual(state.toasts[0].open, false)
    assert.deepStrictEqual(state.toasts[1].open, false)
  })
})
