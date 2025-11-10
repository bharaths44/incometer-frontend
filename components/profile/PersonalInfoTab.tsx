import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { User, Mail, Phone, Edit2, Save } from 'lucide-react';

interface PersonalInfoTabProps {
	isEditing: boolean;
	editData: {
		name: string;
		email: string;
		password: string;
		phone: string;
	};
	profile: {
		name: string;
		email: string;
		password: string;
		phone: string;
	};
	onEditChange: (data: {
		name: string;
		email: string;
		password: string;
		phone: string;
	}) => void;
	onSave: () => void;
	onEditToggle: () => void;
}

export function PersonalInfoTab({
	isEditing,
	editData,
	profile,
	onEditChange,
	onSave,
	onEditToggle,
}: PersonalInfoTabProps) {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle>Personal Information</CardTitle>
						<CardDescription>
							Update your profile details
						</CardDescription>
					</div>
					<Button
						variant={isEditing ? 'default' : 'outline'}
						onClick={() => (isEditing ? onSave() : onEditToggle())}
					>
						{isEditing ? (
							<>
								<Save className='h-4 w-4 mr-2' />
								Save Changes
							</>
						) : (
							<>
								<Edit2 className='h-4 w-4 mr-2' />
								Edit Profile
							</>
						)}
					</Button>
				</div>
			</CardHeader>
			<CardContent className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='space-y-2'>
						<Label htmlFor='name' className='text-sm font-medium'>
							Full Name
						</Label>
						<div className='flex items-center gap-2'>
							<User className='h-4 w-4 text-muted-foreground' />
							<Input
								id='name'
								value={isEditing ? editData.name : profile.name}
								onChange={(e) =>
									onEditChange({
										...editData,
										name: e.target.value,
									})
								}
								disabled={!isEditing}
								className='flex-1'
							/>
						</div>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='email' className='text-sm font-medium'>
							Email Address
						</Label>
						<div className='flex items-center gap-2'>
							<Mail className='h-4 w-4 text-muted-foreground' />
							<Input
								id='email'
								type='email'
								value={
									isEditing ? editData.email : profile.email
								}
								onChange={(e) =>
									onEditChange({
										...editData,
										email: e.target.value,
									})
								}
								disabled={!isEditing}
								className='flex-1'
							/>
						</div>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='space-y-2'>
						<Label htmlFor='phone' className='text-sm font-medium'>
							Phone Number
						</Label>
						<div className='flex items-center gap-2'>
							<Phone className='h-4 w-4 text-muted-foreground' />
							<Input
								id='phone'
								type='tel'
								value={
									isEditing ? editData.phone : profile.phone
								}
								onChange={(e) =>
									onEditChange({
										...editData,
										phone: e.target.value,
									})
								}
								disabled={!isEditing}
								className='flex-1'
								placeholder='Enter phone number'
							/>
						</div>
					</div>
					<div className='space-y-2'>
						<Label
							htmlFor='password'
							className='text-sm font-medium'
						>
							Change Password
						</Label>
						<div className='flex items-center gap-2'>
							<Edit2 className='h-4 w-4 text-muted-foreground' />
							<Input
								id='password'
								type='password'
								value={
									isEditing
										? editData.password
										: profile.password
								}
								onChange={(e) =>
									onEditChange({
										...editData,
										password: e.target.value,
									})
								}
								disabled={!isEditing}
								className='flex-1'
								placeholder='Enter new password'
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
