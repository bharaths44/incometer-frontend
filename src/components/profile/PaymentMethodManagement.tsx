import { useState } from 'react';
import {
	usePaymentMethods,
	useDeletePaymentMethod,
} from '@/hooks/usePaymentMethods';
import ItemManagement from '@/components/profile/ItemManagement';
import NewPaymentMethodModal from '@/components/shared/NewPaymentMethodModal';
import UpdatePaymentMethodModal from '@/components/shared/UpdatePaymentMethodModal';
import {
	PaymentMethodResponseDTO,
	PAYMENT_METHOD_TYPE_LABELS,
} from '@/types/paymentMethod';
import { PREDEFINED_ICONS } from '@/lib/constants';
import { Icon } from '@/lib/iconUtils';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';

interface PaymentMethodManagementProps {
	userId: number;
	allLucideIcons: string[];
}

export default function PaymentMethodManagement({
	userId,
	allLucideIcons,
}: PaymentMethodManagementProps) {
	const { data: paymentMethods = [], isLoading } = usePaymentMethods(userId);
	const deletePaymentMethodMutation = useDeletePaymentMethod();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [paymentMethodToDelete, setPaymentMethodToDelete] =
		useState<PaymentMethodResponseDTO | null>(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<PaymentMethodResponseDTO | null>(null);

	const handleUpdatePaymentMethod = (
		paymentMethod: PaymentMethodResponseDTO
	) => {
		setSelectedPaymentMethod(paymentMethod);
		setIsUpdateModalOpen(true);
	};

	const handleDeletePaymentMethod = (
		paymentMethod: PaymentMethodResponseDTO
	) => {
		setPaymentMethodToDelete(paymentMethod);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeletePaymentMethod = () => {
		if (paymentMethodToDelete) {
			deletePaymentMethodMutation.mutate(
				{
					id: paymentMethodToDelete.paymentMethodId,
					userId,
				},
				{
					onSuccess: () => {
						setIsDeleteDialogOpen(false);
						setPaymentMethodToDelete(null);
					},
				}
			);
		}
	};

	const handleCreatePaymentMethod = (
		paymentMethod: PaymentMethodResponseDTO
	) => {
		// The mutation will handle cache invalidation
		console.log('Payment method created:', paymentMethod);
	};

	const renderPaymentMethodItem = (
		paymentMethod: PaymentMethodResponseDTO
	) => (
		<div
			key={paymentMethod.paymentMethodId}
			className='flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow'
		>
			<div className='flex items-center gap-3'>
				<div className='w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center'>
					<Icon
						name={paymentMethod.icon || 'credit-card'}
						className='w-5 h-5 text-gray-600'
					/>
				</div>
				<div>
					<div className='font-medium'>
						{paymentMethod.displayName || paymentMethod.name}
					</div>
					<div className='text-sm text-gray-500 capitalize'>
						{PAYMENT_METHOD_TYPE_LABELS[paymentMethod.type] ||
							paymentMethod.type}
					</div>
				</div>
			</div>
			<div className='flex items-center gap-2'>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => handleUpdatePaymentMethod(paymentMethod)}
					className='h-8 w-8 p-0 hover:bg-blue-50'
				>
					<Edit2 className='h-4 w-4' />
				</Button>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => handleDeletePaymentMethod(paymentMethod)}
					className='h-8 w-8 p-0 hover:bg-red-50'
				>
					<Trash2 className='h-4 w-4 text-red-600' />
				</Button>
			</div>
		</div>
	);

	return (
		<>
			<ItemManagement
				title='Payment Methods'
				items={paymentMethods}
				isLoading={isLoading}
				searchPlaceholder='Search payment methods...'
				onAddClick={() => setIsModalOpen(true)}
				renderItem={renderPaymentMethodItem}
				addButtonText='Add Payment Method'
			/>

			<NewPaymentMethodModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onCreate={handleCreatePaymentMethod}
				paymentMethods={paymentMethods}
				userId={userId}
				allLucideIcons={allLucideIcons}
				predefinedIcons={PREDEFINED_ICONS}
			/>

			<UpdatePaymentMethodModal
				isOpen={isUpdateModalOpen}
				onClose={() => setIsUpdateModalOpen(false)}
				onUpdate={handleUpdatePaymentMethod}
				paymentMethods={paymentMethods}
				paymentMethod={selectedPaymentMethod}
				allLucideIcons={allLucideIcons}
				predefinedIcons={PREDEFINED_ICONS}
			/>

			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2'>
							<AlertTriangle className='h-5 w-5 text-red-600' />
							Delete Payment Method
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete "
							{paymentMethodToDelete?.displayName ||
								paymentMethodToDelete?.name}
							"? This action cannot be undone and may affect
							existing transactions.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant='destructive'
							onClick={confirmDeletePaymentMethod}
							disabled={deletePaymentMethodMutation.isPending}
						>
							{deletePaymentMethodMutation.isPending
								? 'Deleting...'
								: 'Delete'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
