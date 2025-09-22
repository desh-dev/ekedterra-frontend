// src/stores/counter-store.ts
import { PropertyCategory, PropertyType } from "@/lib/graphql/types";
import { createStore } from "zustand/vanilla";

export type CategoryState = {
  login: boolean;
  category: PropertyCategory;
  country?: string | undefined;
  city?: string | undefined;
  type?: PropertyType | undefined;
};

export type CategoryAction = {
  setLogin: (login: boolean) => void;
  setCategory: (category: PropertyCategory) => void;
  setCountry: (country: string | undefined) => void;
  setCity: (city: string | undefined) => void;
  setType: (type: PropertyType) => void;
  reset: () => void;
};

export type CategoryStore = CategoryState & CategoryAction;

export const defaultInitState: CategoryState = {
  login: false,
  category: "housing",
  country: undefined,
  city: undefined,
  type: undefined,
};

export const createCategoryStore = (
  initState: CategoryState = defaultInitState
) => {
  return createStore<CategoryStore>()((set) => ({
    ...initState,
    setLogin: (login: boolean) => set(() => ({ login })),
    setCategory: (category: PropertyCategory) => set(() => ({ category })),
    setCountry: (country: string | undefined) => set(() => ({ country })),
    setCity: (city: string | undefined) => set(() => ({ city })),
    setType: (type: PropertyType) => set(() => ({ type })),
    reset: () => set(() => ({ ...defaultInitState })),
  }));
};
