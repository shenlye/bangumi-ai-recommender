import { create } from 'zustand';

interface UserData {
  collections: any[];
}

interface UserStore {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));