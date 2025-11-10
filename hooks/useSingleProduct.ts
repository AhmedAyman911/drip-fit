import { Item as ItemType } from '@/types/ItemTypes';
import { useQuery } from '@tanstack/react-query'

export const useSingleProduct = (id: string | undefined) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async (): Promise<ItemType> => {
            if (!id) throw new Error('Product ID is required')

            const res = await fetch(`/api/products/${id}`)
            if (!res.ok) throw new Error('Failed to fetch product')
            return res.json()
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })
}