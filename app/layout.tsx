import type React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Incometer - Financial Expense Tracker',
	description: 'Track your income and expenses with ease',
	generator: 'v0.app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${geistSans.className} antialiased`}>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
