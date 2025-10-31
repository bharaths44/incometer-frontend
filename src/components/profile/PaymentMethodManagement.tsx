import { useState } from "react";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import ItemManagement from "./ItemManagement";
import NewPaymentMethodModal from "../NewPaymentMethodModal";
import { PaymentMethodResponseDTO, PAYMENT_METHOD_TYPE_LABELS } from "../../types/paymentMethod";
import { PREDEFINED_ICONS } from "../../lib/constants";
import { Icon } from "../../utils/iconUtils";

interface PaymentMethodManagementProps {
    userId: number;
    allLucideIcons: string[];
}

export default function PaymentMethodManagement({ userId, allLucideIcons }: PaymentMethodManagementProps) {
    const { data: paymentMethods = [], isLoading } = usePaymentMethods(userId);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreatePaymentMethod = (paymentMethod: PaymentMethodResponseDTO) => {
        // The mutation will handle cache invalidation
        console.log("Payment method created:", paymentMethod);
    };

    const renderPaymentMethodItem = (paymentMethod: PaymentMethodResponseDTO) => (
        <div
            key={paymentMethod.paymentMethodId}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon name={paymentMethod.icon || "credit-card"} className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                    <div className="font-medium">{paymentMethod.displayName || paymentMethod.name}</div>
                    <div className="text-sm text-gray-500">
                        {PAYMENT_METHOD_TYPE_LABELS[paymentMethod.type] || paymentMethod.type}
                        {paymentMethod.lastFourDigits && ` •••• ${paymentMethod.lastFourDigits}`}
                    </div>
                    {paymentMethod.issuerName && (
                        <div className="text-xs text-gray-400">{paymentMethod.issuerName}</div>
                    )}
                </div>
            </div>
            <div className="text-sm text-gray-400">
                ID: {paymentMethod.paymentMethodId}
            </div>
        </div>
    );

    return (
        <>
            <ItemManagement
                title="Payment Methods"
                items={paymentMethods}
                isLoading={isLoading}
                searchPlaceholder="Search payment methods..."
                onAddClick={() => setIsModalOpen(true)}
                renderItem={renderPaymentMethodItem}
                addButtonText="Add Payment Method"
            />

            <NewPaymentMethodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreatePaymentMethod}
                paymentMethods={paymentMethods}
                userId={userId}
                allLucideIcons={allLucideIcons}
                predefinedIcons={PREDEFINED_ICONS}
            />
        </>
    );
}