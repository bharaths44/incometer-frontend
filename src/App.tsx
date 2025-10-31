import { useState } from 'react';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Expenses from '@/pages/Expenses';
import Income from '@/pages/Income';
import Analytics from '@/pages/Analytics';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Layout from '@/components/layout/Layout';

type Page =
	| 'landing'
	| 'login'
	| 'signup'
	| 'dashboard'
	| 'expenses'
	| 'income'
	| 'analytics'
	| 'profile'
	| 'settings';

function App() {
	const [currentPage, setCurrentPage] = useState<Page>('landing');
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const handleGetStarted = () => {
		setCurrentPage('login');
	};

	const handleLogin = () => {
		setIsAuthenticated(true);
		setCurrentPage('dashboard');
	};

	const handleSignup = () => {
		setIsAuthenticated(true);
		setCurrentPage('dashboard');
	};

	const handleLogout = () => {
		setIsAuthenticated(false);
		setCurrentPage('landing');
	};

	const handleNavigate = (page: string) => {
		setCurrentPage(page as Page);
	};

	if (!isAuthenticated) {
		if (currentPage === 'landing') {
			return <Landing onGetStarted={handleGetStarted} />;
		}
		if (currentPage === 'login') {
			return (
				<Login
					onLogin={handleLogin}
					onSwitchToSignup={() => setCurrentPage('signup')}
				/>
			);
		}
		if (currentPage === 'signup') {
			return (
				<Signup
					onSignup={handleSignup}
					onSwitchToLogin={() => setCurrentPage('login')}
				/>
			);
		}
	}

	return (
		<Layout
			currentPage={currentPage}
			onNavigate={handleNavigate}
			onLogout={handleLogout}
		>
			{currentPage === 'dashboard' && <Dashboard />}
			{currentPage === 'expenses' && <Expenses />}
			{currentPage === 'income' && <Income />}
			{currentPage === 'analytics' && <Analytics />}
			{currentPage === 'profile' && <Profile />}
			{currentPage === 'settings' && <Settings />}
		</Layout>
	);
}

export default App;
