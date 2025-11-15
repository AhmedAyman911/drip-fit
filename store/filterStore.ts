import { create } from 'zustand'

interface FilterState {
    gender: string[] | null;
    colors: string[] | null;
    sizes: string[] | null;
    category: string[] | null;
    minPrice: number | null;
    maxPrice: number | null;

    setGender: (gender: string[] | null) => void;
    setCategory: (category: string[] | null) => void;
    setColors: (colors: string[] | null) => void;
    setSizes: (sizes: string[] | null) => void;
    setMinPrice: (minPrice: number | null) => void;
    setMaxPrice: (maxPrice: number | null) => void;
    resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
        (set) => ({
            category: null,
            colors: null,
            sizes: null,
            minPrice: null,
            maxPrice: null,
            gender: null,

            setGender: (gender) => set({ gender }),
            setCategory: (category) => set({ category }),
            setColors: (colors) => set({ colors }),
            setSizes: (sizes) => set({ sizes }),
            setMinPrice: (minPrice) => set({ minPrice }),
            setMaxPrice: (maxPrice) => set({ maxPrice }),
            resetFilters: () =>
                set({
                    gender: null,
                    category: null,
                    colors: null,
                    sizes: null,
                    minPrice: null,
                    maxPrice: null,
                }),
        }),
        
);