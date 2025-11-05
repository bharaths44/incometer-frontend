'use client';

import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
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
import { CategoryManagementLogic } from '@/components/profile/CategoryManagementLogic';
import NewCategoryModal from '@/components/shared/NewCategoryModal';
import UpdateCategoryModal from '@/components/shared/UpdateCategoryModal';
import Icon from '@/lib/iconUtils';
import { Category } from '@/types/category';
import { PREDEFINED_ICONS } from '@/lib/constants';

interface CategoryManagementProps {
	userId: string;
}

export function CategoryManagement({ userId }: CategoryManagementProps) {
	const {
		categories,
		isLoading,
		isCreateModalOpen,
		isUpdateModalOpen,
		selectedCategory,
		allLucideIcons,
		setIsCreateModalOpen,
		setIsUpdateModalOpen,
		setSelectedCategory,
		handleCreateCategory,
		handleUpdateCategory,
		handleDeleteCategory,
	} = CategoryManagementLogic(userId);

	const handleEdit = (category: Category) => {
		setSelectedCategory(category);
		setIsUpdateModalOpen(true);
	};

	const handleDelete = (category: Category) => {
		handleDeleteCategory(category.categoryId, userId);
	};

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Tag className='h-5 w-5' />
							Categories
						</CardTitle>
						<CardDescription>
							Manage your transaction categories
						</CardDescription>
					</div>
					<Button onClick={() => setIsCreateModalOpen(true)}>
						<Plus className='h-4 w-4 mr-2' />
						Add Category
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='text-center py-8'>
						Loading categories...
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Icon</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Type</TableHead>
								<TableHead className='text-right'>
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{categories?.map((category: Category) => (
								<TableRow key={category.categoryId}>
									<TableCell>
										<Icon
											name={category.icon}
											size={20}
											className='text-muted-foreground'
										/>
									</TableCell>
									<TableCell className='font-medium'>
										{category.name}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												category.type === 'EXPENSE'
													? 'destructive'
													: 'default'
											}
										>
											{category.type}
										</Badge>
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex items-center justify-end gap-2'>
											<Button
												variant='ghost'
												size='sm'
												onClick={() =>
													handleEdit(category)
												}
											>
												<Edit2 className='h-4 w-4' />
											</Button>
											<Button
												variant='ghost'
												size='sm'
												onClick={() =>
													handleDelete(category)
												}
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>

			<NewCategoryModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onCreate={handleCreateCategory}
				categories={categories || []}
				userId={userId}
				allLucideIcons={allLucideIcons}
				predefinedIcons={PREDEFINED_ICONS}
			/>

			<UpdateCategoryModal
				isOpen={isUpdateModalOpen}
				onClose={() => setIsUpdateModalOpen(false)}
				onUpdate={handleUpdateCategory}
				categories={categories || []}
				category={selectedCategory}
				userId={userId}
				allLucideIcons={allLucideIcons}
				predefinedIcons={PREDEFINED_ICONS}
			/>
		</Card>
	);
}
