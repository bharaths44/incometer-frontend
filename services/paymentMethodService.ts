import {
	PaymentMethodRequestDTO,
	PaymentMethodResponseDTO,
} from '@/types/paymentMethod';
import { API_BASE_URL } from '@/lib/constants';
import { authenticatedFetch } from '@/lib/authFetch';

const API_BASE_URL_PAYMENT_METHODS = `${API_BASE_URL}/payment-methods`;

export const getAllPaymentMethods = async (
	userId: string
): Promise<PaymentMethodResponseDTO[]> => {
	const response = await authenticatedFetch(
		`${API_BASE_URL_PAYMENT_METHODS}/user/${userId}`
	);
	if (!response.ok) {
		throw new Error('Failed to fetch payment methods');
	}
	return response.json();
};

export const createPaymentMethod = async (
	paymentMethod: PaymentMethodRequestDTO,
	userId?: string
): Promise<PaymentMethodResponseDTO> => {
	const url = userId
		? `${API_BASE_URL_PAYMENT_METHODS}?userId=${userId}`
		: API_BASE_URL_PAYMENT_METHODS;
	const response = await authenticatedFetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(paymentMethod),
	});
	if (!response.ok) {
		const errorText = await response.text();
		console.error('Payment method creation failed:', errorText);
		throw new Error('Failed to create payment method');
	}
	return response.json();
};

export const updatePaymentMethod = async (
	id: number,
	paymentMethod: PaymentMethodRequestDTO
): Promise<PaymentMethodResponseDTO> => {
	const response = await authenticatedFetch(
		`${API_BASE_URL_PAYMENT_METHODS}/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(paymentMethod),
		}
	);
	if (!response.ok) {
		const errorText = await response.text();
		console.error('Payment method update failed:', errorText);
		throw new Error('Failed to update payment method');
	}
	const updatedPaymentMethod = await response.json();
	return updatedPaymentMethod;
};

export const deletePaymentMethod = async (
	id: number,
	userId: string
): Promise<void> => {
	const response = await authenticatedFetch(
		`${API_BASE_URL_PAYMENT_METHODS}/${userId}/${id}`,
		{
			method: 'DELETE',
		}
	);
	if (!response.ok) {
		const errorText = await response.text();
		console.error('Payment method deletion failed:', errorText);
		throw new Error('Failed to delete payment method');
	}
};
