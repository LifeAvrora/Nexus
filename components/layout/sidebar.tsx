'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileTextIcon, HomeIcon, LogOutIcon } from '@/components/icons/sidebar-icons';

const items = [
  { href: '/dashboard', label: 'Главная', icon: HomeIcon },
  { href: '/dashboard/logs', label: 'Логи', icon: FileTextIcon }
] as const;

async function getCsrfToken() {
  const res = await fetch('/api/auth/csrf', { cache: 'no-store' });
  const data = await res.json();
  return data.csrfToken as string;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    const csrfToken = await getCsrfToken();
    await fetch('/api/auth/logout', { method: 'POST', headers: { 'x-csrf-token': csrfToken } });
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="hidden h-full w-[72px] flex-col border-r border-white/5 bg-[#0B0B0F] pt-6 md:flex lg:w-[260px]">
      <div className="px-4 lg:px-6">
        <Image src="/nexus-logo.svg" alt="Nexus" width={178} height={42} priority className="mx-auto h-8 w-auto lg:mx-0" />
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`h-12 flex items-center gap-3 text-base transition-colors md:justify-center md:pl-0 lg:justify-start lg:pl-6 ${
                active
                  ? 'border-l-2 border-[#C62839] bg-[#14141A] text-[#F2F2F5]'
                  : 'text-[#CFCFD6] hover:bg-[#15151C] hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={2} className="shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="mt-2 h-12 flex items-center gap-3 text-base text-[#CFCFD6] transition-colors hover:bg-[#15151C] hover:text-white md:justify-center md:pl-0 lg:justify-start lg:pl-6"
        >
          <LogOutIcon size={18} strokeWidth={2} className="shrink-0" />
          <span className="hidden lg:inline">Выход</span>
        </button>
      </nav>
    </aside>
  );
}
