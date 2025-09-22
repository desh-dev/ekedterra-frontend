"use client";

import { CategoryStore, createCategoryStore } from "@/store/category";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

export type CategoryStoreApi = ReturnType<typeof createCategoryStore>;

export const CategoryStoreContext = createContext<CategoryStoreApi | undefined>(
  undefined
);

export interface CategoryStoreProviderProps {
  children: ReactNode;
}

export const CategoryStoreProvider = ({
  children,
}: CategoryStoreProviderProps) => {
  const storeRef = useRef<CategoryStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createCategoryStore();
  }

  return (
    <CategoryStoreContext.Provider value={storeRef.current}>
      {children}
    </CategoryStoreContext.Provider>
  );
};

export const useCategoryStore = <T,>(
  selector: (store: CategoryStore) => T
): T => {
  const categoryStoreContext = useContext(CategoryStoreContext);

  if (!categoryStoreContext) {
    throw new Error(
      `useCategoryStore must be used within CounterStoreProvider`
    );
  }

  return useStore(categoryStoreContext, selector);
};
