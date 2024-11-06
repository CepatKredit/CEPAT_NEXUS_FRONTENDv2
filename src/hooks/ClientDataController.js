import { create } from 'zustand'

export const ClientDetails = create((set) => ({
    GetClientId: '',
    SetClientId: (state) => set(() => ({ GetClientId: state })),
    RefreshValue: 0,
    StoreValue: (data) => set(() => ({ refreshValue: data })),
}))