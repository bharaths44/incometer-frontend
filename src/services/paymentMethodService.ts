import { PaymentMethodRequestDTO, PaymentMethodResponseDTO } from "@/types/paymentMethod";


const API_BASE_URL = 'http://localhost:8080/api/payment-methods';

export const getAllPaymentMethods = async (userId: number): Promise<PaymentMethodResponseDTO[]> => {
    console.log('Fetching payment methods for user:', userId);
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    console.log('Response status:', response.status);
    if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
    }
    return response.json();
};

export const createPaymentMethod = async (paymentMethod: PaymentMethodRequestDTO, userId?: number): Promise<PaymentMethodResponseDTO> => {
    console.log('Creating payment method:', paymentMethod);
    const url = userId ? `${API_BASE_URL}?userId=${userId}` : API_BASE_URL;
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
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch payment method');
    }
    return response.json();
};