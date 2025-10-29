import { useState } from "react";

import { createCategory } from "../services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IconSelector from "./IconSelector";
import { Category } from "@/types/category";

interface NewCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (category: Category) => void;
    categories: Category[];
    userId: number;
    allLucideIcons: string[];
    predefinedIcons: string[];
}

const predefinedIcons = [
    "shopping-bag", "car", "film", "zap", "heart", "home", "credit-card", "plane",
    "scissors", "utensils", "shopping-cart", "briefcase", "gift", "book", "users",
];

export default function NewCategoryModal({
    isOpen,
    onClose,
    onCreate,
    categories,
    userId,
    allLucideIcons,
    predefinedIcons: propPredefinedIcons
}: NewCategoryModalProps) {
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryIcon, setNewCategoryIcon] = useState("");
    const [iconSearchQuery, setIconSearchQuery] = useState("");

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
                userId,
                name: newCategoryName.trim(),
                icon: newCategoryIcon,
                type: 'EXPENSE',
            });
            onCreate(newCategory);
            handleClose();
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    const handleClose = () => {
        setNewCategoryName("");
        setNewCategoryIcon("");
        setIconSearchQuery("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name
                        </Label>
                        <Input
                            id="newCategoryName"
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="e.g., Travel"
                            required
                        />
                    </div>
                    <IconSelector
                        selectedIcon={newCategoryIcon}
                        onSelect={setNewCategoryIcon}
                        searchQuery={iconSearchQuery}
                        setSearchQuery={setIconSearchQuery}
                        allIcons={allLucideIcons}
                        predefinedIcons={propPredefinedIcons || predefinedIcons}
                    />
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant="secondary"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreateCategory}
                            className="flex-1"
                            disabled={!newCategoryName.trim() || !newCategoryIcon}
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}