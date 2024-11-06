import { create } from 'zustand'
import { toDecrypt } from '@utils/Converter'

export const PageKey = create((set) => ({
    pageAccess: toDecrypt(localStorage.getItem('UPTH')),
    setPageAccess: (value) => set(() => ({ pageAccess: value })),
}))
