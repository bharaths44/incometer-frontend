import {
	getAllPaymentMethods,
	createPaymentMethod,
	updatePaymentMethod,
	deletePaymentMethod,
} from '@/services/paymentMethodService';
import {
	PaymentMethodRequestDTO,
	PaymentMethodResponseDTO,
} from '@/types/paymentMethod';

// Mock the authenticatedFetch function
jest.mock('@/lib/authFetch', () => ({
	authenticatedFetch: jest.fn(),
}));

import { authenticatedFetch } from '@/lib/authFetch';

const mockAuthenticatedFetch = authenticatedFetch as jest.MockedFunction<
	typeof authenticatedFetch
>;

describe('paymentMethodService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getAllPaymentMethods', () => {
		it('should get all payment methods successfully', async () => {
			const mockResponse: PaymentMethodResponseDTO[] = [
				{
					paymentMethodId: 1,
					name: 'Credit Card',
					displayName: 'Visa **** 1234',
					lastFourDigits: '1234',
					issuerName: 'Visa',
					type: 'CREDIT_CARD',
					icon: 'credit-card',
					createdAt: '2024-01-01T00:00:00Z',
				},
				{
					paymentMethodId: 2,
					name: 'Cash',
					type: 'CASH',
					icon: 'cash',
					createdAt: '2024-01-01T00:00:00Z',
				},
			];

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			} as Response);

			const result = await getAllPaymentMethods('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/payment-methods/user/1'
			);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error when getting payment methods fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			} as Response);

			await expect(getAllPaymentMethods('1')).rejects.toThrow(
				'Failed to fetch payment methods'
			);
		});
	});

	describe('createPaymentMethod', () => {
		it('should create payment method successfully with userId', async () => {
			const paymentMethodRequest: PaymentMethodRequestDTO = {
				name: 'Credit Card',
				displayName: 'Visa **** 1234',
				lastFourDigits: '1234',
				issuerName: 'Visa',
				type: 'CREDIT_CARD',
				icon: 'credit-card',
			};

			const mockResponse: PaymentMethodResponseDTO = {
				paymentMethodId: 1,
				name: 'Credit Card',
				displayName: 'Visa **** 1234',
				lastFourDigits: '1234',
				issuerName: 'Visa',
				type: 'CREDIT_CARD',
				icon: 'credit-card',
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => mockResponse,
			} as Response);

			const result = await createPaymentMethod(paymentMethodRequest, '1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/payment-methods?userId=1',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(paymentMethodRequest),
				}
			);
			expect(result).toEqual(mockResponse);
		});

		it('should create payment method successfully without userId', async () => {
			const paymentMethodRequest: PaymentMethodRequestDTO = {
				name: 'Cash',
				type: 'CASH',
				icon: 'cash',
			};

			const mockResponse: PaymentMethodResponseDTO = {
				paymentMethodId: 2,
				name: 'Cash',
				type: 'CASH',
				icon: 'cash',
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => mockResponse,
			} as Response);

			const result = await createPaymentMethod(paymentMethodRequest);

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/payment-methods',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(paymentMethodRequest),
				}
			);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error when creation fails', async () => {
			const paymentMethodRequest: PaymentMethodRequestDTO = {
				name: 'Credit Card',
				type: 'CREDIT_CARD',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				text: async () => 'Invalid payment method data',
			} as Response);

			await expect(
				createPaymentMethod(paymentMethodRequest)
			).rejects.toThrow('Failed to create payment method');
		});
	});

	describe('updatePaymentMethod', () => {
		it('should update payment method successfully', async () => {
			const paymentMethodRequest: PaymentMethodRequestDTO = {
				name: 'Updated Credit Card',
				displayName: 'Mastercard **** 5678',
				lastFourDigits: '5678',
				issuerName: 'Mastercard',
				type: 'CREDIT_CARD',
				icon: 'credit-card',
			};

			const mockResponse: PaymentMethodResponseDTO = {
				paymentMethodId: 1,
				name: 'Updated Credit Card',
				displayName: 'Mastercard **** 5678',
				lastFourDigits: '5678',
				issuerName: 'Mastercard',
				type: 'CREDIT_CARD',
				icon: 'credit-card',
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			} as Response);

			const result = await updatePaymentMethod(1, paymentMethodRequest);

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/payment-methods/1',
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(paymentMethodRequest),
				}
			);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error when update fails', async () => {
			const paymentMethodRequest: PaymentMethodRequestDTO = {
				name: 'Credit Card',
				type: 'CREDIT_CARD',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found',
				text: async () => 'Payment method not found',
			} as Response);

			await expect(
				updatePaymentMethod(1, paymentMethodRequest)
			).rejects.toThrow('Failed to update payment method');
		});
	});

	describe('deletePaymentMethod', () => {
		it('should delete payment method successfully', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 204,
			} as Response);

			await expect(deletePaymentMethod(1, '1')).resolves.toBeUndefined();

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/payment-methods/1/1',
				{
					method: 'DELETE',
				}
			);
		});

		it('should throw error when deletion fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found',
				text: async () => 'Payment method not found',
			} as Response);

			await expect(deletePaymentMethod(1, '1')).rejects.toThrow(
				'Failed to delete payment method'
			);
		});
	});
});
