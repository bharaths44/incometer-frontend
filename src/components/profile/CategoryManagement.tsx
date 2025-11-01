import { useState } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import NewCategoryModal from '@/components/shared/NewCategoryModal';
import UpdateCategoryModal from '@/components/shared/UpdateCategoryModal';
import { Category } from '@/types/category';
import { PREDEFINED_ICONS } from '@/lib/constants';
import { Icon } from '@/lib/iconUtils';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Edit2, Trash2 } from 'lucide-react';

interface CategoryManagementProps {
	userId: number;
	allLucideIcons: string[];
}

type CategoryType = 'ALL' | 'EXPENSE' | 'INCOME';

export default function CategoryManagement({
	userId,
	allLucideIcons,
}: CategoryManagementProps) {
	const { data: categories = [], isLoading } = useCategories(userId);
	const deleteCategoryMutation = useDeleteCategory();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null
	);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);
	const [selectedType, setSelectedType] = useState<CategoryType>('ALL');
	const [searchQuery, setSearchQuery] = useState('');

	const handleCreateCategory = (category: Category) => {
		// The mutation will handle cache invalidation
		console.log('Category created:', category);
	};

	const handleUpdateCategory = (category: Category) => {
		// The mutation will handle cache invalidation
		console.log('Category updated:', category);
		setIsUpdateModalOpen(false);
		setSelectedCategory(null);
	};

	const handleCategoryClick = (category: Category) => {
		setSelectedCategory(category);
		setIsUpdateModalOpen(true);
	};

	const handleDeleteCategory = (category: Category) => {
		setCategoryToDelete(category);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeleteCategory = () => {
		if (categoryToDelete) {
			deleteCategoryMutation.mutate(
				{ id: categoryToDelete.categoryId, userId },
				{
					onSuccess: () => {
						console.log('Category deleted:', categoryToDelete);
						setIsDeleteDialogOpen(false);
						setCategoryToDelete(null);
					},
					onError: (error) => {
						console.error('Failed to delete category:', error);
						setErrorMessage(
							'Failed to delete category. Please try again.'
						);
						setIsErrorDialogOpen(true);
						setIsDeleteDialogOpen(false);
						setCategoryToDelete(null);
					},
				}
			);
		}
	};

	const cancelDeleteCategory = () => {
		setIsDeleteDialogOpen(false);
		setCategoryToDelete(null);
	};

	const filteredCategories = categories.filter((category) => {
		const matchesType =
			selectedType === 'ALL' || category.type === selectedType;
		const matchesSearch = category.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		return matchesType && matchesSearch;
	});

	const renderCategoryItem = (category: Category) => (
		<div
			key={category.categoryId}
			className='flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow'
		>
			<div className='flex items-center gap-3'>
				<div className='w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center'>
					<Icon
						name={category.icon}
						className='w-5 h-5 text-gray-600'
					/>
				</div>
				<div>
					<div className='font-medium'>{category.name}</div>
					<div className='text-sm text-gray-500 capitalize'>
						{category.type.toLowerCase()}
					</div>
				</div>
			</div>
			<div className='flex items-center gap-2'>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => handleCategoryClick(category)}
					className='h-8 w-8 p-0 hover:bg-tertiary-container'
				>
					<Edit2 className='h-4 w-4' />
				</Button>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => handleDeleteCategory(category)}
					className='h-8 w-8 p-0 hover:bg-red-50'
				>
					<Trash2 className='h-4 w-4 text-error' />
				</Button>
			</div>
		</div>
	);

	return (
		<>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h3 className='text-xl font-bold'>Categories</h3>
					<Button
						onClick={() => setIsModalOpen(true)}
						className='flex items-center gap-2'
					>
						<span>+</span>
						Add Category
					</Button>
				</div>

				{/* Type Filter */}
				<div className='flex gap-2'>
					<Button
						variant={selectedType === 'ALL' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setSelectedType('ALL')}
					>
						All
					</Button>
					<Button
						variant={
							selectedType === 'EXPENSE' ? 'default' : 'outline'
						}
						size='sm'
						onClick={() => setSelectedType('EXPENSE')}
					>
						Expense
					</Button>
					<Button
						variant={
							selectedType === 'INCOME' ? 'default' : 'outline'
						}
						size='sm'
						onClick={() => setSelectedType('INCOME')}
					>
						Income
					</Button>
				</div>

				{/* Search */}
				<div className='relative'>
					<input
						type='text'
						placeholder='Search categories...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full px-4 py-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
					/>
				</div>

				{/* Categories List */}
				<div className='grid gap-4'>
					{isLoading ? (
						<div className='space-y-4'>
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className='h-16 bg-surface-variant rounded animate-pulse'
								></div>
							))}
						</div>
					) : filteredCategories.length === 0 ? (
						<div className='text-center py-8 text-surface-variant-foreground'>
							{searchQuery || selectedType !== 'ALL'
								? 'No categories found matching your criteria.'
								: 'No categories found.'}
						</div>
					) : (
						filteredCategories.map(renderCategoryItem)
					)}
				</div>
			</div>

			<NewCategoryModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onCreate={handleCreateCategory}
				categories={categories}
				userId={userId}
				allLucideIcons={allLucideIcons}
				predefinedIcons={PREDEFINED_ICONS}
				defaultType={selectedType === 'ALL' ? 'EXPENSE' : selectedType}
			/>

			<UpdateCategoryModal
				isOpen={isUpdateModalOpen}
				onClose={() => {
					setIsUpdateModalOpen(false);
					setSelectedCategory(null);
				}}
				onUpdate={handleUpdateCategory}
				categories={categories}
				category={selectedCategory}
				userId={userId}
				allLucideIcons={allLucideIcons}
				predefinedIcons={PREDEFINED_ICONS}
			/>

			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2'>
							<AlertTriangle className='h-5 w-5' />
							Delete Category
						</DialogTitle>
						<DialogDescription className='text-left'>
							Are you sure you want to delete the category{' '}
							<strong>"{categoryToDelete?.name}"</strong>?
							<br />
							<br />
							<span className='text-error font-medium'>
								⚠️ Warning: This will also delete all associated
								budgets and transactions for this category. This
								action cannot be undone.
							</span>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={cancelDeleteCategory}
						>
							Cancel
						</Button>
						<Button
							variant='destructive'
							onClick={confirmDeleteCategory}
							disabled={deleteCategoryMutation.isPending}
						>
							{deleteCategoryMutation.isPending
								? 'Deleting...'
								: 'Delete Category'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isErrorDialogOpen}
				onOpenChange={setIsErrorDialogOpen}
			>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2'>
							<AlertTriangle className='h-5 w-5 text-error' />
							Error
						</DialogTitle>
						<DialogDescription>{errorMessage}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => setIsErrorDialogOpen(false)}>
							OK
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
