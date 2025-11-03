import { lazy, Suspense, useMemo } from 'react';
import { kebabCase, pascalCase } from 'change-case';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
	name: string;
}

// Cache for loaded icons to prevent re-imports
const iconCache = new Map<string, React.ComponentType<LucideProps>>();

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

// Optimized Icon component with caching
export const Icon: React.FC<IconProps> = ({ name, size = 20, ...props }) => {
	const pascalName = useMemo(() => pascalCase(name), [name]);

	// Check cache first
	const CachedIcon = iconCache.get(pascalName);

	if (CachedIcon) {
		return <CachedIcon width={size} height={size} {...props} />;
	}

	// Lazy load icon only if not cached
	// lazy() expects a sync function that returns a Promise
	const LazyIcon = lazy(() =>
		import('lucide-react')
			.then((icons) => {
				const IconComponent = (icons as any)[pascalName];

				if (!IconComponent) {
					console.warn(`Unknown icon: ${name} (${pascalName})`);
					// Return HelpCircle as fallback
					return { default: icons.HelpCircle };
				}

				// Cache the loaded icon
				iconCache.set(pascalName, IconComponent);
				return { default: IconComponent };
			})
			.catch(async (error) => {
				console.warn(`Failed to load icon: ${name}`, error);
				// Return fallback on error
				const icons = await import('lucide-react');
				return {
					default: icons.HelpCircle,
				};
			})
	);

	return (
		<Suspense
			fallback={
				<span
					style={{ width: size, height: size }}
					className='inline-block rounded-full bg-gray-200 animate-pulse'
				/>
			}
		>
			<LazyIcon width={size} height={size} {...props} />
		</Suspense>
	);
};

export default Icon;
