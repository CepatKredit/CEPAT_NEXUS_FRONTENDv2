import { create } from 'zustand'

export const GrandTotal = create((set) => ({
    /* DOCUMENTED */
    OFWValueDOC: 0,
    setOFWDOC: (value) => set(() => ({ OFWValueDOC: value })),
    BENEValueDOC: 0,
    setBENEDOC: (value) => set(() => ({ BENEValueDOC: value })),
    ACBValueDOC: 0,
    setACBDOC: (value) => set(() => ({ ACBValueDOC: value })),
    /* DECLARED */
    OFWValue: 0,
    setOFW: (value) => set(() => ({ OFWValue: value })),
    BENEValue: 0,
    setBENE: (value) => set(() => ({ BENEValue: value })),
    ACBValue: 0,
    setACB: (value) => set(() => ({ ACBValue: value })),
}))

export const Validation = create((set) => ({
    Counter: 0,
    setCounter: (value) => set(() => ({ Counter: value })),
}))