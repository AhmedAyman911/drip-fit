import { useQuery } from '@tanstack/react-query'
import axiosInstance from "@/lib/axiosInstance"
import { APIDetail } from '@/types/ApiDetail'
import { Item as productTypes } from '@/types/ItemTypes'
import { useFilterStore } from '@/store/filterStore'

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProductsWithPagination {
  products: productTypes[];
  pagination: PaginationInfo;
}

interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string | null;
  gender?: string[] | null;
  colors?: string[] | null;
  sizes?: string[] | null;
  category?: string[] | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}

const fetchProducts = async ({
  page = 1,
  limit = 12,
  search,
  gender,
  colors,
  sizes,
  category,
  minPrice,
  maxPrice
}: FetchProductsParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search.trim()) params.append('search', search.trim());
  if (gender && gender.length > 0) params.append('gender', gender.join(','));
  if (colors && colors.length > 0) params.append('colors', colors.join(','));
  if (sizes && sizes.length > 0) params.append('sizes', sizes.join(','));
  if (category && category.length > 0) params.append('category', category.join(','));
  if (minPrice !== null && minPrice !== undefined) params.append('minPrice', minPrice.toString());
  if (maxPrice !== null && maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());

  const response = await axiosInstance.get<APIDetail<"Products", ProductsWithPagination>>(
    `/api/products?${params.toString()}`
  )

  if (!response.data) {
    throw new Error("Empty response");
  }

  return response.data.object
}

export const useProducts = (page: number = 1, limit: number = 12, search?: string | null) => {
  const { gender, colors, sizes, category, minPrice, maxPrice } = useFilterStore();
  return useQuery({
    queryKey: ['products', page, limit, search],
    queryFn: () => fetchProducts({
      page,
      limit,
      search,
      gender,
      colors,
      sizes,
      category,
      minPrice,
      maxPrice
    }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const useSearchSuggestions = (searchTerm: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['search-suggestions', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) {
        return { products: [], pagination: null };
      }

      const response = await axiosInstance.get<APIDetail<"Products", ProductsWithPagination>>(
        `/api/products?search=${encodeURIComponent(searchTerm.trim())}&limit=5`
      );

      if (!response.data) {
        throw new Error("Empty response");
      }

      return response.data.object;
    },
    enabled: enabled && searchTerm.trim().length > 0,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}