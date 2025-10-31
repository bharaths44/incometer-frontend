export interface PaymentMethodRequestDTO {
	name: string;
	displayName?: string;
	lastFourDigits?: string;
	issuerName?: string;
	type: string;
	icon?: string;
}

export interface PaymentMethodResponseDTO {
	paymentMethodId: number;
	name: string;
	displayName?: string;
	lastFourDigits?: string;
	issuerName?: string;
	type: string;
	icon?: string;
	createdAt: string;
}

export const PAYMENT_METHOD_TYPE_LABELS: Record<string, string> = {
	CASH: 'Cash',
	CREDIT_CARD: 'Credit Card',
	DEBIT_CARD: 'Debit Card',
	UPI: 'UPI',
	WALLET: 'Wallet',
	BANK_ACCOUNT: 'Bank Account',
	NET_BANKING: 'Net Banking',
	CHEQUE: 'Cheque',
	OTHER: 'Other',
};
