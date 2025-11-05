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
	console.log('Fetching payment methods for user:', userId);
	const response = await authenticatedFetch(
		`${API_BASE_URL_PAYMENT_METHODS}/user/${userId}`
	);
	console.log('Response status:', response.status);
	if (!response.ok) {
		throw new Error('Failed to fetch payment methods');
	}
	return response.json();
};

export const createPaymentMethod = async (
	paymentMethod: PaymentMethodRequestDTO,
	userId?: string
): Promise<PaymentMethodResponseDTO> => {
	console.log('Creating payment method:', paymentMethod);
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
	console.log('Response status:', response.status);
	if (!response.ok) {
		const errorText = await response.text();
		console.log('Error response:', errorText);
		throw new Error('Failed to create payment method');
	}
	return response.json();
};

export const updatePaymentMethod = async (
	id: number,
	paymentMethod: PaymentMethodRequestDTO
): Promise<PaymentMethodResponseDTO> => {
	console.log('Updating payment method:', id, paymentMethod);
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
	console.log('Response status:', response.status);
	if (!response.ok) {
		const errorText = await response.text();
		console.log('Error response:', errorText);
		throw new Error('Failed to update payment method');
	}
	const updatedPaymentMethod = await response.json();
	return updatedPaymentMethod;
};

export const deletePaymentMethod = async (
	id: number,
	userId: string
): Promise<void> => {
	console.log('Deleting payment method:', id, 'for user:', userId);
	const response = await authenticatedFetch(
		`${API_BASE_URL_PAYMENT_METHODS}/${userId}/${id}`,
		{
			method: 'DELETE',
		}
	);
	console.log('Response status:', response.status);
	if (!response.ok) {
		const errorText = await response.text();
		console.log('Error response:', errorText);
		throw new Error('Failed to delete payment method');
	}
};
