import TransactionPage from "../components/transaction/TransactionPage";
import { createExpenseService } from "../services/transactionService";

export default function Expenses() {
    const service = createExpenseService();
    return <TransactionPage config={service.config} service={service} />;
}
