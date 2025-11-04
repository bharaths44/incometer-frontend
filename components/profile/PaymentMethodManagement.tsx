'use client';

import { Plus, Edit2, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PaymentMethodManagementLogic } from './PaymentMethodManagementLogic';
import NewPaymentMethodModal from '@/components/shared/NewPaymentMethodModal';
import UpdatePaymentMethodModal from '@/components/shared/UpdatePaymentMethodModal';
import Icon from '@/lib/iconUtils';
import {
	PaymentMethodResponseDTO,
	PAYMENT_METHOD_TYPE_LABELS,
} from '@/types/paymentMethod';
import { PREDEFINED_ICONS } from '@/lib/constants';

interface PaymentMethodManagementProps {
	userId: number;
}

export function PaymentMethodManagement({
	userId,
}: PaymentMethodManagementProps) {
	const {
		paymentMethods,
		isLoading,
		isCreateModalOpen,
		isUpdateModalOpen,
		selectedPaymentMethod,
		allLucideIcons,
		setIsCreateModalOpen,
		setIsUpdateModalOpen,
		setSelectedPaymentMethod,
		handleCreatePaymentMethod,
		handleUpdatePaymentMethod,
		handleDeletePaymentMethod,
	} = PaymentMethodManagementLogic(userId);

	const handleEdit = (paymentMethod: PaymentMethodResponseDTO) => {
		setSelectedPaymentMethod(paymentMethod);
		setIsUpdateModalOpen(true);
	};

	const handleDelete = (paymentMethod: PaymentMethodResponseDTO) => {
		handleDeletePaymentMethod(paymentMethod.paymentMethodId, userId);
	};

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<CreditCard className='h-5 w-5' />
							Payment Methods
						</CardTitle>
						<CardDescription>
							Manage your payment methods
						</CardDescription>
					</div>
					<Button onClick={() => setIsCreateModalOpen(true)}>
						<Plus className='h-4 w-4 mr-2' />
						Add Payment Method
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='text-center py-8'>
						Loading payment methods...
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Icon</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Details</TableHead>
								<TableHead className='text-right'>
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paymentMethods?.map(
								(paymentMethod: PaymentMethodResponseDTO) => (
									<TableRow
										key={paymentMethod.paymentMethodId}
									>
										<TableCell>
											<Icon
												name={
													paymentMethod.icon ||
													'credit-card'
												}
												size={20}
												className='text-muted-foreground'
											/>
										</TableCell>
										<TableCell className='font-medium'>
											{paymentMethod.displayName ||
												paymentMethod.name}
										</TableCell>
										<TableCell>
											<Badge variant='outline'>
												{PAYMENT_METHOD_TYPE_LABELS[
													paymentMethod.type
												] || paymentMethod.type}
											</Badge>
										</TableCell>
										<TableCell className='text-muted-foreground'>
											{paymentMethod.lastFourDigits
												? `****${paymentMethod.lastFourDigits}`
												: paymentMethod.issuerName ||
													'-'}
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex items-center justify-end gap-2'>
												<Button
													variant='ghost'
													size='sm'
													onClick={() =>
														handleEdit(
															paymentMethod
														)
													}
												>
													<Edit2 className='h-4 w-4' />
												</Button>
												<Button
													variant='ghost'
													size='sm'
													onClick={() =>
														handleDelete(
															paymentMethod
														)
													}
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				)}
			</CardContent>

			<NewPaymentMethodModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onCreate={handleCreatePaymentMethod}
				paymentMethods={paymentMethods || []}
				userId={userId}
				allLucideIcons={allLucideIcons}
				predefinedIcons={PREDEFINED_ICONS}
			/>

			<UpdatePaymentMethodModal
				isOpen={isUpdateModalOpen}
				onClose={() => setIsUpdateModalOpen(false)}
				onUpdate={handleUpdatePaymentMethod}
				paymentMethods={paymentMethods || []}
				paymentMethod={selectedPaymentMethod}
				allLucideIcons={allLucideIcons}
				predefinedIcons={PREDEFINED_ICONS}
			/>
		</Card>
	);
}
