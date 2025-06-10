import { create } from 'zustand';

export interface CollectionItem {
  comment?: string | null;
  rate: number;
  name_cn: string;
}

export interface CollectionsData {
  data: CollectionItem[];
  total: number;
}

export interface UserData {
  collections: CollectionsData;
}

interface UserStore {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));