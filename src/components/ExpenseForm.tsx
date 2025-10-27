import { useState, useEffect } from "react";
import { ExpenseRequestDTO, ExpenseResponseDTO, Category } from "../types/expense";
import { getAllCategories, createCategory } from "../services/categoryService";
import { Icon } from "../utils/iconUtils";

interface ExpenseFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dto: ExpenseRequestDTO) => Promise<void>;
    editingExpense: ExpenseResponseDTO | null;
    initialData: {
        description: string;
        amount: string;
        categoryId: string;
        paymentMethod: string;
        expenseDate: string;
        userId: number;
    };
}

const predefinedIcons = [
    "shopping-bag", "car", "film", "zap", "heart", "home", "credit-card", "plane",
    "scissors", "utensils", "shopping-cart", "briefcase", "gift", "book", "users",
];

// Convert PascalCase to kebab-case
const pascalToKebab = (str: string): string => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
};

export default function ExpenseForm({ isOpen, onClose, onSubmit, editingExpense, initialData }: ExpenseFormProps) {
    const [formData, setFormData] = useState(initialData);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryIcon, setNewCategoryIcon] = useState("");
    const [iconSearchQuery, setIconSearchQuery] = useState("");
    const [allLucideIcons, setAllLucideIcons] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories(initialData.userId);
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, initialData.userId]);

    useEffect(() => {
        const loadAllIcons = async () => {
            try {
                const icons = await import("lucide-react");
                const iconNames = Object.keys(icons).filter(key =>
                    key !== "default" &&
                    key !== "createLucideIcon" &&
                    key !== "LucideIcon" &&
                    key !== "icons" &&
                    !key.startsWith("Lucid") && // Exclude names starting with "Lucid"
                    !key.endsWith("Icon") && // Exclude names ending with "Icon"
                    key.charAt(0) !== key.charAt(0).toLowerCase() // Must start with uppercase (icon names)
                );
                console.log('Loaded Lucide icons:', iconNames.length, 'Sample:', iconNames.slice(0, 10));
                // Convert PascalCase names to kebab-case for Icon component
                const kebabCaseIcons: string[] = iconNames.map(pascalToKebab);
                console.log('Converted to kebab-case:', kebabCaseIcons.slice(0, 10));

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

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim() || !newCategoryIcon) {
            alert('Please enter a category name and select an icon');
            return;
        }

        // Check if category already exists
        const existingCategory = categories.find(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase());
        if (existingCategory) {
            alert('Category already exists!');
            return;
        }

        try {
            const newCategory = await createCategory({
                userId: initialData.userId,
                name: newCategoryName.trim(),
                icon: newCategoryIcon,
                type: 'EXPENSE',
            });
            setCategories([...categories, newCategory]);
            setFormData({ ...formData, categoryId: newCategory.categoryId.toString() });
            setShowNewCategoryModal(false);
            setNewCategoryName("");
            setNewCategoryIcon("");
            setIconSearchQuery("");
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'new') {
            setShowNewCategoryModal(true);
        } else {
            setFormData({ ...formData, categoryId: e.target.value });
        }
    };

    const filteredIcons = iconSearchQuery.trim() && allLucideIcons.length > 0
        ? allLucideIcons.filter((iconName) =>
            iconName.toLowerCase().includes(iconSearchQuery.toLowerCase())
        )
        : predefinedIcons;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dto: ExpenseRequestDTO = {
            userId: formData.userId,
            categoryId: parseInt(formData.categoryId),
            amount: parseFloat(formData.amount),
            description: formData.description,
            paymentMethod: formData.paymentMethod,
            expenseDate: formData.expenseDate,
        };
        await onSubmit(dto);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="card max-w-md w-full animate-in">
                <h2 className="text-2xl font-bold mb-6">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expense Name
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-field"
                            placeholder="e.g., Grocery Shopping"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                $
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="input-field pl-8"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={handleCategoryChange}
                            className="input-field"
                            required
                            disabled={loadingCategories}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.name}
                                </option>
                            ))}
                            <option value="new">+ Create New Category</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Method
                        </label>
                        <input
                            type="text"
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            className="input-field"
                            placeholder="e.g., Credit Card"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.expenseDate}
                            onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary flex-1">
                            {editingExpense ? 'Update' : 'Add'} Expense
                        </button>
                    </div>
                </form>
            </div>

            {/* New Category Modal */}
            {showNewCategoryModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div className="card max-w-md w-full animate-in">
                        <h2 className="text-2xl font-bold mb-6">Create New Category</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Travel"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Icon
                                </label>
                                <input
                                    type="text"
                                    value={iconSearchQuery}
                                    onChange={(e) => setIconSearchQuery(e.target.value)}
                                    className="input-field mb-3"
                                    placeholder="Search all Lucide icons (e.g., gym, car, food)..."
                                />
                                {!iconSearchQuery && (
                                    <p className="text-xs text-gray-500 mb-2">Popular icons shown below. Start typing to search all {allLucideIcons.length > 0 ? allLucideIcons.length : ''} Lucide icons.</p>
                                )}
                                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                                    {filteredIcons.map((iconName) => (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => setNewCategoryIcon(iconName)}
                                            className={`p-2 border rounded-lg hover:bg-gray-50 ${newCategoryIcon === iconName ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                                }`}
                                            title={iconName}
                                        >
                                            <Icon name={iconName} size={20} />
                                        </button>
                                    ))}
                                </div>
                                {filteredIcons.length === 0 && iconSearchQuery && (
                                    <p className="text-sm text-gray-500 mt-2">No icons found for "{iconSearchQuery}"</p>
                                )}
                                {filteredIcons.length > 0 && iconSearchQuery && (
                                    <p className="text-xs text-gray-500 mt-2">{filteredIcons.length} icons found</p>
                                )}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNewCategoryModal(false);
                                        setNewCategoryName("");
                                        setNewCategoryIcon("");
                                        setIconSearchQuery("");
                                    }}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    className="btn-primary flex-1"
                                    disabled={!newCategoryName.trim() || !newCategoryIcon}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}