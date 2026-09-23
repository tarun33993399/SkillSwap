import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store';

export function AuthPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { isAuthenticated, isLoading, login, register } = useAuthStore();
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
	const isRegistering = searchParams.get('mode') === 'register';

	useEffect(() => {
		if (isAuthenticated) navigate('/profile', { replace: true });
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setError('');
		const trimmedEmail = email.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
			setError('Please enter a valid email address.');
			return;
		}
		if (password.length < 6) {
			setError('Password must be at least 6 characters.');
			return;
		}
		if (isRegistering && name.trim().length < 2) {
			setError('Please enter your name.');
			return;
		}

		setIsSubmitting(true);
		const result = isRegistering
			? await register({ name: name.trim(), email: trimmedEmail, password, role })
			: await login(trimmedEmail, password);
		setIsSubmitting(false);
		if (!result.ok) {
			setError(result.error || 'Unable to complete that request.');
			return;
		}
		navigate('/profile', { replace: true });
	};

	if (isLoading) return <div className="container-xl section-pad"><p>Loading your account...</p></div>;
	if (isAuthenticated) return null;

	return (
		<div className="container-xl section-pad">
			<div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: 'clamp(1.25rem, 4vw, 2.5rem)' }}>
				<div style={{ marginBottom: '1.75rem' }}>
					<span className="tag">SkillSwap account</span>
					<h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', color: 'var(--color-charcoal)', marginTop: '0.75rem' }}>{isRegistering ? 'Create your account' : 'Welcome back'}</h1>
					<p style={{ color: 'var(--color-ink-soft)', marginTop: '0.5rem' }}>{isRegistering ? 'Join the marketplace as a client or creator.' : 'Sign in to manage your bookings and services.'}</p>
				</div>

				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					{isRegistering && <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 700, fontSize: '0.875rem' }}>Name<input className="input" aria-label="Name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>}
					<label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 700, fontSize: '0.875rem' }}>Email<input className="input" type="email" aria-label="Email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
					<label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 700, fontSize: '0.875rem' }}>Password<input className="input" type="password" aria-label="Password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isRegistering ? 'new-password' : 'current-password'} /></label>
					{isRegistering && <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 700, fontSize: '0.875rem' }}>Account type<select className="input" aria-label="Account type" value={role} onChange={(event) => setRole(event.target.value as 'buyer' | 'seller')}><option value="buyer">Client</option><option value="seller">Creator</option></select></label>}
					{error && <span role="alert" style={{ color: 'var(--color-accent-hover)', fontSize: '0.8125rem' }}>{error}</span>}
					<button type="submit" className="btn-primary" disabled={isSubmitting} style={{ justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? 'Working...' : isRegistering ? 'Create Account' : 'Sign In'}</button>
				</form>

				<button type="button" className="btn-ghost" onClick={() => { setError(''); setSearchParams(isRegistering ? {} : { mode: 'register' }); }} style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>{isRegistering ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>
			</div>
		</div>
	);
}

export const NotFoundPage = () => <div className="container-xl section-pad"><h1>404 Not Found</h1><p>The page you are looking for does not exist.</p></div>;
