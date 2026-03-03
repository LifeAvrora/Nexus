'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F0F14] p-8 md:p-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1760px] overflow-hidden rounded-2xl border border-[#2A2A37] bg-[#12121A]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onToggleSidebar={() => {}} />
          <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
