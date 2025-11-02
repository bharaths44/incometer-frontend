import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionPageHeaderProps {
	title: string;
	description: string;
	addButtonText: string;
	onAddClick: () => void;
}

export default function TransactionPageHeader({
	title,
	description,
	addButtonText,
	onAddClick,
}: TransactionPageHeaderProps) {
	return (
		<div className='flex items-center justify-between'>
			<div>
				<h1 className='text-4xl font-bold mb-2'>{title}</h1>
				<p className='text-surface-variant-foreground'>{description}</p>
			</div>
			<Button onClick={onAddClick}>
				<Plus className='w-5 h-5 mr-2' />
				{addButtonText}
			</Button>
		</div>
	);
}
