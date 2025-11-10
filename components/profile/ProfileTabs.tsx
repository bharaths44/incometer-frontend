import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Tag, CreditCard, Settings } from 'lucide-react';

interface ProfileTabsProps {
	activeTab: string;
	onTabChange: (value: string) => void;
}

export function ProfileTabs({
	activeTab: _activeTab,
	onTabChange: _onTabChange,
}: ProfileTabsProps) {
	return (
		<TabsList className='grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-muted/50 p-1'>
			<TabsTrigger
				value='personal'
				className='data-[state=active]:bg-background'
			>
				<User className='h-4 w-4 mr-2' />
				Personal Info
			</TabsTrigger>
			<TabsTrigger
				value='categories'
				className='data-[state=active]:bg-background'
			>
				<Tag className='h-4 w-4 mr-2' />
				Categories
			</TabsTrigger>
			<TabsTrigger
				value='payment-methods'
				className='data-[state=active]:bg-background'
			>
				<CreditCard className='h-4 w-4 mr-2' />
				Payment Methods
			</TabsTrigger>
			<TabsTrigger
				value='account'
				className='data-[state=active]:bg-background'
			>
				<Settings className='h-4 w-4 mr-2' />
				Account
			</TabsTrigger>
		</TabsList>
	);
}
