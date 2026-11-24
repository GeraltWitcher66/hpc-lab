import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Save, Plus, Trash2 } from 'lucide-react';
import type { Assessment } from '../types/assessment';
import {
  getAssessment,
  updateAssessment,
  createEmptyItem,
  getClientAssessments,
} from '../lib/assessmentStorage';
import { getClients } from '../lib/clientStorage';

interface Props {
  assessmentId: string;
  onBack: () => void;
}

const CATEGORIES = ['دامنه حرکتی', 'قدرت', 'تعادل', 'کنترل حرکتی', 'عملکردی', 'اختصاصی رشته', 'سایر'];

export default function AssessmentEditorPage({ assessmentId, onBack }: Props) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [saved, setSaved] = useState(false);
  const [clients] = useState(() => getClients());

  useEffect(() => {
    const a = getAssessment(assessmentId);
    if (a) setAssessment(a);
  }, [assessmentId]);

  const history = useMemo(() => {
    if (!assessment) return [];
    return getClientAssessments(assessment.clientId).filter((a) => a.id !== assessment.id);
  }, [assessment]);

  const comparisonRows = useMemo(() => {
    if (!assessment || history.length === 0) return [];
    const names = [...new Set(assessment.items.map((i) => i.name).filter(Boolean))];
    return names.map((name) => {
      const current = assessment.items.find((i) => i.name === name);
      const past = history.map((h) => {
        const found = h.items.find((i) => i.name === name);
        return { date: h.date, value: found?.value || '—', unit: found?.unit || '' };
      });
      return {
        name,
        current: current?.value || '—',
        unit: current?.unit || '',
        past,
      };
    });
  }, [assessment, history]);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('fa-IR');
    } catch {
      return d;
    }
  };

  if (!assessment) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">در حال بارگذاری...</p>
        <button onClick={onBack} className="btn-secondary mt-4">
          بازگشت
        </button>
      </div>
    );
  }

  const persist = (updated: Assessment) => {
    setAssessment(updated);
    updateAssessment(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const setMeta = (field: keyof Assessment, value: string) => {
    const next: Assessment = { ...assessment, [field]: value } as Assessment;
    if (field === 'clientId') {
      const c = clients.find((x) => x.id === value);
      next.clientName = c ? c.fullName || c.code : '';
    }
    persist(next);
  };

  const updateItem = (itemId: string, field: string, value: string) => {
    const items = assessment.items.map((it) =>
      it.id === itemId ? { ...it, [field]: value } : it
    );
    persist({ ...assessment, items });
  };

  const addItem = () => {
    persist({ ...assessment, items: [...assessment.items, createEmptyItem()] });
  };

  const removeItem = (itemId: string) => {
    if (assessment.items.length <= 1) return;
    persist({ ...assessment, items: assessment.items.filter((it) => it.id !== itemId) });
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-secondary !px-3">
            <ArrowRight size={18} />
          </button>
          <div>
            <input
              className="text-2xl font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary-500 focus:outline-none"
              value={assessment.title}
              onChange={(e) => setMeta('title', e.target.value)}
            />
            <p className="text-sm text-slate-500 mt-1">{assessment.clientName}</p>
          </div>
        </div>
        {saved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <Save size={14} /> ذخیره شد
          </span>
        )}
      </div>

      <div className="space-y-6">
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">اطلاعات ارزیابی</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">شاگرد</label>
              <select
                className="input"
                value={assessment.clientId}
                onChange={(e) => setMeta('clientId', e.target.value)}
              >
                {clients.length === 0 ? (
                  <option value={assessment.clientId}>{assessment.clientName || '—'}</option>
                ) : (
                  clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName || c.code}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="label">تاریخ</label>
              <input
                type="date"
                className="input"
                value={assessment.date}
                onChange={(e) => setMeta('date', e.target.value)}
              />
            </div>
            <div>
              <label className="label">عنوان</label>
              <input
                className="input"
                value={assessment.title}
                onChange={(e) => setMeta('title', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="label">یادداشت کلی</label>
            <textarea
              className="input min-h-[60px]"
              value={assessment.notes}
              onChange={(e) => setMeta('notes', e.target.value)}
            />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">شاخص‌ها و نتایج</h2>
            <button onClick={addItem} className="btn-secondary text-sm">
              <Plus size={14} />
              افزودن شاخص
            </button>
          </div>

          <div className="space-y-3">
            {assessment.items.map((item, idx) => (
              <div key={item.id} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs text-slate-400 pt-2 w-5">{idx + 1}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 flex-1">
                    <div>
                      <label className="label text-xs">نام شاخص</label>
                      <input
                        className="input text-sm"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="مثلاً اسکوات ۱RM"
                      />
                    </div>
                    <div>
                      <label className="label text-xs">دسته</label>
                      <select
                        className="input text-sm"
                        value={item.category}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label text-xs">مقدار</label>
                      <input
                        className="input text-sm"
                        value={item.value}
                        onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label text-xs">واحد</label>
                      <input
                        className="input text-sm"
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                        placeholder="kg / درجه / ثانیه"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded mt-5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="pr-7">
                  <input
                    className="input text-sm"
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                    placeholder="توضیح اختیاری..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {comparisonRows.length > 0 && (
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4">مقایسه با ارزیابی‌های قبلی</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 px-3 font-medium">شاخص</th>
                    <th className="py-2 px-3 font-medium">فعلی ({formatDate(assessment.date)})</th>
                    {history.slice(0, 3).map((h) => (
                      <th key={h.id} className="py-2 px-3 font-medium">
                        {formatDate(h.date)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.name} className="border-b border-slate-100">
                      <td className="py-2.5 px-3 font-medium text-slate-800">{row.name}</td>
                      <td className="py-2.5 px-3 text-primary-700 font-semibold">
                        {row.current} {row.unit}
                      </td>
                      {row.past.slice(0, 3).map((p, i) => (
                        <td key={i} className="py-2.5 px-3 text-slate-600">
                          {p.value} {p.unit && p.value !== '—' ? p.unit : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              هدف: کمک به تصمیم‌گیری مربی — نه تشخیص پزشکی.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
