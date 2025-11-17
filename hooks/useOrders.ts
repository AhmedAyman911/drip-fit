import axiosInstance from "@/lib/axiosInstance";
import { Order, CreateOrderRequest } from '@/types/orderTypes';
import { APIDetail } from '@/types/ApiDetail';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const createOrder = async (data: CreateOrderRequest) => {
    const response = await axiosInstance.post<APIDetail<"order", Order>>('/api/orders', data);
    if (!response.data) {
        throw new Error("Empty response");
    }
    return response.data.object;
}
export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOrderRequest) => createOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};


const fetchOrders = async () => {
    const response = await axiosInstance.get<APIDetail<"orders", Order[]>>('/api/orders');
    if (!response.data) {
        throw new Error("Empty response");
    }
    return response.data.object;
};
export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};


const fetchOrderById = async (orderId: string) => {
    const response = await axiosInstance.get<APIDetail<"order", Order>>(`/api/orders/${orderId}`);
    if (!response.data) {
        throw new Error("Empty response");
    }
    return response.data.object;
};

export const useUseOrderById = (orderId: string) => {
    return useQuery({
        queryKey: ['orders', orderId],
        queryFn: () => fetchOrderById(orderId),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: !!orderId,
    });
};

const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const response = await axiosInstance.patch<APIDetail<"order", Order>>(`/api/orders/${orderId}`, { status });
    if (!response.data) {
        throw new Error("Empty response");
    }
    return response.data.object;
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: Order['status'] }) =>
            updateOrderStatus(orderId, status),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
        },
    });
};

const cancelOrder = async (orderId: string) => {
    const response = await axiosInstance.delete<{ message: string }>(`/api/orders/${orderId}`);
    if (!response.data) {
        throw new Error("Empty response");
    }
    return response.data;
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderId: string) => cancelOrder(orderId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
}