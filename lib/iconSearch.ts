import Fuse from 'fuse.js';

// Types for icon metadata
interface IconMetadata {
	name: string;
	tags: string[];
}

interface IconSearchResult {
	name: string;
	tags: string[];
}

// Global variables for metadata and Fuse instance
let iconMetadata: Record<string, IconMetadata> | null = null;
let fuseInstance: Fuse<IconSearchResult> | null = null;

// Fuse.js configuration optimized for icon search
const fuseOptions = {
	keys: [
		{ name: 'name', weight: 0.5 },
		{ name: 'tags', weight: 0.5 },
	],
	threshold: 0.3, // Lower = more strict matching
	includeScore: true,
	shouldSort: true,
	minMatchCharLength: 2,
};

/**
 * Load icon metadata from JSON file
 */
async function loadIconMetadata(): Promise<void> {
	if (iconMetadata) return; // Already loaded

	try {
		let tagsData: Record<string, string[]>;

		// Check if we're in Node.js environment (for testing)
		if (typeof window === 'undefined') {
			// Node.js environment - use fs
			const fs = await import('fs');
			const path = await import('path');
			const filePath = path.resolve('./lib/tags.json');
			const fileContent = fs.readFileSync(filePath, 'utf-8');
			tagsData = JSON.parse(fileContent);
		} else {
			// Browser environment - use fetch
			const response = await fetch('/tags.json');
			if (!response.ok) {
				throw new Error(`Failed to load tags: ${response.status}`);
			}
			tagsData = await response.json();
		}

		// Convert tags data to metadata format
		iconMetadata = {};
		Object.entries(tagsData).forEach(([iconName, tags]) => {
			iconMetadata![iconName] = {
				name: iconName,
				tags: tags,
			};
		});

		// Create Fuse instance with the metadata
		const searchableData: IconSearchResult[] = Object.values(iconMetadata!);
		fuseInstance = new Fuse(searchableData, fuseOptions);

		console.log(
			`Loaded ${Object.keys(iconMetadata!).length} icons with metadata`
		);
	} catch (error) {
		console.error('Failed to load icon metadata:', error);
		// Fallback to empty metadata
		iconMetadata = {};
		fuseInstance = new Fuse([], fuseOptions);
	}
}

/**
 * Search for icons using natural language and fuzzy matching
 * @param query - The search query
 * @param limit - Maximum number of results to return (default: 50)
 * @returns Array of matching icon names, sorted by relevance
 */
export async function searchIcons(
	query: string,
	limit: number = 50
): Promise<string[]> {
	if (!query.trim()) {
		return [];
	}

	// Ensure metadata is loaded
	await loadIconMetadata();

	if (!fuseInstance || !iconMetadata) {
		return [];
	}

	const queryLower = query.toLowerCase();

	// Use Fuse.js for fuzzy search
	const fuzzyResults = fuseInstance.search(query);

	// Extract icon names and apply additional logic
	const results = fuzzyResults.map((result) => ({
		name: result.item.name,
		score: result.score,
	}));

	// Boost exact matches and prefix matches
	const boostedResults = results.map((result) => {
		let boost = 0;

		// Exact name match gets highest boost
		if (result.name === queryLower) {
			boost -= 1.0;
		}
		// Name starts with query gets boost
		else if (result.name.startsWith(queryLower)) {
			boost -= 0.5;
		}
		// Query starts with name gets boost
		else if (queryLower.startsWith(result.name)) {
			boost -= 0.3;
		}

		// Tag exact matches get boost
		const metadata = iconMetadata![result.name];
		if (metadata) {
			if (metadata.tags.some((tag) => tag.toLowerCase() === queryLower)) {
				boost -= 0.4;
			}
			if (
				metadata.tags.some((tag) =>
					tag.toLowerCase().startsWith(queryLower)
				)
			) {
				boost -= 0.2;
			}
		}

		return {
			...result,
			score: (result.score || 0) + boost,
		};
	});

	// Sort by boosted score and limit results
	const sortedResults = boostedResults
		.sort((a, b) => (a.score || 0) - (b.score || 0))
		.slice(0, limit);

	return sortedResults.map((result) => result.name);
}

/**
 * Get all available icon names
 */
export async function getAllIconNames(): Promise<string[]> {
	await loadIconMetadata();
	return iconMetadata ? Object.keys(iconMetadata) : [];
}

/**
 * Get metadata for a specific icon
 */
export async function getIconMetadata(
	iconName: string
): Promise<IconMetadata | null> {
	await loadIconMetadata();
	return iconMetadata?.[iconName] || null;
}

/**
 * Get suggested search terms based on partial input
 * @param partialQuery - The partial search query
 * @param limit - Maximum number of suggestions
 * @returns Array of suggested search terms
 */
export async function getSearchSuggestions(
	partialQuery: string,
	limit: number = 5
): Promise<string[]> {
	if (!partialQuery.trim()) {
		return [];
	}

	await loadIconMetadata();

	if (!iconMetadata) {
		return [];
	}

	const queryLower = partialQuery.toLowerCase();
	const suggestions = new Set<string>();

	// Collect suggestions from tags
	Object.values(iconMetadata).forEach((metadata) => {
		metadata.tags.forEach((term) => {
			if (
				term.toLowerCase().includes(queryLower) &&
				term.toLowerCase() !== queryLower
			) {
				suggestions.add(term);
			}
		});
	});

	return Array.from(suggestions).slice(0, limit);
}
