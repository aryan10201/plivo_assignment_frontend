// components/layout/Sidebar.jsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Grid, 
  Users,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Incidents',
      href: '/incidents',
      icon: AlertTriangle,
    },
    {
      name: 'Components',
      href: '/components',
      icon: Grid,
    },
    {
      name: 'Subscribers',
      href: '/subscribers',
      icon: Users,
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={cn(
      "min-h-screen bg-slate-900 text-white transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex justify-between items-center p-4 border-b border-slate-800">
        {!collapsed && <div className="font-bold text-xl">Status Page</div>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="mt-6">
        <ul>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name} className="mb-2">
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 transition-colors",
                    isActive 
                      ? "bg-slate-800 text-white" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
          <li className="mb-2">
            <a 
              href="/status"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center px-4 py-3 transition-colors",
                "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <ExternalLink className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Status Page</span>}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}