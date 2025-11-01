import { useEffect, useState } from 'react';

import { updatePaymentMethod } from '@/services/paymentMethodService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
	PAYMENT_METHOD_TYPE_LABELS,
	PaymentMethodRequestDTO,
	PaymentMethodResponseDTO,
} from '@/types/paymentMethod';
import { PREDEFINED_ICONS } from '@/lib/constants';
import IconSelector from './IconSelector';

const PAYMENT_METHOD_TYPES = Object.keys(PAYMENT_METHOD_TYPE_LABELS);

interface UpdatePaymentMethodModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (paymentMethod: PaymentMethodResponseDTO) => void;
	paymentMethods: PaymentMethodResponseDTO[];
	paymentMethod: PaymentMethodResponseDTO | null;
	allLucideIcons: string[];
	predefinedIcons: string[];
}

export default function UpdatePaymentMethodModal({
	isOpen,
	onClose,
	onUpdate,
	paymentMethods,
	paymentMethod,
	allLucideIcons,
	predefinedIcons: propPredefinedIcons,
}: UpdatePaymentMethodModalProps) {
	const [name, setName] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [type, setType] = useState('');
	const [icon, setIcon] = useState('');
	const [lastFourDigits, setLastFourDigits] = useState('');
	const [issuerName, setIssuerName] = useState('');
	const [iconSearchQuery, setIconSearchQuery] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Populate form when paymentMethod changes
	useEffect(() => {
		if (paymentMethod) {
			setName(paymentMethod.name);
			setDisplayName(paymentMethod.displayName || '');
			setType(paymentMethod.type);
			setIcon(paymentMethod.icon || '');
			setLastFourDigits(paymentMethod.lastFourDigits || '');
			setIssuerName(paymentMethod.issuerName || '');
		}
	}, [paymentMethod]);

	const handleUpdatePaymentMethod = async () => {
		if (!name.trim() || !type || !paymentMethod) {
			setErrorMessage(
				'Please enter a payment method name and select a type'
			);
			return;
		}

		// Check if another payment method with the same name already exists (excluding current payment method)
		const existingPaymentMethod = paymentMethods.find(
			(pm) =>
				pm.name.toLowerCase() === name.trim().toLowerCase() &&
				pm.paymentMethodId !== paymentMethod.paymentMethodId
		);
		if (existingPaymentMethod) {
			setErrorMessage(
				'Another payment method with this name already exists!'
			);
			return;
		}

		try {
			const paymentMethodData: PaymentMethodRequestDTO = {
				name: name.trim(),
				displayName: displayName.trim() || undefined,
				type,
				icon: icon || undefined,
				lastFourDigits: lastFourDigits.trim() || undefined,
				issuerName: issuerName.trim() || undefined,
			};

			const updatedPaymentMethod = await updatePaymentMethod(
				paymentMethod.paymentMethodId,
				paymentMethodData
			);
			onUpdate(updatedPaymentMethod);
			handleClose();
		} catch (error) {
			console.error('Failed to update payment method:', error);
			setErrorMessage(
				'Failed to update payment method. Please try again.'
			);
		}
	};

	const handleClose = () => {
		setName('');
		setDisplayName('');
		setType('');
		setIcon('');
		setLastFourDigits('');
		setIssuerName('');
		setIconSearchQuery('');
		setErrorMessage(null);
		onClose();
	};

	if (!paymentMethod) return null;

	return (
		<>
			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>Update Payment Method</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<Label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Payment Method Name *
							</Label>
							<Input
								id='name'
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='e.g., HDFC Credit Card'
								required
							/>
						</div>
						<div>
							<Label
								htmlFor='displayName'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Display Name
							</Label>
							<Input
								id='displayName'
								type='text'
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								placeholder='e.g., HDFC Unnati Credit Card'
							/>
						</div>
						<div>
							<Label
								htmlFor='type'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Payment Method Type *
							</Label>
							<Select value={type} onValueChange={setType}>
								<SelectTrigger>
									<SelectValue placeholder='Select Type' />
								</SelectTrigger>
								<SelectContent>
									{PAYMENT_METHOD_TYPES.map((paymentType) => (
										<SelectItem
											key={paymentType}
											value={paymentType}
										>
											{paymentType.replace('_', ' ')}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label
								htmlFor='lastFourDigits'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Last 4 Digits
							</Label>
							<Input
								id='lastFourDigits'
								type='text'
								value={lastFourDigits}
								onChange={(e) =>
									setLastFourDigits(
										e.target.value
											.replace(/\D/g, '')
											.slice(0, 4)
									)
								}
								placeholder='1234'
								maxLength={4}
							/>
						</div>
						<div>
							<Label
								htmlFor='issuerName'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Issuer Name
							</Label>
							<Input
								id='issuerName'
								type='text'
								value={issuerName}
								onChange={(e) => setIssuerName(e.target.value)}
								placeholder='e.g., HDFC Bank'
							/>
						</div>
						<IconSelector
							selectedIcon={icon}
							onSelect={setIcon}
							searchQuery={iconSearchQuery}
							setSearchQuery={setIconSearchQuery}
							allIcons={allLucideIcons}
							predefinedIcons={
								propPredefinedIcons || PREDEFINED_ICONS
							}
						/>
						<div className='flex gap-3 pt-4'>
							<Button
								type='button'
								onClick={handleClose}
								variant='secondary'
								className='flex-1'
							>
								Cancel
							</Button>
							<Button
								type='button'
								onClick={handleUpdatePaymentMethod}
								className='flex-1'
								disabled={!name.trim() || !type}
							>
								Update
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={!!errorMessage}
				onOpenChange={() => setErrorMessage(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Error</AlertDialogTitle>
						<AlertDialogDescription>
							{errorMessage}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={() => setErrorMessage(null)}
						>
							OK
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
