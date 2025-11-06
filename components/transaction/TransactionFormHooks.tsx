import { useEffect, useState } from 'react';
import { getAllCategories } from '@/services/categoryService';
import { getAllPaymentMethods } from '@/services/paymentMethodService';
import { PaymentMethodResponseDTO } from '@/types/paymentMethod';
import { Category } from '@/types/category';

const predefinedIcons = [
	'shopping-bag',
	'car',
	'film',
	'zap',
	'heart',
	'home',
	'credit-card',
	'plane',
	'scissors',
	'utensils',
	'shopping-cart',
	'briefcase',
	'gift',
	'book',
	'users',
];

// Convert PascalCase to kebab-case
const pascalToKebab = (str: string): string => {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export const useTransactionFormData = (
	userId: string,
	transactionType: 'expense' | 'income',
	isOpen: boolean
) => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [paymentMethods, setPaymentMethods] = useState<
		PaymentMethodResponseDTO[]
	>([]);
	const [allLucideIcons, setAllLucideIcons] = useState<string[]>([]);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await getAllCategories(userId);
				setCategories(
					data.filter(
						(cat) =>
							cat.type ===
							(transactionType === 'expense'
								? 'EXPENSE'
								: 'INCOME')
					)
				);
			} catch (error) {
				console.error('Failed to fetch categories:', error);
			} finally {
				setLoadingCategories(false);
			}
		};

		const fetchPaymentMethods = async () => {
			try {
				console.log('Fetching payment methods for user:', userId);
				const data = await getAllPaymentMethods(userId);
				console.log('Fetched payment methods:', data);
				setPaymentMethods(data);
			} catch (error) {
				console.error('Failed to fetch payment methods:', error);
				setPaymentMethods([]);
			} finally {
				setLoadingPaymentMethods(false);
			}
		};

		if (isOpen) {
			fetchCategories();
			fetchPaymentMethods();
		}
	}, [isOpen, userId, transactionType]);

	useEffect(() => {
		const loadAllIcons = async () => {
			try {
				const icons = await import('lucide-react');
				const iconNames = Object.keys(icons).filter(
					(key) =>
						key !== 'default' &&
						key !== 'createLucideIcon' &&
						key !== 'LucideIcon' &&
						key !== 'icons' &&
						!key.startsWith('Lucid') && // Exclude names starting with "Lucid"
						!key.endsWith('Icon') && // Exclude names ending with "Icon"
						key.charAt(0) !== key.charAt(0).toUpperCase() // Must start with uppercase (icon names)
				);
				// Convert PascalCase names to kebab-case for Icon component
				const kebabCaseIcons: string[] = iconNames.map(pascalToKebab);

				// Remove duplicates and sort
				const uniqueIcons = [...new Set(kebabCaseIcons)].sort();
				setAllLucideIcons(uniqueIcons);
			} catch (error) {
				console.error('Failed to load Lucide icons:', error);
				// Fallback to predefined icons
				setAllLucideIcons(predefinedIcons);
			}
		};
		loadAllIcons();
	}, []);

	const addCategory = (newCategory: Category) => {
		setCategories((prev) => [...prev, newCategory]);
	};

	const addPaymentMethod = (newPaymentMethod: PaymentMethodResponseDTO) => {
		setPaymentMethods((prev) => [...prev, newPaymentMethod]);
	};

	return {
		categories,
		paymentMethods,
		allLucideIcons,
		loadingCategories,
		loadingPaymentMethods,
		addCategory,
		addPaymentMethod,
		predefinedIcons,
	};
};
