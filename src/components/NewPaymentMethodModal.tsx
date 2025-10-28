import { useState } from "react";

import { createPaymentMethod } from "../services/paymentMethodService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IconSelector from "./IconSelector";
import { PAYMENT_METHOD_TYPE_LABELS, PaymentMethodResponseDTO } from "@/types/paymentMethod";

interface NewPaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (paymentMethod: PaymentMethodResponseDTO) => void;
    paymentMethods: PaymentMethodResponseDTO[];
    userId: number;
    allLucideIcons: string[];
    predefinedIcons: string[];
}

const predefinedIcons = [
    "shopping-bag", "car", "film", "zap", "heart", "home", "credit-card", "plane",
    "scissors", "utensils", "shopping-cart", "briefcase", "gift", "book", "users",
];

export default function NewPaymentMethodModal({
    isOpen,
    onClose,
    onCreate,
    paymentMethods,
    userId,
    allLucideIcons,
    predefinedIcons: propPredefinedIcons
}: NewPaymentMethodModalProps) {
    const [newPaymentMethodDisplayName, setNewPaymentMethodDisplayName] = useState("");
    const [newPaymentMethodType, setNewPaymentMethodType] = useState<string>("");
    const [newPaymentMethodLastFourDigits, setNewPaymentMethodLastFourDigits] = useState("");
    const [newPaymentMethodIssuerName, setNewPaymentMethodIssuerName] = useState("");
    const [newPaymentMethodIcon, setNewPaymentMethodIcon] = useState("");
    const [iconSearchQuery, setIconSearchQuery] = useState("");

    const handleCreatePaymentMethod = async () => {
        if (!newPaymentMethodDisplayName.trim() || !newPaymentMethodType || !newPaymentMethodIcon) {
            alert('Please enter display name, select type, and select an icon');
            return;
        }

        // Check if payment method already exists
        const existingPaymentMethod = paymentMethods.find(pm => pm.displayName?.toLowerCase() === newPaymentMethodDisplayName.trim().toLowerCase());
        if (existingPaymentMethod) {
            alert('Payment method already exists!');
            return;
        }

        try {
            const newPaymentMethod = await createPaymentMethod({
                name: newPaymentMethodDisplayName.trim(),
                displayName: newPaymentMethodDisplayName.trim(),
                lastFourDigits: newPaymentMethodLastFourDigits || undefined,
                issuerName: newPaymentMethodIssuerName || undefined,
                type: newPaymentMethodType,
                icon: newPaymentMethodIcon,
            }, userId);
            onCreate(newPaymentMethod);
            handleClose();
        } catch (error) {
            console.error('Failed to create payment method:', error);
        }
    };

    const handleClose = () => {
        setNewPaymentMethodDisplayName("");
        setNewPaymentMethodType("");
        setNewPaymentMethodLastFourDigits("");
        setNewPaymentMethodIssuerName("");
        setNewPaymentMethodIcon("");
        setIconSearchQuery("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="newPaymentMethodDisplayName" className="block text-sm font-medium text-gray-700 mb-2">
                            Display Name
                        </Label>
                        <Input
                            id="newPaymentMethodDisplayName"
                            type="text"
                            value={newPaymentMethodDisplayName}
                            onChange={(e) => setNewPaymentMethodDisplayName(e.target.value)}
                            placeholder="e.g., HDFC Credit Card"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="newPaymentMethodType" className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                        </Label>
                        <Select value={newPaymentMethodType} onValueChange={(value) => setNewPaymentMethodType(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(PAYMENT_METHOD_TYPE_LABELS).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {PAYMENT_METHOD_TYPE_LABELS[type]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="newPaymentMethodLastFourDigits" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Four Digits (optional)
                        </Label>
                        <Input
                            id="newPaymentMethodLastFourDigits"
                            type="text"
                            value={newPaymentMethodLastFourDigits}
                            onChange={(e) => setNewPaymentMethodLastFourDigits(e.target.value)}
                            placeholder="1234"
                            maxLength={4}
                        />
                    </div>
                    <div>
                        <Label htmlFor="newPaymentMethodIssuerName" className="block text-sm font-medium text-gray-700 mb-2">
                            Issuer Name (optional)
                        </Label>
                        <Input
                            id="newPaymentMethodIssuerName"
                            type="text"
                            value={newPaymentMethodIssuerName}
                            onChange={(e) => setNewPaymentMethodIssuerName(e.target.value)}
                            placeholder="e.g., HDFC Bank"
                        />
                    </div>
                    <IconSelector
                        selectedIcon={newPaymentMethodIcon}
                        onSelect={setNewPaymentMethodIcon}
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
                            onClick={handleCreatePaymentMethod}
                            className="flex-1"
                            disabled={!newPaymentMethodDisplayName.trim() || !newPaymentMethodType || !newPaymentMethodIcon}
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}