import { Item as productTypes } from '@/types/ItemTypes';
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axiosInstance';
import { APIDetail } from '@/types/ApiDetail';

const fetchProductByID = async (id: string) => {
    const response = await axiosInstance.get<APIDetail<"Product", productTypes>>(`/api/products/${id}`)
    if (!response.data) {
        throw new Error("Empty response");
    }
    return response.data.object
}


export const useSingleProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductByID(id),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })
}