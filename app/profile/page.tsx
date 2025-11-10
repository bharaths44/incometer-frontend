'use client';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layout/app-layout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { PersonalInfoTab } from '@/components/profile/PersonalInfoTab';
import { AccountInfoTab } from '@/components/profile/AccountInfoTab';
import { CategoryManagement } from '@/components/profile/CategoryManagement';
import { PaymentMethodManagement } from '@/components/profile/PaymentMethodManagement';
import { useProfilePageLogic } from '@/components/profile/ProfilePageLogic';

export default function ProfilePage() {
	const {
		isEditing,
		setIsEditing,
		activeTab,
		setActiveTab,
		profile,
		editData,
		setEditData,
		userId,
		handleSave,
	} = useProfilePageLogic();

	return (
		<AppLayout>
			<div className='space-y-6'>
				<ProfileHeader />

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className='space-y-6'
				>
					<ProfileTabs
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>

					<TabsContent value='personal' className='space-y-6 mt-6'>
						<PersonalInfoTab
							isEditing={isEditing}
							editData={editData}
							profile={profile}
							onEditChange={setEditData}
							onSave={handleSave}
							onEditToggle={() => setIsEditing(true)}
						/>
					</TabsContent>

					<TabsContent value='categories' className='mt-6'>
						<CategoryManagement userId={userId} />
					</TabsContent>

					<TabsContent value='payment-methods' className='mt-6'>
						<PaymentMethodManagement userId={userId} />
					</TabsContent>

					<TabsContent value='account' className='space-y-6 mt-6'>
						<AccountInfoTab />
					</TabsContent>
				</Tabs>
			</div>
		</AppLayout>
	);
}
