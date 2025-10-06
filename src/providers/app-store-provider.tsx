"use client";

import { AppStore, createAppStore } from "@/store/app";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

export type AppStoreApi = ReturnType<typeof createAppStore>;

export const AppStoreContext = createContext<AppStoreApi | undefined>(
  undefined
);

export interface AppStoreProviderProps {
  children: ReactNode;
}

export const CategoryStoreProvider = ({ children }: AppStoreProviderProps) => {
  const appStoreRef = useRef<AppStoreApi | null>(null);
  if (appStoreRef.current === null) {
    appStoreRef.current = createAppStore();
  }

  return (
    <AppStoreContext.Provider value={appStoreRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
  const appStoreContext = useContext(AppStoreContext);

  if (!appStoreContext) {
    throw new Error(`useAppStore must be used within CounterStoreProvider`);
  }

  return useStore(appStoreContext, selector);
};
