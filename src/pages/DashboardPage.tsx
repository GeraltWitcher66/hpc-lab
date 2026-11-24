import { useMemo } from 'react';
import { Dumbbell, ClipboardList, Users, BarChart3, Plus, ArrowLeft } from 'lucide-react';
import { getExercises } from '../lib/storage';
import { getPrograms } from '../lib/programStorage';
import { getClients } from '../lib/clientStorage';
import { getAssessments } from '../lib/assessmentStorage';

interface Props {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: Props) {
  const stats = useMemo(() => {
    const exercises = getExercises();
    const programs = getPrograms();
    const clients = getClients();
    const assessments = getAssessments();

    const recentPrograms = [...programs]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5);

    const recentClients = [...clients]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5);

    const recentAssessments = [...assessments]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    const totalProgramExercises = programs.reduce(
      (sum, p) => sum + p.days.reduce((s, d) => s + d.exercises.length, 0),
      0
    );

    return {
      exerciseCount: exercises.length,
      programCount: programs.length,
      clientCount: clients.length,
      assessmentCount: assessments.length,
      totalProgramExercises,
      recentPrograms,
      recentClients,
      recentAssessments,
    };
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fa-IR');
    } catch {
      return iso;
    }
  };

  const cards = [
    {
      label: 'حرکات بانک',
      value: stats.exerciseCount,
      icon: Dumbbell,
      color: 'bg-sky-500',
      page: 'exercises',
    },
    {
      label: 'برنامه‌ها',
      value: stats.programCount,
      icon: ClipboardList,
      color: 'bg-violet-500',
      page: 'programs',
    },
    {
      label: 'شاگردان',
      value: stats.clientCount,
      icon: Users,
      color: 'bg-emerald-500',
      page: 'clients',
    },
    {
      label: 'ارزیابی‌ها',
      value: stats.assessmentCount,
      icon: BarChart3,
      color: 'bg-amber-500',
      page: 'reports',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">داشبورد</h1>
        <p className="text-slate-500 mt-1">خلاصه وضعیت HPC Lab</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.page}
              onClick={() => onNavigate(c.page)}
              className="card p-5 text-right hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center text-white`}>
                  <Icon size={20} />
                </div>
                <ArrowLeft size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{c.value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{c.label}</div>
            </button>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="card p-5 mb-8">
        <h2 className="font-semibold text-slate-800 mb-4">دسترسی سریع</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('exercises')} className="btn-primary">
            <Plus size={16} />
            حرکت جدید
          </button>
          <button onClick={() => onNavigate('programs')} className="btn-secondary">
            <Plus size={16} />
            برنامه جدید
          </button>
          <button onClick={() => onNavigate('clients')} className="btn-secondary">
            <Plus size={16} />
            شاگرد جدید
          </button>
          <button onClick={() => onNavigate('reports')} className="btn-secondary">
            <Plus size={16} />
            ارزیابی جدید
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent programs */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">آخرین برنامه‌ها</h2>
            <button onClick={() => onNavigate('programs')} className="text-xs text-primary-600 hover:underline">
              همه
            </button>
          </div>
          {stats.recentPrograms.length === 0 ? (
            <p className="text-sm text-slate-400">برنامه‌ای نیست</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentPrograms.map((p) => (
                <li key={p.id} className="text-sm">
                  <div className="font-medium text-slate-800 truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                    {p.clientName && <span>{p.clientName}</span>}
                    <span>{formatDate(p.updatedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent clients */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">آخرین شاگردان</h2>
            <button onClick={() => onNavigate('clients')} className="text-xs text-primary-600 hover:underline">
              همه
            </button>
          </div>
          {stats.recentClients.length === 0 ? (
            <p className="text-sm text-slate-400">شاگردی نیست</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentClients.map((c) => (
                <li key={c.id} className="text-sm">
                  <div className="font-medium text-slate-800 truncate">{c.fullName || c.code}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.trainingGoal || 'بدون هدف'} · {formatDate(c.updatedAt)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent assessments */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">آخرین ارزیابی‌ها</h2>
            <button onClick={() => onNavigate('reports')} className="text-xs text-primary-600 hover:underline">
              همه
            </button>
          </div>
          {stats.recentAssessments.length === 0 ? (
            <p className="text-sm text-slate-400">ارزیابی‌ای نیست</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentAssessments.map((a) => (
                <li key={a.id} className="text-sm">
                  <div className="font-medium text-slate-800 truncate">{a.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {a.clientName} · {formatDate(a.date)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400">
        مجموع حرکات داخل برنامه‌ها: {stats.totalProgramExercises} · نسخه ۰.۴.۰
      </div>
    </div>
  );
}
