import Icon from '@/lib/iconUtils';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface IconSelectorProps {
	selectedIcon: string;
	onSelect: (icon: string) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	allIcons: string[];
	predefinedIcons: string[];
}

export default function IconSelector({
	selectedIcon,
	onSelect,
	searchQuery,
	setSearchQuery,
	allIcons,
	predefinedIcons,
}: IconSelectorProps) {
	useEffect(() => {}, [allIcons]);

	const filteredIcons =
		searchQuery.trim() && allIcons.length > 0
			? allIcons.filter((iconName) =>
					iconName.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: predefinedIcons;
	return (
		<div>
			<label className='block text-sm font-medium text-foreground mb-2'>
				Icon
			</label>
			<Input
				type='text'
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className='mb-3'
				placeholder='Search all Lucide icons (e.g., gym, car, food)...'
			/>
			{!searchQuery && (
				<p className='text-xs text-muted-foreground mb-2'>
					Popular icons shown below. Start typing to search all{' '}
					{allIcons.length > 0 ? allIcons.length : ''} Lucide icons.
				</p>
			)}
			<div className='grid grid-cols-6 gap-2 max-h-32 overflow-y-auto'>
				{filteredIcons.map((iconName) => (
					<button
						key={iconName}
						type='button'
						onClick={() => onSelect(iconName)}
						className={`p-2 border rounded-lg hover:bg-muted ${
							selectedIcon === iconName
								? 'border-primary bg-muted'
								: 'border-border'
						}`}
						title={iconName}
					>
						<Icon name={iconName} size={20} />
					</button>
				))}
			</div>
			{filteredIcons.length === 0 && searchQuery && (
				<p className='text-sm text-muted-foreground mt-2'>
					No icons found for &quot;{searchQuery}&quot;
				</p>
			)}
			{filteredIcons.length > 0 && searchQuery && (
				<p className='text-xs text-surface-variant-foreground mt-2'>
					{filteredIcons.length} icons found
				</p>
			)}
		</div>
	);
}
