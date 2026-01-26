import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  id: string;
  name: string;
  slug: string;
  phoneNumber: string;
}

interface SelectedStore {
  store: Store;
  role: string;
}
interface UserStoreLink {
  role: string;
  store: Store;
}

interface User {
  id: string;
  name: string;
  email: string;
  stores: UserStoreLink[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  selectedStore: SelectedStore | null;

  setSelectedStore: (store: SelectedStore | null) => void;
  setAuth: (data: { user: User; token: string }) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      selectedStore: null,
      setSelectedStore: (storeData: SelectedStore | null) =>
        set(() => ({
          selectedStore: storeData,
        })),

      setAuth: ({ user, token }) =>
        set(() => ({
          user,
          token,
        })),

      logout: () => {
        window.electron.store.set("selectedStore", null);
        set(() => ({
          user: null,
          token: null,
          selectedStore: null,
        }));
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

