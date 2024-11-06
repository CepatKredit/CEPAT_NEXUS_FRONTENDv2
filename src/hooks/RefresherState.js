import { create } from 'zustand'

export const RefreshRole = create((set) => ({
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

export const RefreshUserInfo = create((set) => ({
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))