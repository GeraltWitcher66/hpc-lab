import { useState, useEffect } from 'react';
import { Plus, ClipboardList, Trash2, Edit2, Calendar } from 'lucide-react';
import type { Program } from '../types/program';
import { getPrograms, deleteProgram, generateProgramId, createEmptyDay, addProgram } from '../lib/programStorage';

interface Props {
  onOpenProgram: (id: string | null) => void; // null = new
}

export default function ProgramsPage({ onOpenProgram }: Props) {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    setPrograms(getPrograms());
  }, []);

  const handleCreate = () => {
    const newProgram: Program = {
      id: generateProgramId(),
      name: 'برنامه جدید',
      goal: '',
      notes: '',
      weeksCount: 1,
      days: [createEmptyDay(1, 1)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addProgram(newProgram);
    setPrograms(getPrograms());
    onOpenProgram(newProgram.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این برنامه مطمئن هستید؟')) {
      deleteProgram(id);
      setPrograms(getPrograms());
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fa-IR');
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">طراحی برنامه تمرینی</h1>
          <p className="text-slate-500 mt-1">ساخت و مدیریت برنامه‌های تمرینی</p>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          <Plus size={18} />
          برنامه جدید
        </button>
      </div>

      {programs.length === 0 ? (
        <div className="card p-12 text-center">
          <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 mb-4">هنوز برنامه‌ای ساخته نشده است.</p>
          <button onClick={handleCreate} className="btn-primary">
            <Plus size={18} />
            ساخت اولین برنامه
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {programs.map((p) => (
            <div key={p.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 truncate">{p.name}</h3>
                  {p.goal && <p className="text-sm text-slate-500 mt-0.5 truncate">{p.goal}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onOpenProgram(p.id)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                    title="ویرایش"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {p.clientName && (
                <p className="text-sm text-primary-600 mt-2">شاگرد: {p.clientName}</p>
              )}
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {p.weeksCount} هفته
                </span>
                <span>{p.days.length} روز تمرینی</span>
                <span>
                  {p.days.reduce((sum, d) => sum + d.exercises.length, 0)} حرکت
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                آخرین ویرایش: {formatDate(p.updatedAt)}
              </div>

              <button
                onClick={() => onOpenProgram(p.id)}
                className="btn-secondary w-full mt-4 text-sm"
              >
                باز کردن برنامه
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
