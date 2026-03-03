'use client';

import { useEffect, useState } from 'react';
import { useNotify } from '@/components/notifications/notification-provider';

type Log = { id: string; service: string; message: string; ip: string; createdAt: string };

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
    const response = await fetch(`/api/logs?id=${id}`, { method: 'DELETE' });
    if (response.ok) {
      notify({ title: 'Success', message: 'Log removed', variant: 'success' });
      load();
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="rounded-lg border border-zinc-800 bg-card">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-800 text-zinc-300">
          <tr>
            <th className="p-3">Service</th>
            <th className="p-3">Message</th>
            <th className="p-3">IP</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-zinc-900">
              <td className="p-3">{log.service}</td>
              <td className="max-w-xs truncate p-3" title={log.message}>{log.message}</td>
              <td className="p-3 font-mono">{log.ip}</td>
              <td className="p-3">{new Date(log.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <button onClick={() => remove(log.id)} className="rounded bg-zinc-800 px-2 py-1 text-xs hover:bg-zinc-700">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between p-3 text-sm text-zinc-400">
        <span>Page {page} of {totalPages}</span>
        <div className="space-x-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded bg-zinc-800 px-2 py-1 disabled:opacity-50">Prev</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded bg-zinc-800 px-2 py-1 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
