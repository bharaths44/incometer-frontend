import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createPaymentMethod,
	deletePaymentMethod,
	getAllPaymentMethods,
	updatePaymentMethod,
} from '../services/paymentMethodService';
import { PaymentMethodRequestDTO } from '../types/paymentMethod';

// Query keys
export const paymentMethodKeys = {
	all: ['paymentMethods'] as const,
	lists: () => [...paymentMethodKeys.all, 'list'] as const,
	list: (userId: number) => [...paymentMethodKeys.lists(), userId] as const,
};

// Hooks
export const usePaymentMethods = (userId: number) => {
	return useQuery({
		queryKey: paymentMethodKeys.list(userId),
		queryFn: () => getAllPaymentMethods(userId),
		enabled: !!userId,
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
			userId: number;
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
		mutationFn: ({ id, userId }: { id: number; userId: number }) =>
			deletePaymentMethod(id, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: paymentMethodKeys.lists(),
			});
		},
	});
};
