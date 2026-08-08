import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useCreator } from './useCreator'

vi.mock('./client', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from './client'

const ada = { id: '42', name: 'Ada Lovelace' }
const katherine = { id: '43', name: 'Katherine Johnson' }

function mockQuery({ data }) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error: null }),
  }
  query.select.mockReturnValue(query)
  query.eq.mockReturnValue(query)
  supabase.from.mockReturnValue(query)
  return query
}

describe('useCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts_loading_and_resolves', async () => {
    const query = mockQuery({ data: ada })
    const { result } = renderHook(() => useCreator('42'))

    expect(result.current.loading).toBe(true)
    expect(query.eq).toHaveBeenCalledWith('id', '42')

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.creator).toEqual(ada)
  })

  it('clears_creator_and_reloads_when_id_changes', async () => {
    const query = mockQuery({ data: ada })
    query.maybeSingle.mockResolvedValueOnce({ data: ada, error: null })
    query.maybeSingle.mockResolvedValueOnce({ data: katherine, error: null })
    const { result, rerender } = renderHook(({ id }) => useCreator(id), {
      initialProps: { id: '42' },
    })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.creator).toEqual(ada)

    act(() => rerender({ id: '43' }))

    expect(result.current.loading).toBe(true)
    expect(result.current.creator).toBeNull()

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.creator).toEqual(katherine)
    expect(query.eq).toHaveBeenLastCalledWith('id', '43')
  })

  it('ignores_stale_response_from_previous_id', async () => {
    let resolveFirst
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn(),
    }
    query.select.mockReturnValue(query)
    query.eq.mockReturnValue(query)
    query.maybeSingle
      .mockImplementationOnce(
        () => new Promise((res) => { resolveFirst = res }),
      )
      .mockResolvedValueOnce({ data: katherine, error: null })
    supabase.from.mockReturnValue(query)

    const { result, rerender } = renderHook(({ id }) => useCreator(id), {
      initialProps: { id: '42' },
    })

    act(() => rerender({ id: '43' }))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.creator).toEqual(katherine)

    act(() => resolveFirst({ data: ada, error: null }))
    await waitFor(() => expect(result.current.creator).toEqual(katherine))
    expect(result.current.creator).not.toEqual(ada)
  })

  it('does_not_set_state_after_cleanup', async () => {
    let resolve
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn(
        () => new Promise((res) => { resolve = res }),
      ),
    }
    query.select.mockReturnValue(query)
    query.eq.mockReturnValue(query)
    supabase.from.mockReturnValue(query)

    const { result, unmount } = renderHook(() => useCreator('42'))
    unmount()

    act(() => resolve({ data: ada, error: null }))
    expect(result.current).toEqual({ creator: null, loading: true })
  })
})
