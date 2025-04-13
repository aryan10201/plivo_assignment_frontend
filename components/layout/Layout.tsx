import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Incidents', href: '/incidents' },
  { name: 'Components', href: '/components' },
  { name: 'Settings', href: '/settings' },
];

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">
            StatusPage
          </Link>
          <nav className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  router.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main className="container py-6">{children}</main>
    </div>
  );
} 