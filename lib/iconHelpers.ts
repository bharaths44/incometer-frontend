import { kebabCase } from 'change-case';

// Get all Lucide icon names (keep as async for external use)
export const getAllLucideIconNames = async (): Promise<string[]> => {
	try {
		const icons = await import('lucide-react');
		const iconNames = Object.keys(icons).filter(
			(key) =>
				key !== 'default' &&
				key !== 'createLucideIcon' &&
				key !== 'LucideIcon' &&
				key !== 'icons' &&
				!key.startsWith('Lucid') &&
				!key.endsWith('Icon') &&
				key.charAt(0) === key.charAt(0).toUpperCase()
		);

		return [...new Set(iconNames.map((name) => kebabCase(name)))].sort();
	} catch (error) {
		console.warn('Failed to load Lucide icons:', error);
		return [];
	}
};