'use client';

import { useEffect, useState } from 'react';
import { useNotify } from '@/components/notifications/notification-provider';

type Log = { id: string; service: string; message: string; ip: string; createdAt: string };

async function getCsrfToken() {
  const res = await fetch('/api/auth/csrf', { cache: 'no-store' });
  const data = await res.json();
  return data.csrfToken as string;
}

export function LogsTable() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { notify } = useNotify();

  const load = async (nextPage = page) => {
    const response = await fetch(`/api/logs?page=${nextPage}&pageSize=10`);
    if (!response.ok) return;
    const data = await response.json();
    setLogs(data.items);
    setTotal(data.total);
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const remove = async (id: string) => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`/api/logs?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-csrf-token': csrfToken }
    });

    if (response.ok) {
      notify({ title: 'Success', message: 'Log removed', variant: 'success' });
      load();
      return;
    }

    notify({ title: 'Error', message: 'Delete failed', variant: 'error' });
  };

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">Resource: s foff1c</p>
        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-[#303043] bg-[#191926] px-4 py-2 text-sm text-zinc-200">Filter ▾</button>
          <button className="rounded-xl border border-[#303043] bg-[#191926] px-4 py-2 text-sm text-zinc-200">G8xđ14 ···</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#303043] bg-[#14141A]">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="border-b border-[#2A2A37] text-zinc-300">
              <tr>
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Message</th>
                <th className="p-4 font-medium">IP</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[#1E1E2B] text-zinc-200">
                  <td className="p-4">{log.service}</td>
                  <td className="max-w-[320px] truncate p-4" title={log.message}>{log.message}</td>
                  <td className="p-4 font-mono text-zinc-300">{log.ip}</td>
                  <td className="p-4 text-zinc-300">{new Date(log.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      onClick={() => remove(log.id)}
                      className="rounded-lg border border-[#303043] bg-[#1B1B29] px-3 py-2 text-xs text-zinc-100 hover:bg-[#25253A]"
                    >
                      ○
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#2A2A37] p-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span>{(page - 1) * 10 + 1} - {Math.min(total, page * 10)} of {total || 0}</span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-[#303043] bg-[#1B1B29] px-3 py-1 disabled:opacity-50">◀</button>
            <span className="rounded-md bg-[#24243A] px-3 py-1 text-zinc-100">{page}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-[#303043] bg-[#1B1B29] px-3 py-1 disabled:opacity-50">▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}
