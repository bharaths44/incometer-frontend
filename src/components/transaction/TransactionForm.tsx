import { useState, useEffect } from "react";
import { TransactionRequestDTO, TransactionResponseDTO, TransactionConfig } from "../../types/transaction";
import { getAllCategories } from "../../services/categoryService";
import { getAllPaymentMethods } from "../../services/paymentMethodService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewCategoryModal from "../NewCategoryModal";
import NewPaymentMethodModal from "../NewPaymentMethodModal";
import { PaymentMethodResponseDTO } from "@/types/paymentMethod";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Category } from "@/types/category";

interface TransactionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dto: TransactionRequestDTO) => Promise<void>;
    editingTransaction: TransactionResponseDTO | null;
    initialData: {
        description: string;
        amount: string;
        categoryId: string;
        paymentMethodId: string;
        date: string;
        userId: number;
    };
    config: TransactionConfig;
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

export default function TransactionForm({ isOpen, onClose, onSubmit, editingTransaction, initialData, config }: TransactionFormProps) {
    const [formData, setFormData] = useState(initialData);
    const [categories, setCategories] = useState<Category[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponseDTO[]>([]);
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [allLucideIcons, setAllLucideIcons] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
    const [showNewPaymentMethodModal, setShowNewPaymentMethodModal] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories(initialData.userId);
                setCategories(data.filter(cat => cat.type === (config.type === 'expense' ? 'EXPENSE' : 'INCOME')));
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        const fetchPaymentMethods = async () => {
            try {
                console.log('Fetching payment methods for user:', initialData.userId);
                const data = await getAllPaymentMethods(initialData.userId);
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
    }, [isOpen, initialData.userId, config.type]);

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

    const handleCategoryChange = (value: string) => {
        if (value === 'new') {
            setShowNewCategoryModal(true);
        } else {
            setFormData({ ...formData, categoryId: value });
        }
    };

    const handlePaymentMethodChange = (value: string) => {
        if (value === 'new') {
            setShowNewPaymentMethodModal(true);
        } else {
            setFormData({ ...formData, paymentMethodId: value });
        }
    };

    const handleCategoryCreate = (newCategory: Category) => {
        setCategories([...categories, newCategory]);
        setFormData({ ...formData, categoryId: newCategory.categoryId.toString() });
    };

    const handlePaymentMethodCreate = (newPaymentMethod: PaymentMethodResponseDTO) => {
        setPaymentMethods([...paymentMethods, newPaymentMethod]);
        setFormData({ ...formData, paymentMethodId: newPaymentMethod.paymentMethodId.toString() });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
            alert('Please enter a valid amount greater than 0');
            return;
        }
        if (!formData.categoryId) {
            alert('Please select a category');
            return;
        }
        if (!formData.paymentMethodId) {
            alert(`Please select a ${config.type === 'income' ? 'received method' : 'payment method'}`);
            return;
        }
        if (!formData.date) {
            alert(`Please select a ${config.formLabels.date.toLowerCase()}`);
            return;
        }

        const dto: TransactionRequestDTO = {
            userId: formData.userId,
            categoryId: parseInt(formData.categoryId),
            amount: parseFloat(formData.amount),
            description: formData.description.trim(),
            paymentMethodId: parseInt(formData.paymentMethodId),
            transactionDate: formData.date,
            transactionType: config.type === 'expense' ? 'EXPENSE' : 'INCOME',
        };
        await onSubmit(dto);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingTransaction ? `Edit ${config.formTitle}` : `Add New ${config.formTitle}`}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                {config.formLabels.description}
                            </Label>
                            <Input
                                id="description"
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder={`e.g., ${config.type === 'expense' ? 'Grocery Shopping' : 'Freelance Project'}`}
                            />
                        </div>
                        <div>
                            <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                {config.formLabels.amount}
                            </Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    ₹
                                </span>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="pl-8"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                {config.formLabels.category}
                            </Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={handleCategoryChange}
                                disabled={loadingCategories}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={`category-${cat.categoryId}`} value={cat.categoryId.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="new">+ Create New Category</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="paymentMethodId" className="block text-sm font-medium text-gray-700 mb-2">
                                {config.formLabels.paymentMethod}
                            </Label>
                            <Select
                                value={formData.paymentMethodId}
                                onValueChange={handlePaymentMethodChange}
                                disabled={loadingPaymentMethods}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={config.type === 'income' ? "Select Received Method" : "Select Payment Method"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentMethods.map((pm) => (
                                        <SelectItem key={`payment-${pm.paymentMethodId}`} value={pm.paymentMethodId.toString()}>
                                            {pm.displayName}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="new">+ Create New Payment Method</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                {config.formLabels.date}
                            </Label>
                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal ${!formData.date && "text-muted-foreground"
                                            }`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date ? format(new Date(formData.date), "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.date ? new Date(formData.date) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const day = String(date.getDate()).padStart(2, '0');
                                                const dateString = `${year}-${month}-${day}`;
                                                setFormData({ ...formData, date: dateString });
                                            } else {
                                                setFormData({ ...formData, date: "" });
                                            }
                                            setIsCalendarOpen(false);
                                        }}
                                        autoFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="secondary"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1">
                                {editingTransaction ? `Update ${config.formTitle}` : `Add ${config.formTitle}`}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <NewCategoryModal
                isOpen={showNewCategoryModal}
                onClose={() => setShowNewCategoryModal(false)}
                onCreate={handleCategoryCreate}
                categories={categories}
                userId={initialData.userId}
                allLucideIcons={allLucideIcons}
                predefinedIcons={predefinedIcons}
                defaultType={config.type === 'expense' ? 'EXPENSE' : 'INCOME'}
            />

            <NewPaymentMethodModal
                isOpen={showNewPaymentMethodModal}
                onClose={() => setShowNewPaymentMethodModal(false)}
                onCreate={handlePaymentMethodCreate}
                paymentMethods={paymentMethods}
                userId={initialData.userId}
                allLucideIcons={allLucideIcons}
                predefinedIcons={predefinedIcons}
            />

        </>
    );
}