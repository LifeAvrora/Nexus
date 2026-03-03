'use client';

type TopbarProps = {
  onToggleSidebar: () => void;
};

export function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#2A2A37] bg-[#14141A] px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#303043] text-zinc-200 md:hidden"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <h1 className="text-2xl font-semibold text-zinc-100">Logs</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-xl border border-[#303043] bg-[#1B1B29] px-3 py-2 md:flex md:w-[320px]">
          <span className="text-zinc-400">⌕</span>
          <input className="w-full bg-transparent text-zinc-200 placeholder:text-zinc-500" placeholder="Search logs..." />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3A3A4E] bg-[#232335] text-sm font-semibold">AD</div>
      </div>
    </header>
  );
}
