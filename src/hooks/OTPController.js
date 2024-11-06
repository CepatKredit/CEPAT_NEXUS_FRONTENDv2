import { create } from 'zustand'

export const DisplayOTP = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
}))