import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import axiosInstance from '@/lib/axiosInstance'
import { APIDetail } from '@/types/ApiDetail'
import { Item } from '@/types/ItemTypes'
import { Order } from '@/types/orderTypes'
import { OrderStatus } from '@/lib/orderStatus'

export interface AdminStats {
  revenue: number
  paidOrders: number
  productCount: number
  customerCount: number
  unitsInStock: number
  lowStockThreshold: number
  statusCounts: Partial<Record<OrderStatus, number>>
  lowStock: {
    id: string
    color: string
    size: string
    sku: string
    stock: number
    product: { id: string; title: string; imgSrc: string[] }
  }[]
  recentOrders: {
    id: string
    status: OrderStatus
    totalPrice: number
    createdAt: string
    user: { name: string | null; email: string }
    _count: { items: number }
  }[]
  dailyRevenue: { date: string; revenue: number; orders: number }[]
}

export interface AdminOrder extends Order {
  user: { name: string | null; email: string; image: string | null }
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
}

/** The message the API sent back, or a fallback when there isn't one. */
export function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = error.response?.data?.error
    if (typeof message === 'string') return message
  }
  return fallback
}

export const useAdminStats = () =>
  useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get<APIDetail<'admin-stats', AdminStats>>('/api/admin/stats')
      return response.data.object
    },
    staleTime: 1000 * 60,
  })

export const useAdminOrders = (page: number, status: OrderStatus | 'all', search: string) =>
  useQuery({
    queryKey: ['admin-orders', page, status, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (status !== 'all') params.set('status', status)
      if (search.trim()) params.set('search', search.trim())
      const response = await axiosInstance.get<
        APIDetail<'admin-orders', { orders: AdminOrder[]; pagination: Pagination }>
      >(`/api/admin/orders?${params.toString()}`)
      return response.data.object
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const response = await axiosInstance.patch<APIDetail<'admin-order', AdminOrder>>(
        `/api/admin/orders/${orderId}`,
        { status }
      )
      return response.data.object
    },
    onSuccess: () => {
      for (const key of ['admin-orders', 'admin-stats', 'orders']) {
        queryClient.invalidateQueries({ queryKey: [key] })
      }
    },
  })
}

export const useAdminProducts = (page: number, search: string) =>
  useQuery({
    queryKey: ['products', 'admin', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (search.trim()) params.set('search', search.trim())
      const response = await axiosInstance.get<
        APIDetail<'Products', { products: Item[]; pagination: Pagination }>
      >(`/api/products?${params.toString()}`)
      return response.data.object
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      await axiosInstance.delete(`/api/products/${productId}`)
    },
    onSuccess: () => {
      for (const key of ['products', 'new-arrivals', 'sale', 'admin-stats']) {
        queryClient.invalidateQueries({ queryKey: [key] })
      }
    },
  })
}
