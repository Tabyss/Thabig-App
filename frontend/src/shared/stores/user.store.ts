import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

interface AuthActions {
    setAuth: (token: string) => void;
    logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist<AuthStore>(
        (set) => ({
            token: null,
            isAuthenticated: false,

            setAuth: (token: string) => set({ token, isAuthenticated: true }),

            logout: () => set({ token: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage",
        },
    ),
);
