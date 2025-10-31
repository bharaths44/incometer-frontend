import { TransactionConfig } from '@/types/transaction';
import TransactionForm from '@/components/transaction/TransactionForm';
import TransactionTable from '@/components/transaction/TransactionTable';
import TransactionStats from '@/components/transaction/TransactionStats';
import TransactionPageHeader from '@/components/transaction/TransactionPageHeader';
import TransactionFilters from '@/components/transaction/TransactionFilters';
import { useTransactionPageLogic } from '@/components/transaction/TransactionPageLogic';

interface TransactionPageProps {
	config: TransactionConfig;
}

export default function TransactionPage({ config }: TransactionPageProps) {
	const {
		showAddModal,
		setShowAddModal,
		editingTransaction,
		formData,
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
		</div>
	);
}
