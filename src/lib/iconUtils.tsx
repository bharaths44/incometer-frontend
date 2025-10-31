/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import * as changeCase from 'change-case';

interface LucideIconProps {
	size?: number;
	color?: string;
	className?: string;
}

type LucideIconComponent = React.ComponentType<LucideIconProps>;

interface IconProps {
	name: string;
	size?: number;
	color?: string;
	className?: string;
}

// Get all Lucide icon names
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

		// Convert PascalCase names to kebab-case for Icon component
		const kebabCaseIcons: string[] = iconNames.map((name) =>
			changeCase.kebabCase(name)
		);

		// Remove duplicates and sort
		const uniqueIcons = [...new Set(kebabCaseIcons)].sort();

		return uniqueIcons;
	} catch (error) {
		console.warn(
			'getAllLucideIconNames: Failed to load Lucide icons:',
			error
		);
		return [];
	}
};

export const Icon: React.FC<IconProps> = ({
	name,
	size = 20,
	color = 'currentColor',
	className,
}) => {
	const [IconComponent, setIconComponent] =
		useState<LucideIconComponent | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!name) {
			setLoading(false);
			return;
		}

		const loadIcon = async () => {
			try {
				const icons = await import('lucide-react'); // import all icons once
				const pascalName = changeCase.pascalCase(name);

				const LucideIcon = (
					icons as unknown as Record<string, LucideIconComponent>
				)[pascalName];

				if (LucideIcon) {
					setIconComponent(() => LucideIcon);
				} else {
					console.warn(
						`⚠️ Icon component: Unknown icon name: ${name} (PascalCase: ${pascalName})`
					);
				}
			} catch (error) {
				console.warn(
					`⚠️ Icon component: Failed to load icon: ${name}`,
					error
				);
			} finally {
				setLoading(false);
			}
		};

		loadIcon();
	}, [name]);

	if (loading) {
		return (
			<span
				style={{ width: size, height: size }}
				className={`inline-block rounded-full bg-gray-200 animate-pulse ${className ?? ''}`}
			/>
		);
	}

	if (!IconComponent) {
		return (
			<span
				style={{ fontSize: size, color }}
				className={`inline-block rounded-full border border-gray-400 p-1 ${className ?? ''}`}
			>
				?
			</span>
		);
	}

	return <IconComponent size={size} color={color} className={className} />;
};

export default Icon;
