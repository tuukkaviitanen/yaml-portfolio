import { create } from "zustand";

type Store = {
  filter: string;
  setFilter: (filter: string) => void;
};

const useStore = create<Store>((set) => ({
  filter: "",
  setFilter: (filter: string) => set({ filter }),
}));

export default useStore;
