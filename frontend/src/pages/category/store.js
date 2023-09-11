import { create } from 'zustand'
// fuse search
import Fuse from 'fuse.js';

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
// - filters: object
//   - active: string (all, true, false)
//   - favorite: string (all, true, false)
//   - rating: string (all, 1, 2, 3, 4, 5)
//   - name: string (search string)
//   - labels: array of strings
// - order_by: string (name_asc, name_desc, rating_asc, rating_desc)
const filterAndSortTags = (tags, filters = null, order = null) => {
  // return all tags if no filters or order
  if (!filters && !order) {
    return tags
  }

  // filter tags
  let filteredTags = tags.filter((tag) => {
    // collect all the filters in an array
    const filtersArray = [
      // active filter
      // allow if tag is active and filter is all or true
      // or if tag is not active and filter is all or false
      (filters.active === 'all' || (filters.active === 'true' && tag.active) || (filters.active === 'false' && !tag.active)),
      // favorite filter
      // allow if tag is favorite and filter is all or true
      // or if tag is not favorite and filter is all or false
      (filters.favorite === 'all' || (filters.favorite === 'true' && tag.featured) || (filters.favorite === 'false' && !tag.featured)),
      // rating filter
      // allow if tag rating is equal to filter rating or if filter is all
      (filters.rating === 'all' || tag.rank === parseInt(filters.rating))
    ]
    // return true if all filters are true
    return filtersArray.every((filter) => filter)
  })

  // order tags
  switch (order) {
    case 'name_asc':
      filteredTags = filteredTags.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name_desc':
      filteredTags = filteredTags.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'rating_asc':
      filteredTags = filteredTags.sort((a, b) => a.rank - b.rank)
      break
    case 'rating_desc':
      filteredTags = filteredTags.sort((a, b) => b.rank - a.rank)
      break
    default:
      // by default, order by name asc
      filteredTags = filteredTags.sort((a, b) => a.name.localeCompare(b.name))
  }

  // fuse search
  if (filters.name) {
    const fuse = new Fuse(filteredTags, {
      includeMatches: true,
      keys: ['name']
    })
    const results = fuse.search(filters.name)
    // add matches to filteredTags with a new key 'matches'
    filteredTags = results.map((result) => {
      return {
        ...result.item,
        matches: result.matches
      }
    })
  }

  return filteredTags
};

const initialFiltersState = {
    active: 'true', // active tags only by default
    favorite: 'all', // all favorite states shown by default
    rating: 'all', // all ratings shown by default
    name: '',
    labels: [],
  }
const initialOrderState = 'name_asc'

// Category tags store
export const useTagsStore = create((set, get) => ({
  filters: initialFiltersState,
  order_by: initialOrderState,
  tags: [],
  tagsUnsorted: [],
  tagImagesNames: [],
  selectedTags: [],
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
      tagsUnsorted: tags,
      tags: filterAndSortTags(tags, get().filters, get().order_by),
      tagImagesNames,
      isLoading: false,
      isLoaded: true
    })
  },
  filterTags: () => {
    const tags = get().tagsUnsorted
    const filters = get().filters
    const order = get().order_by
    set({ tags: filterAndSortTags(tags, filters, order) })
  },
  setFilters: (filters) => {
    // set filters
    set({ filters })
    // filter tags
    get().filterTags()
  },
  setOrderBy: (order_by) => {
    // set order
    set({ order_by })
    // filter tags
    get().filterTags()
  },
  resetFilters: () => {
    set({ filters: initialFiltersState })
    get().filterTags()
  },
  resetOrderBy: () => {
    set({ order_by: initialOrderState })
    get().filterTags()
  },
  selectTag: (tag) => {
    // if tag is already selected, unselect it
    if (get().selectedTags.includes(tag)) {
      set({ selectedTags: get().selectedTags.filter((t) => t !== tag) })
    } else {
      // else, add it to the selected tags
      set({ selectedTags: [...get().selectedTags, tag] })
    }
  },
  unsetTags: () => set({
    tags: [],
    tagsUnsorted: [],
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
        tagsUnsorted: get().tagsUnsorted.map((tag) => {
          if (tag.id === updatedTag.id) {
            return updatedTag
          }
          return tag
        })
      })
      get().filterTags()
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
        tagsUnsorted: get().tagsUnsorted.filter((t) => t.id !== tag.id),
      })
      get().filterTags()
    }
  }
}))

export const useFilters = () => {
  return useTagsStore(({ filters }) => filters)
}

export const useOrder = () => {
  return useTagsStore(({ order_by }) => order_by)
}

export const useSetFilters = () => {
  return useTagsStore(({ setFilters }) => setFilters)
}

export const useSetOrderBy = () => {
  return useTagsStore(({ setOrderBy }) => setOrderBy)
}

export const useResetFilters = () => {
  return useTagsStore(({ resetFilters }) => resetFilters)
}

export const useResetOrderBy = () => {
  return useTagsStore(({ resetOrderBy }) => resetOrderBy)
}

export const useFetchTags = () => {
  return useTagsStore(({ fetchTags }) => fetchTags)
}

export const useRefilterTags = () => {
  return useTagsStore(({ refilterTags }) => refilterTags)
}

export const useTags = () => {
  return useTagsStore(({ tags }) => tags)
}

export const useSelectedTags = () => {
  return useTagsStore(({ selectedTags }) => selectedTags)
}

export const useSelectTag = () => {
  return useTagsStore(({ selectTag }) => selectTag)
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
