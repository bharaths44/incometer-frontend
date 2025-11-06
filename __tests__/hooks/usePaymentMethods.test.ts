import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
	usePaymentMethods,
	useCreatePaymentMethod,
	useUpdatePaymentMethod,
	useDeletePaymentMethod,
	paymentMethodKeys,
} from '@/hooks/usePaymentMethods';
import type {
	PaymentMethodResponseDTO,
	PaymentMethodRequestDTO,
} from '@/types/paymentMethod';

// Mock the payment method service functions
jest.mock('@/services/paymentMethodService', () => ({
	getAllPaymentMethods: jest.fn(),
	createPaymentMethod: jest.fn(),
	updatePaymentMethod: jest.fn(),
	deletePaymentMethod: jest.fn(),
}));

import {
	getAllPaymentMethods,
	createPaymentMethod,
	updatePaymentMethod,
	deletePaymentMethod,
} from '@/services/paymentMethodService';

const mockGetAllPaymentMethods = getAllPaymentMethods as jest.MockedFunction<
	typeof getAllPaymentMethods
>;
const mockCreatePaymentMethod = createPaymentMethod as jest.MockedFunction<
	typeof createPaymentMethod
>;
const mockUpdatePaymentMethod = updatePaymentMethod as jest.MockedFunction<
	typeof updatePaymentMethod
>;
const mockDeletePaymentMethod = deletePaymentMethod as jest.MockedFunction<
	typeof deletePaymentMethod
>;

// Create a test wrapper with QueryClient
const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});

	const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
		return React.createElement(
			QueryClientProvider,
			{ client: queryClient },
			children
		);
	};

	return Wrapper;
};

describe('usePaymentMethods', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('paymentMethodKeys', () => {
		it('should generate correct list key', () => {
			const key = paymentMethodKeys.list('1');

			expect(key).toEqual(['paymentMethods', 'list', '1']);
		});
	});

	describe('usePaymentMethods', () => {
		it('should fetch payment methods successfully', async () => {
			const mockPaymentMethods: PaymentMethodResponseDTO[] = [
				{
					paymentMethodId: 1,
					name: 'Credit Card',
					type: 'CREDIT_CARD',
					createdAt: '2024-01-01T00:00:00Z',
				},
				{
					paymentMethodId: 2,
					name: 'Cash',
					type: 'CASH',
					createdAt: '2024-01-01T00:00:00Z',
				},
			];

			mockGetAllPaymentMethods.mockResolvedValueOnce(mockPaymentMethods);

			const { result } = renderHook(() => usePaymentMethods('1'), {
				wrapper: createWrapper(),
			});

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockPaymentMethods);
			expect(mockGetAllPaymentMethods).toHaveBeenCalledWith('1');
		});

		it('should handle error when fetching payment methods fails', async () => {
			const error = new Error('Failed to fetch payment methods');
			mockGetAllPaymentMethods.mockRejectedValueOnce(error);

			const { result } = renderHook(() => usePaymentMethods('1'), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});

		it('should be disabled when userId is not provided', () => {
			const { result } = renderHook(() => usePaymentMethods(''), {
				wrapper: createWrapper(),
			});

			expect(result.current.isFetching).toBe(false);
			expect(mockGetAllPaymentMethods).not.toHaveBeenCalled();
		});
	});

	describe('useCreatePaymentMethod', () => {
		it('should create payment method successfully', async () => {
			const paymentMethodRequest: PaymentMethodRequestDTO = {
				name: 'Debit Card',
				type: 'DEBIT_CARD',
			};

			const mockPaymentMethod: PaymentMethodResponseDTO = {
				paymentMethodId: 3,
				name: 'Debit Card',
				type: 'DEBIT_CARD',
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockCreatePaymentMethod.mockResolvedValueOnce(mockPaymentMethod);

			const { result } = renderHook(() => useCreatePaymentMethod(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({
				paymentMethod: paymentMethodRequest,
				userId: '1',
			});

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockPaymentMethod);
			expect(mockCreatePaymentMethod).toHaveBeenCalledTimes(1);
			expect(mockCreatePaymentMethod).toHaveBeenCalledWith(
				paymentMethodRequest,
				'1'
			);
		});

		it('should handle error when creating payment method fails', async () => {
			const error = new Error('Failed to create payment method');
			const paymentMethodRequest: PaymentMethodRequestDTO = {
				name: 'Test',
				type: 'CASH',
			};

			mockCreatePaymentMethod.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useCreatePaymentMethod(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({
				paymentMethod: paymentMethodRequest,
				userId: '1',
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});

	describe('useUpdatePaymentMethod', () => {
		it('should update payment method successfully', async () => {
			const paymentMethodRequest: PaymentMethodRequestDTO = {
				name: 'Updated Credit Card',
				type: 'CREDIT_CARD',
			};

			const mockPaymentMethod: PaymentMethodResponseDTO = {
				paymentMethodId: 1,
				name: 'Updated Credit Card',
				type: 'CREDIT_CARD',
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockUpdatePaymentMethod.mockResolvedValueOnce(mockPaymentMethod);

			const { result } = renderHook(() => useUpdatePaymentMethod(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({
				id: 1,
				paymentMethod: paymentMethodRequest,
			});

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockPaymentMethod);
			expect(mockUpdatePaymentMethod).toHaveBeenCalledTimes(1);
			expect(mockUpdatePaymentMethod).toHaveBeenCalledWith(
				1,
				paymentMethodRequest
			);
		});

		it('should handle error when updating payment method fails', async () => {
			const error = new Error('Failed to update payment method');
			const paymentMethodRequest: PaymentMethodRequestDTO = {
				name: 'Test',
				type: 'CASH',
			};

			mockUpdatePaymentMethod.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useUpdatePaymentMethod(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({
				id: 1,
				paymentMethod: paymentMethodRequest,
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});

	describe('useDeletePaymentMethod', () => {
		it('should delete payment method successfully', async () => {
			mockDeletePaymentMethod.mockResolvedValueOnce(undefined);

			const { result } = renderHook(() => useDeletePaymentMethod(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, userId: '1' });

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toBeUndefined();
			expect(mockDeletePaymentMethod).toHaveBeenCalledTimes(1);
			expect(mockDeletePaymentMethod).toHaveBeenCalledWith(1, '1');
		});

		it('should handle error when deleting payment method fails', async () => {
			const error = new Error('Failed to delete payment method');

			mockDeletePaymentMethod.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useDeletePaymentMethod(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, userId: '1' });

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});
});
