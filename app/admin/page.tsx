import { getSession } from '@/lib/auth/session';

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return <main className="p-8">Forbidden</main>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Protected Admin Area</h1>
      <p className="mt-2 text-zinc-400">Only administrators can view this page.</p>
    </main>
  );
}
