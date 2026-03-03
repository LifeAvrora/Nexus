import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#111118] p-8">
        <div className="mb-8 flex items-center gap-3">
          <img src="/nexus-logo.svg" alt="Nexus" className="h-8 w-8" />
          <h1 className="text-3xl font-semibold">Welcome back</h1>
        </div>
        <p className="text-zinc-400">Sign in to your dashboard</p>
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-zinc-400">
          Don&apos;t have an account? <Link className="text-red-500" href="/register">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
