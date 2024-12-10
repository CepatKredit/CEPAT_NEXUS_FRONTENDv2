import { create } from 'zustand'

export const SideNavState = create((set) => ({
    isTableExpanded: false,
  toggleTableHeight: () =>
    set((state) => ({ isTableExpanded: !state.isTableExpanded })),
}));