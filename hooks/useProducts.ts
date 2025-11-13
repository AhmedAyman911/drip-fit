import { useQuery } from '@tanstack/react-query'
import axiosInstance from "@/lib/axiosInstance"
import { APIDetail } from '@/types/ApiDetail'
import { Item as productTypes } from '@/types/ItemTypes'

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

const fetchProducts = async (page: number = 1, limit: number = 12) => {
  const response = await axiosInstance.get<APIDetail<"Products", ProductsWithPagination>>(
    `/api/products?page=${page}&limit=${limit}`
  )
  if (!response.data) {
    throw new Error("Empty response");
  }
  return response.data.object
}

export const useProducts = (page: number = 1, limit: number = 12) => {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => fetchProducts(page, limit),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}