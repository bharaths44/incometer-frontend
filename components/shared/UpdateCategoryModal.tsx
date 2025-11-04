import { useState } from 'react';

import { updateCategory } from '@/services/categoryService';
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
import IconSelector from './IconSelector';
import { Category } from '@/types/category';
import { PREDEFINED_ICONS } from '@/lib/constants';

interface UpdateCategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (category: Category) => void;
	categories: Category[];
	category: Category | null;
	userId: number;
	allLucideIcons: string[];
	predefinedIcons: string[];
}

export default function UpdateCategoryModal({
	isOpen,
	onClose,
	onUpdate,
	categories,
	category,
	userId,
	allLucideIcons,
	predefinedIcons: propPredefinedIcons,
}: UpdateCategoryModalProps) {
	const [categoryName, setCategoryName] = useState(category?.name || '');
	const [categoryIcon, setCategoryIcon] = useState(category?.icon || '');
	const [categoryType, setCategoryType] = useState<'EXPENSE' | 'INCOME'>(
		category?.type || 'EXPENSE'
	);
	const [iconSearchQuery, setIconSearchQuery] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleUpdateCategory = async () => {
		if (!categoryName.trim() || !categoryIcon || !category) {
			setErrorMessage('Please enter a category name and select an icon');
			return;
		}

		// Check if another category with the same name already exists (excluding current category)
		const existingCategory = categories.find(
			(cat) =>
				cat.name.toLowerCase() === categoryName.trim().toLowerCase() &&
				cat.categoryId !== category.categoryId
		);
		if (existingCategory) {
			setErrorMessage('Another category with this name already exists!');
			return;
		}

		try {
			const updatedCategory = await updateCategory(category.categoryId, {
				userId: userId,
				name: categoryName.trim(),
				icon: categoryIcon,
				type: categoryType,
			});
			onUpdate(updatedCategory);
			handleClose();
		} catch (error) {
			console.error('Failed to update category:', error);
			setErrorMessage('Failed to update category. Please try again.');
		}
	};

	const handleClose = () => {
		setCategoryName('');
		setCategoryIcon('');
		setCategoryType('EXPENSE');
		setIconSearchQuery('');
		setErrorMessage(null);
		onClose();
	};

	if (!category) return null;

	return (
		<>
			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>Update Category</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<Label
								htmlFor='categoryName'
								className='block text-sm font-medium text-foreground mb-2'
							>
								Category Name
							</Label>
							<Input
								id='categoryName'
								type='text'
								value={categoryName}
								onChange={(e) =>
									setCategoryName(e.target.value)
								}
								placeholder='e.g., Travel'
								required
							/>
						</div>
						<div>
							<Label
								htmlFor='categoryType'
								className='block text-sm font-medium text-foreground mb-2'
							>
								Category Type
							</Label>
							<Select
								value={categoryType}
								onValueChange={(value: 'EXPENSE' | 'INCOME') =>
									setCategoryType(value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select Type' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='EXPENSE'>
										Expense
									</SelectItem>
									<SelectItem value='INCOME'>
										Income
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<IconSelector
							selectedIcon={categoryIcon}
							onSelect={setCategoryIcon}
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
								onClick={handleUpdateCategory}
								className='flex-1'
								disabled={!categoryName.trim() || !categoryIcon}
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
