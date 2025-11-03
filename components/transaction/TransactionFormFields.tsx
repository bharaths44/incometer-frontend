import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Category } from '@/types/category';
import { PaymentMethodResponseDTO } from '@/types/paymentMethod';
import { TransactionConfig } from '@/types/transaction';
import Icon from '@/lib/iconUtils';

type FormData = {
	description: string;
	amount: string;
	categoryId: string;
	paymentMethodId: string;
	date: string;
};

interface TransactionFormFieldsProps {
	formData: FormData;
	onFormDataChange: (data: Partial<FormData>) => void;
	categories: Category[];
	paymentMethods: PaymentMethodResponseDTO[];
	loadingCategories: boolean;
	loadingPaymentMethods: boolean;
	onCategoryChange: (value: string) => void;
	onPaymentMethodChange: (value: string) => void;
	config: TransactionConfig;
}

export default function TransactionFormFields({
	formData,
	onFormDataChange,
	categories,
	paymentMethods,
	loadingCategories,
	loadingPaymentMethods,
	onCategoryChange,
	onPaymentMethodChange,
	config,
}: TransactionFormFieldsProps) {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	return (
		<form className='space-y-4'>
			<div>
				<Label
					htmlFor='description'
					className='block text-sm font-medium text-foreground mb-2'
				>
					{config.formLabels.description}
				</Label>
				<Input
					id='description'
					type='text'
					value={formData.description}
					onChange={(e) =>
						onFormDataChange({ description: e.target.value })
					}
					placeholder={`e.g., ${config.type === 'expense' ? 'Grocery Shopping' : 'Freelance Project'}`}
				/>
			</div>

			<div>
				<Label
					htmlFor='amount'
					className='block text-sm font-medium text-foreground mb-2'
				>
					{config.formLabels.amount}
				</Label>
				<div className='relative'>
					<span className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground'>
						₹
					</span>
					<Input
						id='amount'
						type='number'
						step='0.01'
						value={formData.amount}
						onChange={(e) =>
							onFormDataChange({ amount: e.target.value })
						}
						className='pl-8'
						placeholder='0.00'
						required
					/>
				</div>
			</div>

			<div>
				<Label
					htmlFor='category'
					className='block text-sm font-medium text-foreground mb-2'
				>
					{config.formLabels.category}
				</Label>
				<Select
					value={formData.categoryId}
					onValueChange={onCategoryChange}
					disabled={loadingCategories}
				>
					<SelectTrigger className='w-full'>
						<SelectValue
							placeholder={`Select ${config.formLabels.category}`}
						/>
					</SelectTrigger>
					<SelectContent>
						{categories.map((cat) => (
							<SelectItem
								key={`category-${cat.categoryId}`}
								value={cat.categoryId.toString()}
							>
								<div className='flex items-center gap-2'>
									<Icon
										name={cat.icon}
										size={16}
										className='text-muted-foreground'
									/>
									<span>{cat.name}</span>
								</div>
							</SelectItem>
						))}
						<SelectItem value='new'>
							+ Create New Category
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label
					htmlFor='paymentMethodId'
					className='block text-sm font-medium text-foreground mb-2'
				>
					{config.formLabels.paymentMethod}
				</Label>
				<Select
					value={formData.paymentMethodId}
					onValueChange={onPaymentMethodChange}
					disabled={loadingPaymentMethods}
				>
					<SelectTrigger className='w-full'>
						<SelectValue
							placeholder={`Select ${config.formLabels.paymentMethod}`}
						/>
					</SelectTrigger>
					<SelectContent>
						{paymentMethods.map((pm) => (
							<SelectItem
								key={`payment-${pm.paymentMethodId}`}
								value={pm.paymentMethodId.toString()}
							>
								<div className='flex items-center gap-2'>
									{pm.icon && (
										<Icon
											name={pm.icon}
											size={16}
											className='text-muted-foreground'
										/>
									)}
									<span>{pm.displayName}</span>
								</div>
							</SelectItem>
						))}
						<SelectItem value='new'>
							+ Create New Payment Method
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label
					htmlFor='date'
					className='block text-sm font-medium text-foreground mb-2'
				>
					{config.formLabels.date}
				</Label>
				<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							className={`w-full justify-start text-left font-normal ${
								!formData.date && 'text-muted-foreground'
							}`}
						>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{formData.date
								? format(new Date(formData.date), 'PPP')
								: 'Pick a date'}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0' align='start'>
						<Calendar
							mode='single'
							selected={
								formData.date
									? new Date(formData.date)
									: undefined
							}
							onSelect={(date) => {
								if (date) {
									const year = date.getFullYear();
									const month = String(
										date.getMonth() + 1
									).padStart(2, '0');
									const day = String(date.getDate()).padStart(
										2,
										'0'
									);
									const dateString = `${year}-${month}-${day}`;
									onFormDataChange({ date: dateString });
								} else {
									onFormDataChange({ date: '' });
								}
								setIsCalendarOpen(false);
							}}
							autoFocus
						/>
					</PopoverContent>
				</Popover>
			</div>
		</form>
	);
}
