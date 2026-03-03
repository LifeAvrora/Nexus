'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const items = [
  { href: '/dashboard', label: 'Главная', icon: '⌂' },
  { href: '/dashboard/logs', label: 'Логи', icon: '≡' }
] as const;

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
    await fetch('/api/auth/logout', { method: 'POST', headers: { 'x-csrf-token': csrfToken } });
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {isOpen && <button className="fixed inset-0 z-20 bg-black/60 md:block lg:hidden" onClick={onClose} aria-label="Close sidebar" />}

      <aside
        className={`fixed left-0 top-0 z-30 h-full w-[260px] border-r border-[#2A2A37] bg-[#0B0B0F] transition-transform lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} hidden md:flex lg:hidden`}
      >
        <SidebarContent pathname={pathname} onClose={onClose} onLogout={logout} mobile />
      </aside>

      <aside className="hidden h-full w-[260px] border-r border-[#2A2A37] bg-[#0B0B0F] lg:flex">
        <SidebarContent pathname={pathname} onClose={onClose} onLogout={logout} />
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  onClose,
  onLogout,
  mobile
}: {
  pathname: string;
  onClose: () => void;
  onLogout: () => Promise<void>;
  mobile?: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-24 items-center border-b border-[#2A2A37] px-6">
        <Image src="/nexus-logo.svg" alt="Nexus" width={178} height={42} priority className="h-9 w-auto" />
      </div>

      <nav className="space-y-2 border-b border-[#2A2A37] p-4">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={mobile ? onClose : undefined}
              className={`relative flex items-center gap-4 rounded-md px-4 py-4 text-base transition ${
                active ? 'bg-[#1A1A25] text-white' : 'text-zinc-300 hover:bg-[#171720]'
              }`}
            >
              {active && <span className="absolute left-0 top-3 h-12 w-1 rounded-r bg-[#D2253E]" />}
              <span className="text-[24px] leading-none">{item.icon}</span>
              <span className="text-[20px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-4 rounded-md px-4 py-4 text-left text-zinc-300 transition hover:bg-[#171720]"
        >
          <span className="text-[24px] leading-none">→</span>
          <span className="text-[20px] font-medium">Выход</span>
        </button>
      </nav>

      <div className="mt-auto border-t border-[#2A2A37] p-6">
        <div className="h-10 w-28 rounded-full bg-[#1A1A25]" />
      </div>
    </div>
  );
}
