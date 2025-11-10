import { useQuery } from '@tanstack/react-query'

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Failed to fetch products')
      return res.json()
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
