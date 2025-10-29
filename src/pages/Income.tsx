import TransactionPage from "../components/transaction/TransactionPage";
import { createIncomeService } from "../services/transactionService";

export default function Income() {
    const service = createIncomeService();
    return <TransactionPage config={service.config} service={service} />;
}
