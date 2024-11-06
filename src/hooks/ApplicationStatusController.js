import { create } from 'zustand'

export const ApplicationStatus = create((set) => ({
    GetStatus: '',
    SetStatus: (state) => set(() => ({ GetStatus: state })),
}))