import { create } from 'zustand'

// Category store
export const useCategoryStore = create((set) => ({
  category: {},
  isLoading: false,
  isLoaded: false,
  setCategory: (category) => set({ category }),
  fetchCategory: async (id) => {
    set({ isLoading: true })
    const response = await fetch(`/api/category/${id}`)
    const category = await response.json()
    set({ category, isLoading: false, isLoaded: true })
  },
  unsetCategory: () => set({ category: {}, isLoading: false, isLoaded: false }),
}))

export const useFetchCategory = () => {
  return useCategoryStore(({ fetchCategory }) => fetchCategory)
}

export const useCategory = () => {
  return useCategoryStore(({ category }) => category)
}

export const useCategoryStates = () => {
  return useCategoryStore(({ isLoading, isLoaded }) => ({
    isLoading,
    isLoaded,
  }))
}

export const useUnsetCategory = () => {
  return useCategoryStore(({ unsetCategory }) => unsetCategory)
}

// Category tags store
export const useTagsStore = create((set) => ({
  tags: [],
  isLoading: false,
  isLoaded: false,
  setTags: (tags) => set({ tags }),
  fetchTags: async (id) => {
    set({ isLoading: true })
    const response = await fetch(`/api/category/${id}/tags`)
    const tags = await response.json()
    set({ tags, isLoading: false, isLoaded: true })
  },
  unsetTags: () => set({ tags: [], isLoading: false, isLoaded: false }),
}))

export const useFetchTags = () => {
  return useTagsStore(({ fetchTags }) => fetchTags)
}

export const useTags = () => {
  return useTagsStore(({ tags }) => tags)
}

export const useTagsStates = () => {
  return useTagsStore(({ isLoading, isLoaded }) => ({
    isLoading,
    isLoaded,
  }))
}

export const useUnsetTags = () => {
  return useTagsStore(({ unsetTags }) => unsetTags)
}