import { useState, useEffect } from 'react';
import { ArrowRight, Save, ClipboardList } from 'lucide-react';
import type { Client } from '../types/client';
import type { Program } from '../types/program';
import { getClient, updateClient } from '../lib/clientStorage';
import { getPrograms, updateProgram } from '../lib/programStorage';
import { getClientAssessments } from '../lib/assessmentStorage';
import type { Assessment } from '../types/assessment';

interface Props {
  clientId: string;
  onBack: () => void;
  onOpenProgram: (programId: string) => void;
}

export default function ClientEditorPage({ clientId, onBack, onOpenProgram }: Props) {
  const [client, setClient] = useState<Client | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const c = getClient(clientId);
    if (c) setClient(c);
    setPrograms(getPrograms().filter((p) => p.clientId === clientId));
    setAssessments(getClientAssessments(clientId));
  }, [clientId]);

  if (!client) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">شاگرد یافت نشد.</p>
        <button onClick={onBack} className="btn-secondary mt-4">بازگشت</button>
      </div>
    );
  }

  const persist = (updated: Client) => {
    setClient(updated);
    updateClient(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const set = (field: keyof Client, value: string) => {
    persist({ ...client, [field]: value });
  };

  const linkProgram = (programId: string) => {
    const all = getPrograms();
    const p = all.find((x) => x.id === programId);
    if (p) {
      updateProgram({
        ...p,
        clientId: client.id,
        clientName: client.fullName || client.code,
      });
      setPrograms(getPrograms().filter((x) => x.clientId === clientId));
    }
  };

  const unlinkProgram = (programId: string) => {
    const all = getPrograms();
    const p = all.find((x) => x.id === programId);
    if (p) {
      updateProgram({ ...p, clientId: undefined, clientName: undefined });
      setPrograms(getPrograms().filter((x) => x.clientId === clientId));
    }
  };

  const unlinkedPrograms = getPrograms().filter((p) => !p.clientId);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fa-IR');
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-secondary !px-3">
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {client.fullName || 'شاگرد جدید'}
            </h1>
            <p className="text-sm text-slate-500 font-mono">{client.code}</p>
          </div>
        </div>
        {saved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <Save size={14} /> ذخیره شد
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">اطلاعات پایه</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">نام و نام خانوادگی *</label>
              <input className="input" value={client.fullName} onChange={(e) => set('fullName', e.target.value)} />
            </div>
            <div>
              <label className="label">کد اختصاصی</label>
              <input className="input" value={client.code} onChange={(e) => set('code', e.target.value)} />
            </div>
            <div>
              <label className="label">تلفن</label>
              <input className="input" value={client.phone} onChange={(e) => set('phone', e.target.value)} dir="ltr" />
            </div>
            <div>
              <label className="label">ایمیل</label>
              <input className="input" value={client.email} onChange={(e) => set('email', e.target.value)} dir="ltr" />
            </div>
            <div>
              <label className="label">سن</label>
              <input className="input" value={client.age} onChange={(e) => set('age', e.target.value)} />
            </div>
            <div>
              <label className="label">جنسیت</label>
              <select className="input" value={client.gender} onChange={(e) => set('gender', e.target.value)}>
                <option value="">انتخاب کنید</option>
                <option value="مرد">مرد</option>
                <option value="زن">زن</option>
                <option value="سایر">سایر</option>
              </select>
            </div>
            <div>
              <label className="label">رشته ورزشی</label>
              <input className="input" value={client.sport} onChange={(e) => set('sport', e.target.value)} placeholder="در صورت وجود" />
            </div>
            <div>
              <label className="label">هدف تمرینی</label>
              <input className="input" value={client.trainingGoal} onChange={(e) => set('trainingGoal', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Training details */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">جزئیات تمرینی</h2>
          <div className="space-y-4">
            <div>
              <label className="label">سابقه تمرینی</label>
              <textarea className="input min-h-[70px]" value={client.trainingHistory} onChange={(e) => set('trainingHistory', e.target.value)} />
            </div>
            <div>
              <label className="label">تجهیزات و امکانات در دسترس</label>
              <textarea className="input min-h-[60px]" value={client.availableEquipment} onChange={(e) => set('availableEquipment', e.target.value)} />
            </div>
            <div>
              <label className="label">محدودیت‌های تمرینی</label>
              <textarea className="input min-h-[60px]" value={client.limitations} onChange={(e) => set('limitations', e.target.value)} placeholder="با رضایت شاگرد ثبت شود" />
            </div>
            <div>
              <label className="label">یادداشت‌های مربی</label>
              <textarea className="input min-h-[70px]" value={client.notes} onChange={(e) => set('notes', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Linked programs */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ClipboardList size={18} />
            برنامه‌های این شاگرد
          </h2>

          {programs.length === 0 ? (
            <p className="text-slate-500 text-sm mb-4">برنامه‌ای به این شاگرد متصل نیست.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {programs.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800 truncate">{p.name}</div>
                    <div className="text-xs text-slate-500">
                      {p.days.length} روز · آخرین ویرایش {formatDate(p.updatedAt)}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => onOpenProgram(p.id)} className="btn-secondary text-xs !py-1.5">
                      باز کردن
                    </button>
                    <button onClick={() => unlinkProgram(p.id)} className="text-xs text-red-600 hover:underline px-2">
                      قطع ارتباط
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {unlinkedPrograms.length > 0 && (
            <div>
              <label className="label text-xs">اتصال برنامه موجود</label>
              <select
                className="input"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    linkProgram(e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">انتخاب برنامه برای اتصال...</option>
                {unlinkedPrograms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.goal ? `— ${p.goal}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Assessments & progress */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">ارزیابی‌ها و سوابق پیشرفت</h2>
          <p className="text-xs text-slate-400 mb-3">
            نتایج ارزیابی اولیه و دوره‌ای این شاگرد — جدا از سایر شاگردان ذخیره می‌شود.
          </p>
          {assessments.length === 0 ? (
            <p className="text-sm text-slate-500">
              هنوز ارزیابی برای این شاگرد ثبت نشده. از بخش «گزارش‌ها / ارزیابی» یک ارزیابی جدید بسازید و این شاگرد را انتخاب کنید.
            </p>
          ) : (
            <div className="space-y-2">
              {assessments.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800 truncate">{a.title}</div>
                    <div className="text-xs text-slate-500">
                      {formatDate(a.date)} · {a.items.length} شاخص
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
