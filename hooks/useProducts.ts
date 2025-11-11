import { useQuery } from '@tanstack/react-query'
import axiosInstance from "@/lib/axiosInstance"
import { APIDetail } from '@/types/ApiDetail'
import { Item as productTypes } from '@/types/ItemTypes'

const fetchProducts = async () => {
  const response = await axiosInstance.get<APIDetail<"Products", productTypes[]>>("/api/products")
  if (!response.data) {
    throw new Error("Empty response");
  }
  return response.data.object
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
