import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AccountInfoTab() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Account Information</CardTitle>
				<CardDescription>Account status and activity</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div>
						<p className='text-sm text-muted-foreground mb-1'>
							Account Status
						</p>
						<Badge className='bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300'>
							Active
						</Badge>
					</div>
					<div>
						<p className='text-sm text-muted-foreground mb-1'>
							Total Transactions
						</p>
						<p className='font-medium'>247</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground mb-1'>
							Account Balance
						</p>
						<p className='font-medium text-emerald-600 dark:text-emerald-400'>
							₹32,389.75
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
