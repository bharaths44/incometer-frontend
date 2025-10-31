import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import NewCategoryModal from "../NewCategoryModal";
import { Category } from "../../types/category";
import { PREDEFINED_ICONS } from "../../lib/constants";
import { Icon } from "../../utils/iconUtils";
import { Button } from "@/components/ui/button";

interface CategoryManagementProps {
    userId: number;
    allLucideIcons: string[];
}

type CategoryType = 'ALL' | 'EXPENSE' | 'INCOME';

export default function CategoryManagement({ userId, allLucideIcons }: CategoryManagementProps) {
    console.log('CategoryManagement received allLucideIcons:', allLucideIcons.length, 'icons');
    console.log('First 5 icons:', allLucideIcons.slice(0, 5));

    const { data: categories = [], isLoading } = useCategories(userId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<CategoryType>('ALL');
    const [searchQuery, setSearchQuery] = useState("");

    const handleCreateCategory = (category: Category) => {
        // The mutation will handle cache invalidation
        console.log("Category created:", category);
    };

    const filteredCategories = categories.filter(category => {
        const matchesType = selectedType === 'ALL' || category.type === selectedType;
        const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const renderCategoryItem = (category: Category) => (
        <div
            key={category.categoryId}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon name={category.icon} className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{category.type.toLowerCase()}</div>
                </div>
            </div>
            <div className="text-sm text-gray-400">
                ID: {category.categoryId}
            </div>
        </div>
    );

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Categories</h3>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <span>+</span>
                        Add Category
                    </Button>
                </div>

                {/* Type Filter */}
                <div className="flex gap-2">
                    <Button
                        variant={selectedType === 'ALL' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedType('ALL')}
                    >
                        All
                    </Button>
                    <Button
                        variant={selectedType === 'EXPENSE' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedType('EXPENSE')}
                    >
                        Expense
                    </Button>
                    <Button
                        variant={selectedType === 'INCOME' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedType('INCOME')}
                    >
                        Income
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                {/* Categories List */}
                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {searchQuery || selectedType !== 'ALL'
                                ? "No categories found matching your criteria."
                                : "No categories found."}
                        </div>
                    ) : (
                        filteredCategories.map(renderCategoryItem)
                    )}
                </div>
            </div>

            <NewCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateCategory}
                categories={categories}
                userId={userId}
                allLucideIcons={allLucideIcons}
                predefinedIcons={PREDEFINED_ICONS}
                defaultType={selectedType === 'ALL' ? 'EXPENSE' : selectedType}
            />
        </>
    );
}