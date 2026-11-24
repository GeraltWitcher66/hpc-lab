import { useState, useEffect, useMemo } from 'react';
import { Plus, BarChart3, Trash2, Edit2, Search } from 'lucide-react';
import type { Assessment } from '../types/assessment';
import { getAssessments, deleteAssessment, generateAssessmentId, addAssessment, createEmptyItem } from '../lib/assessmentStorage';
import { getClients } from '../lib/clientStorage';

interface Props {
  onOpenAssessment: (id: string | null) => void;
}

export default function AssessmentsPage({ onOpenAssessment }: Props) {
  const [list, setList] = useState<Assessment[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setList(getAssessments());
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (a) =>
        a.clientName.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.date.includes(q)
    );
  }, [list, search]);

  const handleCreate = () => {
    const clients = getClients();
    if (clients.length === 0) {
      alert('ابتدا حداقل یک شاگرد ثبت کنید.');
      return;
    }
    const client = clients[0];
    const a: Assessment = {
      id: generateAssessmentId(),
      clientId: client.id,
      clientName: client.fullName || client.code,
      date: new Date().toISOString().slice(0, 10),
      title: 'ارزیابی اولیه',
      notes: '',
      items: [createEmptyItem()],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addAssessment(a);
    setList(getAssessments());
    onOpenAssessment(a.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('این ارزیابی حذف شود؟')) {
      deleteAssessment(id);
      setList(getAssessments());
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('fa-IR');
    } catch {
      return d;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ارزیابی و گزارش پیشرفت</h1>
          <p className="text-slate-500 mt-1">ثبت ارزیابی‌های دوره‌ای و مقایسه نتایج</p>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          <Plus size={18} />
          ارزیابی جدید
        </button>
      </div>

      <div className="card p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="input pr-10"
            placeholder="جست‌وجو بر اساس شاگرد، عنوان یا تاریخ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <BarChart3 className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 mb-4">هنوز ارزیابی ثبت نشده است.</p>
          <button onClick={handleCreate} className="btn-primary">
            <Plus size={18} />
            ثبت اولین ارزیابی
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <div key={a.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{a.title}</h3>
                  <p className="text-sm text-primary-600 mt-0.5">{a.clientName}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(a.date)}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onOpenAssessment(a.id)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                {a.items.length} شاخص ثبت‌شده
              </div>
              <button onClick={() => onOpenAssessment(a.id)} className="btn-secondary w-full mt-4 text-sm">
                مشاهده / ویرایش
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
