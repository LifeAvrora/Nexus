'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotify } from '@/components/notifications/notification-provider';

type Mode = 'login' | 'register';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,128}$/;

export function AuthForm({ mode }: { mode: Mode }) {
  const [csrfToken, setCsrfToken] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { notify } = useNotify();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/csrf').then(async (r) => {
      const data = await r.json();
      setCsrfToken(data.csrfToken);
    });
  }, []);

  const passwordHint = useMemo(
    () => '12+ chars with upper/lowercase letters, number, and special symbol.',
    []
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (mode === 'register') {
      if (!passwordPattern.test(password)) {
        notify({ title: 'Error', message: passwordHint, variant: 'error' });
        return;
      }

      if (password !== confirmPassword) {
        notify({ title: 'Error', message: 'Passwords do not match.', variant: 'error' });
        return;
      }

      if (fullName.trim().length < 2) {
        notify({ title: 'Error', message: 'Full name is required.', variant: 'error' });
        return;
      }
    }

    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload =
      mode === 'login'
        ? { email, password }
        : { fullName: fullName.trim(), email, password, confirmPassword };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({ error: 'Request failed' }));
    setLoading(false);

    if (!response.ok) {
      notify({ title: 'Error', message: data.error || 'Request failed', variant: 'error' });
      return;
    }

    notify({ title: 'Success', message: mode === 'login' ? 'Welcome back.' : 'Account created and signed in.', variant: 'success' });
    router.push('/dashboard/logs');
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-lg border border-zinc-800 bg-card p-6">
      {mode === 'register' && (
        <div className="space-y-2">
          <label className="text-sm text-zinc-200">Full Name</label>
          <input
            type="text"
            required
            minLength={2}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm"
            placeholder="John Doe"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm text-zinc-200">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm"
          placeholder="example@email.com"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-zinc-200">Password</label>
        <input
          type="password"
          required
          minLength={12}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm"
          placeholder="••••••••••••"
        />
        {mode === 'register' && <p className="text-xs text-zinc-400">{passwordHint}</p>}
      </div>
      {mode === 'register' && (
        <div className="space-y-2">
          <label className="text-sm text-zinc-200">Confirm Password</label>
          <input
            type="password"
            required
            minLength={12}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm"
            placeholder="••••••••••••"
          />
        </div>
      )}
      <button disabled={loading || !csrfToken} className="h-10 w-full rounded-md bg-red-700 text-sm font-medium hover:bg-red-600 disabled:opacity-50">
        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
}
