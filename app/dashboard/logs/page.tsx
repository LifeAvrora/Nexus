import { LogsTable } from '@/components/dashboard/logs-table';

export default function LogsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Logs</h1>
      <LogsTable />
    </section>
  );
}
