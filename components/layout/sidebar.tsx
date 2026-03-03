'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const items = [
  { href: '/dashboard', label: 'Главная' },
  { href: '/dashboard/logs', label: 'Логи' }
];

async function getCsrfToken() {
  const res = await fetch('/api/auth/csrf', { cache: 'no-store' });
  const data = await res.json();
  return data.csrfToken as string;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    const csrfToken = await getCsrfToken();
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'x-csrf-token': csrfToken }
    });
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {isOpen && <button className="fixed inset-0 z-20 bg-black/50 md:block lg:hidden" onClick={onClose} aria-label="Close sidebar" />}
      <aside
        className={`fixed left-0 top-0 z-30 h-full w-[260px] border-r border-zinc-800 bg-sidebar transition-transform md:top-0 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} hidden md:flex lg:hidden`}
      >
        <div className="flex h-full w-full flex-col">
          <div className="h-16 border-b border-zinc-800 px-4 py-4 text-xl font-semibold">NEXUS</div>
          <nav className="space-y-1 p-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`block rounded-md px-3 py-2 ${pathname === item.href ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
              >
                {item.label}
              </Link>
            ))}
            <button onClick={logout} className="block w-full rounded-md px-3 py-2 text-left text-zinc-400 hover:bg-zinc-900">
              Выход
            </button>
          </nav>
        </div>
      </aside>

      <aside className="hidden h-full w-[260px] border-r border-zinc-800 bg-sidebar md:hidden lg:flex">
        <div className="flex h-full w-full flex-col">
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
        </div>
      </aside>
    </>
  );
}
