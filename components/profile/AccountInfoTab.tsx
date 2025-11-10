import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStats } from '@/hooks/useUser';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function AccountInfoTab() {
	const { user } = useAuthContext();
	const userId = user ? user.userId : '1';
	const { data: userStats, isLoading, error } = useUserStats(userId);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
					<CardDescription>
						Account status and activity
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{[1, 2, 3].map((i) => (
							<div key={i}>
								<Skeleton className='h-4 w-24 mb-2' />
								<Skeleton className='h-6 w-16' />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
					<CardDescription>
						Account status and activity
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-red-600 dark:text-red-400'>
						Failed to load account information. Please try again.
					</p>
				</CardContent>
			</Card>
		);
	}

	if (!userStats) {
		return null;
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
		}).format(amount);
	};

	const accountBalance =
		userStats.totalIncomeAmount - userStats.totalExpenseAmount;

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
						<p className='font-medium'>
							{userStats.totalTransactions}
						</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground mb-1'>
							Account Balance
						</p>
						<p
							className={`font-medium ${accountBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
						>
							{formatCurrency(accountBalance)}
						</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground mb-1'>
							Total Income
						</p>
						<p className='font-medium text-emerald-600 dark:text-emerald-400'>
							{formatCurrency(userStats.totalIncomeAmount)}
						</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground mb-1'>
							Total Expenses
						</p>
						<p className='font-medium text-red-600 dark:text-red-400'>
							{formatCurrency(userStats.totalExpenseAmount)}
						</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground mb-1'>
							Member Since
						</p>
						<p className='font-medium'>
							{new Date(
								userStats.accountCreatedAt
							).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
