import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export interface AuthData {
    email: string;
    id: string;
    token: string;
}

export interface AppState {
    authData: AuthData | null;
}

interface Action {
    setAuthData: (authData: AppState['authData']) => void;
    removeAuthData: () => void;
}

export const useAuthStore = create((set) => ({
    session: undefined,
    setSessionData: () => set((data: AuthData) => ({session: data})),
}))

export const useAppStore = create<AppState & Action>()(
    persist(
        (set) => ({
            authData: null,
            setAuthData: (authData: AppState['authData']) => set({authData}),
            removeAuthData: () => set({authData: null}),
        }),
        {
            name: 'app-state', // Key to store data in localStorage
        }
    )
);
