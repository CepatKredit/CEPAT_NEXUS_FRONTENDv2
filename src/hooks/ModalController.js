import { create } from 'zustand'

export const viewModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

export const viewPDFViewer = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    GetData: '',
    StoreData: (data) => set(() => ({ GetData: data })),
}))

export const viewPDFView = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataHolder: '',
    storeData: (data) => set(() => ({ dataHolder: data })),
}))

export const viewModalUploadDocx = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
}))


export const viewModalDocxEdit = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
}))

export const viewResetPasswordModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    AccountId: '',
    setId: (data) => set(() => ({ AccountId: data })),
}))

export const viewForgotPasswordModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
}))

export const viewUnlockAccountModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
}))

export const BatchModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
}))

export const AvailableModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
}))