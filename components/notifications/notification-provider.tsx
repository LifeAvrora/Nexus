'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { NotificationVariant } from '@/types/auth';

type Notice = { id: string; title: string; message: string; variant: NotificationVariant };

const NotificationContext = createContext<{
  notify: (notice: Omit<Notice, 'id'>) => void;
} | null>(null);

const styles: Record<NotificationVariant, string> = {
  success: 'border-l-4 border-green-500',
  error: 'border-l-4 border-red-500',
  warning: 'border-l-4 border-amber-500',
  info: 'border-l-4 border-blue-500'
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);

  const notify = useCallback((notice: Omit<Notice, 'id'>) => {
    const id = crypto.randomUUID();
    setNotices((prev) => [...prev, { ...notice, id }]);
    setTimeout(() => {
      setNotices((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-md flex-col gap-2 sm:right-6 sm:top-6">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`rounded-md bg-card px-4 py-3 text-sm shadow transition-all duration-300 ${styles[notice.variant]}`}
          >
            <p className="font-semibold text-white">{notice.title}</p>
            <p className="text-zinc-300">{notice.message}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotify must be used within NotificationProvider');
  return ctx;
}
