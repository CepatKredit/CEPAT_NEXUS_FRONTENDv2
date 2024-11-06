import { create } from 'zustand'

export const FileUpload = create((set) => ({
    fileList: [],
    addFile: (file) => set((state) => ({ fileList: [...state.fileList, file] })),
    updateFile: (index, data) => set((state) => ({ fileList: state.fileList.map((item, i) => i === index ? data : item) })),
    removeFile: (file) => set((state) => ({ fileList: state.fileList.filter((t) => t !== file) })),
    clearList: () => set(() => ({ fileList: [] }))
}))

export const FileTemp = create((set) => ({
    fileList: [],
    addFile: (file) => set((state) => ({ fileList: [...state.fileList, file] })),
    removeFile: (file) => set((state) => ({ fileList: state.fileList.filter((t) => t !== file) })),
    clearList: () => set(() => ({ fileList: [] }))
}))

export const FileDownload = create((set) => ({
    dataCollection: [],
    storeData: (data) => set(() => ({ dataCollection: data })),
}))