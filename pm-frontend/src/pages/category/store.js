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

const getUniqueImageNames = (tags) => {
  return [...new Set(tags.flatMap(tag => tag.images.map(image => image.name)))];
};

// Global slider store
export const useSliderStore = create((set, get) => ({
  tagImagesNames: [],
  selectedImageGlobalIndex: 0,
  setTagImagesNames: (tagImagesNames) => set({ tagImagesNames }),
  slideRight: () => {
    let index = get().selectedImageGlobalIndex + 1;
    if (index >= get().tagImagesNames.length) {
      index = 0;
    }
    set({ selectedImageGlobalIndex: index })
  },
  slideLeft: () => {
    let index = get().selectedImageGlobalIndex - 1;
    if (index < 0) {
      index = get().tagImagesNames.length - 1;
    }
    set({ selectedImageGlobalIndex: index })
  },
  unsetTagImagesNames: () => set({ tagImagesNames: [], selectedImageGlobalIndex: 0 }),
}))

export const useSetTagImagesNames = () => {
  return useSliderStore(({ setTagImagesNames }) => setTagImagesNames)
}

export const useSlide = () => {
  return useSliderStore(({ slideRight, slideLeft }) => ({ slideRight, slideLeft }))
}

export const useIndex = () => {
  return useSliderStore(({ selectedImageGlobalIndex }) => selectedImageGlobalIndex)
}

export const useTagImagesNames = () => {
  return useSliderStore(({ tagImagesNames }) => tagImagesNames)
}

export const useUnsetTagImagesNames = () => {
  return useSliderStore(({ unsetTagImagesNames }) => unsetTagImagesNames)
}

// Function to filter tags
const filterTags = (tags, filters = []) => {
  // possible filters: all, hidden, featured
  // if filters empty, return all tags except hidden
  // if filters.hidden = true, shows hidden tags only
  // if filters.featured = true, shows featured tags only
  // if filters.all = true, shows all tags
  if (filters.all) {
    return tags;
  }
  if (filters.hidden) {
    return tags.filter(tag => tag.active === false);
  }
  if (filters.featured) {
    return tags.filter(tag => tag.featured === true);
  }
  return tags.filter(tag => tag.active === true);
};

// Category tags store
export const useTagsStore = create((set, get) => ({
  tags: [],
  tagImagesNames: [],
  isLoading: false,
  isLoaded: false,
  setTags: (tags) => set({ tags }),
  fetchTags: async (id) => {
    if (!id) {
      return
    }
    set({ isLoading: true })
    const response = await fetch(`/api/category/${id}/tags`)
    const tags = await response.json()
    // if error, return
    if (tags.error) {
      return
    }
    // each tag has an array of images objects
    // we need to get the uniq image names to display them in the carousel
    const tagImagesNames = getUniqueImageNames(tags);

    set({
      tags: filterTags(tags),
      tagImagesNames,
      isLoading: false,
      isLoaded: true
    })
  },
  unsetTags: () => set({
    tags: [],
    tagImagesNames: [],
    isLoading: false,
    isLoaded: false
  }),
  updateTag: async (tag) => {
    // API call to update tag
    const response = await fetch(`/api/tag/${tag.id}`, {
      method: 'PUT',
      body: JSON.stringify(tag),
    })
    // If API call is successful, update the tag in the store
    if (response.ok) {
      const updatedTag = await response.json()
      set({
        tags: get().tags.map((tag) => {
          if (tag.id === updatedTag.id) {
            return updatedTag
          }
          return tag
        })
      })
    }
  },
  deleteTag: async (tag) => {
    // API call to delete tag
    const response = await fetch(`/api/tag/${tag.id}`, {
      method: 'DELETE',
    })
    // If API call is successful, delete the tag in the store
    if (response.ok) {
      set({
        tags: get().tags.filter((t) => t.id !== tag.id),
      })
    }
  }
}))

export const useFetchTags = () => {
  return useTagsStore(({ fetchTags }) => fetchTags)
}

export const useTags = () => {
  return useTagsStore(({ tags }) => tags)
}

export const useTagsStates = () => {
  return useTagsStore(({
    isLoading,
    isLoaded,
    tagImagesNames
  }) => ({
    isLoading,
    isLoaded,
    tagImagesNames
  }))
}

export const useUnsetTags = () => {
  return useTagsStore(({ unsetTags }) => unsetTags)
}

export const useUpdateTag = () => {
  return useTagsStore(({ updateTag }) => updateTag)
}

export const useDeleteTag = () => {
  return useTagsStore(({ deleteTag }) => deleteTag)
}
