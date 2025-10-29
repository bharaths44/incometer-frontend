import { PaymentMethodRequestDTO, PaymentMethodResponseDTO } from "@/types/paymentMethod";
import { API_BASE_URL } from "@/lib/constants";


const API_BASE_URL_PAYMENT_METHODS = `${API_BASE_URL}/payment-methods`;

export const getAllPaymentMethods = async (userId: number): Promise<PaymentMethodResponseDTO[]> => {
    console.log('Fetching payment methods for user:', userId);
    const response = await fetch(`${API_BASE_URL_PAYMENT_METHODS}/user/${userId}`);
    console.log('Response status:', response.status);
    if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
    }
    return response.json();
};

export const createPaymentMethod = async (paymentMethod: PaymentMethodRequestDTO, userId?: number): Promise<PaymentMethodResponseDTO> => {
    console.log('Creating payment method:', paymentMethod);
    const url = userId ? `${API_BASE_URL_PAYMENT_METHODS}?userId=${userId}` : API_BASE_URL_PAYMENT_METHODS;
    const response = await fetch(url, {
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

export const getPaymentMethodById = async (id: number): Promise<PaymentMethodResponseDTO> => {
    const response = await fetch(`${API_BASE_URL_PAYMENT_METHODS}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch payment method');
    }
    return response.json();
};