'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotify } from '@/components/notifications/notification-provider';

type Mode = 'login' | 'register';

export function AuthForm({ mode }: { mode: Mode }) {
  const [csrfToken, setCsrfToken] = useState('');
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { email, password } : { email, password, confirmPassword };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      notify({ title: 'Error', message: data.error || 'Request failed', variant: 'error' });
      return;
    }

    notify({ title: 'Success', message: mode === 'login' ? 'Welcome back.' : 'Account created.', variant: 'success' });

    if (mode === 'login') {
      router.push('/dashboard/logs');
      router.refresh();
    } else {
      router.push('/login');
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-lg border border-zinc-800 bg-card p-6">
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
      <button disabled={loading} className="h-10 w-full rounded-md bg-red-700 text-sm font-medium hover:bg-red-600 disabled:opacity-50">
        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
}
