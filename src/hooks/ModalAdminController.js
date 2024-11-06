import { create } from 'zustand'

//ACCOUNTS
export const viewCreateNewUserModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

export const viewEditUserModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

export const viewResetPasswordUserModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

//BRANCH
export const viewCreateNewBranchModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
}))

export const viewEditBranchModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

//COUNTRY
export const viewCountryModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

//CITY
export const viewCityyModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

//AGENCY
export const viewAgencyModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

//BARANGAY
export const viewBarangayModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))

export const detailCurrencyModal = create((set) => ({
    modalStatus: false,
    setStatus: (modal) => set(() => ({ modalStatus: modal })),
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
    refreshValue: 0,
    storeValue: (data) => set(() => ({ refreshValue: data })),
}))