import { TransactionConfig } from '@/types/transaction';
import TransactionForm from '@/components/transaction/TransactionForm';
import TransactionTable from '@/components/transaction/TransactionTable';
import TransactionStats from '@/components/transaction/TransactionStats';
import TransactionPageHeader from '@/components/transaction/TransactionPageHeader';
import TransactionFilters from '@/components/transaction/TransactionFilters';
import { useTransactionPageLogic } from '@/components/transaction/TransactionPageLogic';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TransactionPageProps {
	config: TransactionConfig;
}

export default function TransactionPage({ config }: TransactionPageProps) {
	const {
		showAddModal,
		setShowAddModal,
		editingTransaction,
		formData,
		transactionToDelete,
		transactions,
		categories,
		paymentMethods,
		loading,
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		selectedPaymentMethod,
		setSelectedPaymentMethod,
		dateFrom,
		setDateFrom,
		dateTo,
		setDateTo,
		amountMin,
		setAmountMin,
		amountMax,
		setAmountMax,
		handleEdit,
		handleDelete,
		confirmDelete,
		cancelDelete,
		handleSubmit,
		openAddModal,
		clearFilters,
	} = useTransactionPageLogic(config);

	return (
		<div className='page-transition space-y-8'>
			<TransactionPageHeader
				title={config.title}
				description={config.description}
				addButtonText={config.addButtonText}
				onAddClick={openAddModal}
			/>

			<TransactionStats
				transactions={transactions}
				type={config.type}
				title={config.title}
			/>

			<TransactionFilters
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				selectedCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
				selectedPaymentMethod={selectedPaymentMethod}
				onPaymentMethodChange={setSelectedPaymentMethod}
				dateFrom={dateFrom}
				onDateFromChange={setDateFrom}
				dateTo={dateTo}
				onDateToChange={setDateTo}
				amountMin={amountMin}
				onAmountMinChange={setAmountMin}
				amountMax={amountMax}
				onAmountMaxChange={setAmountMax}
				categories={categories}
				paymentMethods={paymentMethods}
				type={config.type}
				onClearFilters={clearFilters}
			/>

			<TransactionTable
				transactions={transactions}
				onEdit={handleEdit}
				onDelete={handleDelete}
				loading={loading}
				config={config}
			/>

			<TransactionForm
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSubmit={handleSubmit}
				editingTransaction={editingTransaction}
				initialData={formData}
				config={config}
			/>

			<AlertDialog
				open={!!transactionToDelete}
				onOpenChange={cancelDelete}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Delete {config.type}
						</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this{' '}
							{config.type.toLowerCase()}? This action cannot be
							undone.
							{transactionToDelete && (
								<div className='mt-2 p-3 bg-muted rounded-md'>
									<p className='font-medium'>
										{transactionToDelete.description}
									</p>
									<p className='text-sm text-muted-foreground'>
										₹{transactionToDelete.amount.toFixed(2)}{' '}
										• {transactionToDelete.category.name}
									</p>
									<p className='text-sm text-muted-foreground'>
										{new Date(
											transactionToDelete.transactionDate
										).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
									</p>
								</div>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={cancelDelete}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
