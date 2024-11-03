import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
  token: string;
}

interface Action {
  setUser: (token: string) => void;
  resetUser: () => void;
}

const initialState: State = {
  token: "",
};

const useUserStore = create<State & Action>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (token) => {
        set({ token });
      },
      resetUser: () => {
        set(initialState);
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
