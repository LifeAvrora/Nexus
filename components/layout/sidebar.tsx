'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Главная' },
  { href: '/dashboard/logs', label: 'Логи' }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="hidden h-full w-[260px] flex-col border-r border-zinc-800 bg-sidebar md:flex lg:flex">
      <div className="h-16 border-b border-zinc-800 px-4 py-4 text-xl font-semibold">NEXUS</div>
      <nav className="space-y-1 p-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-2 ${pathname === item.href ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
          >
            {item.label}
          </Link>
        ))}
        <button onClick={logout} className="block w-full rounded-md px-3 py-2 text-left text-zinc-400 hover:bg-zinc-900">
          Выход
        </button>
      </nav>
    </aside>
  );
}
