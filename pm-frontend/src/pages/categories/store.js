import { create } from 'zustand'

export const useCategoriesStore = create((set) => ({
  categories: [],
  isLoading: false,
  isLoaded: false,
  setCategories: (categories) => set({ categories }),
  fetchCategories: async () => {
    set({ isLoading: true })
    const response = await fetch('/api/categories')
    const categories = await response.json()
    set({ categories, isLoading: false, isLoaded: true })
  }
}))

export const useFetchCategories = () => {
  return useCategoriesStore(({ fetchCategories }) => fetchCategories)
}

export const useCategories = () => {
  return useCategoriesStore(({ categories }) => categories)
}

export const useCategoriesStates = () => {
  return useCategoriesStore(({ isLoading, isLoaded }) => ({
    isLoading,
    isLoaded,
  }))
}
