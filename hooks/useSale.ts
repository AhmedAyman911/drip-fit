import { useQuery } from '@tanstack/react-query'
import axiosInstance from "@/lib/axiosInstance"
import { APIDetail } from '@/types/ApiDetail'
import { Item as productTypes } from '@/types/ItemTypes'

const fetchSale = async () => {
  const response = await axiosInstance.get<APIDetail<"sale", productTypes[]>>("/api/products/sale")
  if (!response.data) {
    throw new Error("Empty response");
  }
  return response.data.object
}

export const useSale = () => {
  return useQuery({
    queryKey: ['sale'],
    queryFn: fetchSale,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  })
}
