'use client';

type TopbarProps = {
  onToggleSidebar: () => void;
};

export function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-card px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="hidden rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 md:inline-flex lg:hidden"
          aria-label="Toggle sidebar"
        >
          Меню
        </button>
        <input
          className="w-full max-w-xs rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm"
          placeholder="Search logs..."
        />
      </div>
      <div className="ml-4 h-10 w-10 rounded-full bg-zinc-700" />
    </header>
  );
}
