import type { ReactNode } from 'react';
import { Dumbbell, Users, ClipboardList, BarChart3, Settings, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'داشبورد', icon: Home },
  { id: 'exercises', label: 'بانک حرکات', icon: Dumbbell },
  { id: 'programs', label: 'طراحی برنامه', icon: ClipboardList },
  { id: 'clients', label: 'شاگردان', icon: Users },
  { id: 'reports', label: 'گزارش‌ها', icon: BarChart3 },
  { id: 'settings', label: 'تنظیمات', icon: Settings },
];

export default function Layout({ children, currentPage = 'exercises', onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full right-0">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-lg">
              H
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">HPC Lab</h1>
              <p className="text-xs text-slate-400">سیستم طراحی تمرین</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
          نسخه ۰.۵.۰ — کامل
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 mr-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
