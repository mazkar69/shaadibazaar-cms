import { create } from 'zustand'



const useUserStore = create((set) => ({
  user: {},
  setUser: (user) => set((state) => ({ user: user })),
  deleteUser: () => set({ user: {} }),
}))


export const setUser = useUserStore.getState().setUser;
export const deleteUser = useUserStore.getState().deleteUser;
export const getUser = () => useUserStore.getState().user;
export { useUserStore };