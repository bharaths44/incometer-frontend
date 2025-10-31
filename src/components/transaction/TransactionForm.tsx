import { TransactionRequestDTO, TransactionResponseDTO, TransactionConfig } from "@/types/transaction";
import TransactionFormModal from "@/components/transaction/TransactionFormModal";

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

export default function TransactionForm({ isOpen, onClose, onSubmit, editingTransaction, initialData, config }: TransactionFormProps) {
    return (
        <TransactionFormModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={onSubmit}
            editingTransaction={editingTransaction}
            initialData={initialData}
            config={config}
        />
    );
}
