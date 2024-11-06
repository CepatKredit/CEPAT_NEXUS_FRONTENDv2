import { create } from 'zustand'

export const AvailableDisbursementList = create((set) => ({
    GetList: [],
    SetList: (state) => set(() => ({ GetList: state })),
    GetTotalAmount: 0,
    SetTotalAmount: (state) => set(() => ({ GetTotalAmount: state })),
    GetTotalCount: 0,
    SetTotalCount: (state) => set(() => ({ GetTotalCount: state })),
}))