import { useQuery } from '@tanstack/react-query'
import axiosInstance from "@/lib/axiosInstance"
import { APIDetail } from '@/types/ApiDetail'
import { Item as productTypes } from '@/types/ItemTypes'

const fetchNewArrivals = async () => {
  const response = await axiosInstance.get<APIDetail<"new-arrivals", productTypes[]>>("/api/products/new")
  if (!response.data) {
    throw new Error("Empty response");
  }
  return response.data.object
}

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchNewArrivals,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  })
}
