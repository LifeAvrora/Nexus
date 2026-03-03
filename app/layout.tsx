import type { Metadata } from 'next';
import './globals.css';
import { NotificationProvider } from '@/components/notifications/notification-provider';

export const metadata: Metadata = {
  title: 'NEXUS Admin',
  description: 'Ultra-secure enterprise SaaS admin platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
