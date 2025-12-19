import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export interface AuthData {
    user: {
        username: string;
        id: string;
    }
    token: string;
}

export interface AppState {
    authData: AuthData | null;
}

interface Action {
    setAuthData: (authData: AppState['authData']) => void;
    removeAuthData: () => void;
}

export const useAppStore = create<AppState & Action>()(
    persist(
        (set) => ({
            authData: null,
            setAuthData: (authData: AppState['authData']) => set({authData}),
            removeAuthData: () => set({authData: null}),
        }),
        {
            name: 'app-state',
        }
    )
);
