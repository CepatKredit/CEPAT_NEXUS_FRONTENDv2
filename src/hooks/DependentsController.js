import { create } from 'zustand'

export const getDependentsCount = create((set) => ({
    Count: 0,
    setCount: (data) => set(() => ({ Count: data })),
}))
