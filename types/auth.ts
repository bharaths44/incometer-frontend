export interface User {
	userId: string;
	name: string;
	email: string;
	phoneNumber: string;
	createdAt: string;
	updatedAt: string;
}

export interface SignUpRequest {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
}

export interface SignInRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	token: string;
	refreshToken?: string;
}

export interface OAuthProvider {
	name: 'github' | 'google';
	displayName: string;
	icon: string;
}
