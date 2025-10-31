import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Item {
	name: string;
	icon?: string;
	type?: string;
	displayName?: string;
}

interface ItemManagementProps<T extends Item> {
	title: string;
	items: T[];
	isLoading: boolean;
	searchPlaceholder: string;
	onAddClick: () => void;
	renderItem: (item: T) => React.ReactNode;
	addButtonText: string;
}

export default function ItemManagement<T extends Item>({
	title,
	items,
	isLoading,
	searchPlaceholder,
	onAddClick,
	renderItem,
	addButtonText,
}: ItemManagementProps<T>) {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredItems = items.filter((item) => {
		const displayName = item.displayName || item.name;
		return displayName.toLowerCase().includes(searchQuery.toLowerCase());
	});

	if (isLoading) {
		return (
			<div className='space-y-4'>
				<div className='h-8 bg-gray-200 rounded animate-pulse'></div>
				<div className='grid gap-4'>
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className='h-16 bg-gray-200 rounded animate-pulse'
						></div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h3 className='text-xl font-bold'>{title}</h3>
				<Button
					onClick={onAddClick}
					className='flex items-center gap-2'
				>
					<Plus className='w-4 h-4' />
					{addButtonText}
				</Button>
			</div>

			<div className='relative'>
				<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
				<Input
					type='text'
					placeholder={searchPlaceholder}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='pl-10'
				/>
			</div>

			<div className='grid gap-4'>
				{filteredItems.length === 0 ? (
					<div className='text-center py-8 text-gray-500'>
						{searchQuery
							? 'No items found matching your search.'
							: 'No items found.'}
					</div>
				) : (
					filteredItems.map(renderItem)
				)}
			</div>
		</div>
	);
}
