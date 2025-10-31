import { useState } from "react";
import { Filter, CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Category } from "@/types/category";
import { PaymentMethodDto } from "@/types/transaction";

interface TransactionFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    selectedPaymentMethod: string;
    onPaymentMethodChange: (value: string) => void;
    dateFrom: Date | undefined;
    onDateFromChange: (date: Date | undefined) => void;
    dateTo: Date | undefined;
    onDateToChange: (date: Date | undefined) => void;
    amountMin: string;
    onAmountMinChange: (value: string) => void;
    amountMax: string;
    onAmountMaxChange: (value: string) => void;
    categories: Category[];
    paymentMethods: PaymentMethodDto[];
    type: 'expense' | 'income';
    onClearFilters: () => void;
}

export default function TransactionFilters({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedPaymentMethod,
    onPaymentMethodChange,
    dateFrom,
    onDateFromChange,
    dateTo,
    onDateToChange,
    amountMin,
    onAmountMinChange,
    amountMax,
    onAmountMaxChange,
    categories,
    paymentMethods,
    type,
    onClearFilters,
}: TransactionFiltersProps) {
    const [isDateFromOpen, setIsDateFromOpen] = useState(false);
    const [isDateToOpen, setIsDateToOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={`Search ${type}s...`}
                        className="pl-12"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select value={selectedCategory} onValueChange={onCategoryChange}>
                        <SelectTrigger className="pl-12">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={`filter-category-${cat.categoryId}`} value={cat.name}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select value={selectedPaymentMethod} onValueChange={onPaymentMethodChange}>
                        <SelectTrigger className="pl-12">
                            <SelectValue placeholder={type === 'income' ? "All Received Methods" : "All Payment Methods"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{type === 'income' ? "All Received Methods" : "All Payment Methods"}</SelectItem>
                            {paymentMethods.map((method) => (
                                <SelectItem key={`filter-payment-${method.paymentMethodId}`} value={method.paymentMethodId.toString()}>
                                    {method.displayName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Label className="block text-sm font-medium mb-1">Date From</Label>
                    <Popover open={isDateFromOpen} onOpenChange={setIsDateFromOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${!dateFrom && "text-muted-foreground"
                                    }`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dateFrom}
                                onSelect={(date) => {
                                    onDateFromChange(date);
                                    setIsDateFromOpen(false);
                                }}
                                autoFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex-1">
                    <Label className="block text-sm font-medium mb-1">Date To</Label>
                    <Popover open={isDateToOpen} onOpenChange={setIsDateToOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${!dateTo && "text-muted-foreground"
                                    }`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dateTo}
                                onSelect={(date) => {
                                    onDateToChange(date);
                                    setIsDateToOpen(false);
                                }}
                                autoFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex-1">
                    <Label className="block text-sm font-medium mb-1">Min Amount (₹)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={amountMin}
                        onChange={(e) => onAmountMinChange(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
                <div className="flex-1">
                    <Label className="block text-sm font-medium mb-1">Max Amount (₹)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={amountMax}
                        onChange={(e) => onAmountMaxChange(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={onClearFilters}
                    variant="secondary"
                >
                    Clear All Filters
                </Button>
            </div>
        </>
    );
}