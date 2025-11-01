import { useEffect, useState } from 'react';
import { TransactionConfig, TransactionRequestDTO, TransactionResponseDTO, } from '@/types/transaction.ts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import NewCategoryModal from '@/components/shared/NewCategoryModal';
import NewPaymentMethodModal from '@/components/shared/NewPaymentMethodModal';
import { Category } from '@/types/category';
import { PaymentMethodResponseDTO } from '@/types/paymentMethod';
import TransactionFormFields from './TransactionFormFields';
import { useTransactionFormData } from './TransactionFormHooks';

type FormData = {
	description: string;
	amount: string;
	categoryId: string;
	paymentMethodId: string;
	date: string;
	userId: number;
};

interface TransactionFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (dto: TransactionRequestDTO) => Promise<void>;
	editingTransaction: TransactionResponseDTO | null;
	initialData: FormData;
	config: TransactionConfig;
}

export default function TransactionFormModal({
	isOpen,
	onClose,
	onSubmit,
	editingTransaction,
	initialData,
	config,
}: TransactionFormModalProps) {
	const [formData, setFormData] = useState<FormData>(initialData);
	const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
	const [showNewPaymentMethodModal, setShowNewPaymentMethodModal] =
		useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		categories,
		paymentMethods,
		allLucideIcons,
		loadingCategories,
		loadingPaymentMethods,
		addCategory,
		addPaymentMethod,
		predefinedIcons,
	} = useTransactionFormData(initialData.userId, config.type, isOpen);

	useEffect(() => {
		setFormData(initialData);
	}, [initialData]);

	const handleCategoryChange = (value: string) => {
		if (value === 'new') {
			setShowNewCategoryModal(true);
		} else {
			setFormData({ ...formData, categoryId: value });
		}
	};

	const handlePaymentMethodChange = (value: string) => {
		if (value === 'new') {
			setShowNewPaymentMethodModal(true);
		} else {
			setFormData({ ...formData, paymentMethodId: value });
		}
	};

	const handleCategoryCreate = (newCategory: Category) => {
		addCategory(newCategory);
		setFormData({
			...formData,
			categoryId: newCategory.categoryId.toString(),
		});
	};

	const handlePaymentMethodCreate = (
		newPaymentMethod: PaymentMethodResponseDTO
	) => {
		addPaymentMethod(newPaymentMethod);
		setFormData({
			...formData,
			paymentMethodId: newPaymentMethod.paymentMethodId.toString(),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
			setErrorMessage('Please enter a valid amount greater than 0');
			return;
		}
		if (!formData.categoryId) {
			setErrorMessage('Please select a category');
			return;
		}
		if (!formData.paymentMethodId) {
			setErrorMessage(
				`Please select a ${config.type === 'income' ? 'received method' : 'payment method'}`
			);
			return;
		}
		if (!formData.date) {
			setErrorMessage(
				`Please select a ${config.formLabels.date.toLowerCase()}`
			);
			return;
		}

		const dto: TransactionRequestDTO = {
			userId: formData.userId,
			categoryId: parseInt(formData.categoryId),
			amount: parseFloat(formData.amount),
			description: formData.description.trim(),
			paymentMethodId: parseInt(formData.paymentMethodId),
			transactionDate: formData.date,
			transactionType: config.type === 'expense' ? 'EXPENSE' : 'INCOME',
		};
		await onSubmit(dto);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>
							{editingTransaction
								? `Edit ${config.formTitle}`
								: `Add New ${config.formTitle}`}
						</DialogTitle>
					</DialogHeader>

					<TransactionFormFields
						formData={formData}
						onFormDataChange={(data) =>
							setFormData({ ...formData, ...data })
						}
						categories={categories}
						paymentMethods={paymentMethods}
						loadingCategories={loadingCategories}
						loadingPaymentMethods={loadingPaymentMethods}
						onCategoryChange={handleCategoryChange}
						onPaymentMethodChange={handlePaymentMethodChange}
						config={config}
					/>

					<div className='flex gap-3 pt-4'>
						<Button
							type='button'
							onClick={onClose}
							variant='secondary'
							className='flex-1'
						>
							Cancel
						</Button>
						<Button
							type='submit'
							onClick={handleSubmit}
							className='flex-1'
						>
							{editingTransaction
								? `Update ${config.formTitle}`
								: `Add ${config.formTitle}`}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<NewCategoryModal
				isOpen={showNewCategoryModal}
				onClose={() => setShowNewCategoryModal(false)}
				onCreate={handleCategoryCreate}
				categories={categories}
				userId={initialData.userId}
				allLucideIcons={allLucideIcons}
				predefinedIcons={predefinedIcons}
				defaultType={config.type === 'expense' ? 'EXPENSE' : 'INCOME'}
			/>

			<NewPaymentMethodModal
				isOpen={showNewPaymentMethodModal}
				onClose={() => setShowNewPaymentMethodModal(false)}
				onCreate={handlePaymentMethodCreate}
				paymentMethods={paymentMethods}
				userId={initialData.userId}
				allLucideIcons={allLucideIcons}
				predefinedIcons={predefinedIcons}
			/>

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
						<AlertDialogAction>OK</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
