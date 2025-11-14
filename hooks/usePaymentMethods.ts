import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createPaymentMethod,
	deletePaymentMethod,
	getAllPaymentMethods,
	updatePaymentMethod,
} from '@/services/paymentMethodService';
import { PaymentMethodRequestDTO } from '@/types/paymentMethod';

// Query keys
export const paymentMethodKeys = {
	all: ['paymentMethods'] as const,
	lists: () => [...paymentMethodKeys.all, 'list'] as const,
	list: (userId: string) => [...paymentMethodKeys.lists(), userId] as const,
};

// Hooks
export const usePaymentMethods = (userId: string) => {
	return useQuery({
		queryKey: paymentMethodKeys.list(userId),
		queryFn: () => getAllPaymentMethods(userId),
		enabled: !!userId,
		staleTime: 30000, // Cache for 30 seconds
	});
};

export const useCreatePaymentMethod = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			paymentMethod,
			userId,
		}: {
			paymentMethod: PaymentMethodRequestDTO;
			userId: string;
		}) => createPaymentMethod(paymentMethod, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: paymentMethodKeys.lists(),
			});
		},
	});
};

export const useUpdatePaymentMethod = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			paymentMethod,
		}: {
			id: number;
			paymentMethod: PaymentMethodRequestDTO;
		}) => updatePaymentMethod(id, paymentMethod),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: paymentMethodKeys.lists(),
			});
		},
	});
};

export const useDeletePaymentMethod = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, userId }: { id: number; userId: string }) =>
			deletePaymentMethod(id, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: paymentMethodKeys.lists(),
			});
		},
	});
};
