import Icon from '@/lib/iconUtils';
import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { searchIcons, getAllIconNames } from '@/lib/iconSearch';

interface IconSelectorProps {
	selectedIcon: string;
	onSelect: (icon: string) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	allIcons?: string[]; // Made optional since we load from metadata
	predefinedIcons: string[];
}

export default function IconSelector({
	selectedIcon,
	onSelect,
	searchQuery,
	setSearchQuery,
	predefinedIcons,
}: IconSelectorProps) {
	const [filteredIcons, setFilteredIcons] =
		useState<string[]>(predefinedIcons);
	const [isSearching, setIsSearching] = useState(false);
	const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
		null
	);

	// Load all icons on mount
	useEffect(() => {
		const loadIcons = async () => {
			try {
				const allIconNames = await getAllIconNames();
				if (allIconNames.length > 0) {
					// Update allIcons if it wasn't passed in
					// This ensures we have the full list from metadata
				}
			} catch (error) {
				console.error('Failed to load icon names:', error);
			}
		};
		loadIcons();
	}, []);

	// Debounced search function
	const performSearch = useCallback(
		async (query: string) => {
			if (!query.trim()) {
				setFilteredIcons(predefinedIcons);
				setIsSearching(false);
				return;
			}

			setIsSearching(true);
			try {
				const results = await searchIcons(query, 48); // Limit to 48 results for UI
				setFilteredIcons(results);
			} catch (error) {
				console.error('Search failed:', error);
				setFilteredIcons([]);
			} finally {
				setIsSearching(false);
			}
		},
		[predefinedIcons]
	);

	// Handle search input with debouncing
	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchQuery(value);

			// Clear existing timer
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}

			// Set new timer for debounced search
			const timer = setTimeout(() => {
				performSearch(value);
			}, 300); // 300ms debounce

			setDebounceTimer(timer);
		},
		[setSearchQuery, debounceTimer, performSearch]
	);

	// Update filtered icons when search query changes
	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredIcons(predefinedIcons);
		}
	}, [searchQuery, predefinedIcons]);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
		};
	}, [debounceTimer]);

	return (
		<div>
			<label className='block text-sm font-medium text-foreground mb-2'>
				Icon
			</label>
			<Input
				type='text'
				value={searchQuery}
				onChange={(e) => handleSearchChange(e.target.value)}
				className='mb-3'
				placeholder='Search icons naturally (e.g., "food", "car", "work", "home")...'
			/>
			{!searchQuery && (
				<p className='text-xs text-muted-foreground mb-2'>
					Popular icons shown below. Search naturally with terms like
					&quot;food&quot;, &quot;car&quot;, &quot;work&quot;, or
					&quot;home&quot; to find related icons.
				</p>
			)}
			<div className='grid grid-cols-6 gap-2 max-h-32 overflow-y-auto'>
				{filteredIcons.map((iconName) => (
					<button
						key={iconName}
						type='button'
						onClick={() => onSelect(iconName)}
						className={`p-2 border rounded-lg hover:bg-muted transition-colors ${
							selectedIcon === iconName
								? 'border-primary bg-muted'
								: 'border-border'
						}`}
						title={iconName}
						disabled={isSearching}
					>
						<Icon name={iconName} size={20} />
					</button>
				))}
			</div>
			{isSearching && searchQuery && (
				<p className='text-xs text-muted-foreground mt-2'>
					Searching...
				</p>
			)}
			{!isSearching && filteredIcons.length === 0 && searchQuery && (
				<p className='text-sm text-muted-foreground mt-2'>
					No icons found for &quot;{searchQuery}&quot;
				</p>
			)}
			{!isSearching && filteredIcons.length > 0 && searchQuery && (
				<p className='text-xs text-surface-variant-foreground mt-2'>
					{filteredIcons.length} icons found
				</p>
			)}
		</div>
	);
}
