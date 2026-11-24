import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Download, Upload, Trash2, Info, Database, AlertTriangle } from 'lucide-react';
import { getExercises, saveExercises } from '../lib/storage';
import { getPrograms, savePrograms } from '../lib/programStorage';
import { getClients, saveClients } from '../lib/clientStorage';
import { getAssessments, saveAssessments } from '../lib/assessmentStorage';

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const showMsg = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const exportAll = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: 'HPC Lab',
      exercises: getExercises(),
      programs: getPrograms(),
      clients: getClients(),
      assessments: getAssessments(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hpc-lab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('ok', 'فایل پشتیبان دانلود شد.');
  };

  const exportCSV = (kind: 'exercises' | 'clients') => {
    let csv = '';
    let filename = '';

    if (kind === 'exercises') {
      const rows = getExercises();
      const headers = ['code', 'nameFa', 'nameEn', 'difficulty', 'equipment', 'primaryMuscles', 'trainingGoal'];
      csv = headers.join(',') + '\n';
      rows.forEach((r) => {
        const line = [
          r.code,
          `"${r.nameFa.replace(/"/g, '""')}"`,
          `"${(r.nameEn || '').replace(/"/g, '""')}"`,
          r.difficulty,
          `"${(r.equipment || []).join(';')}"`,
          `"${(r.primaryMuscles || []).join(';')}"`,
          `"${(r.trainingGoal || []).join(';')}"`,
        ].join(',');
        csv += line + '\n';
      });
      filename = 'hpc-lab-exercises.csv';
    } else {
      const rows = getClients();
      const headers = ['code', 'fullName', 'phone', 'email', 'age', 'gender', 'sport', 'trainingGoal'];
      csv = headers.join(',') + '\n';
      rows.forEach((r) => {
        const line = [
          r.code,
          `"${(r.fullName || '').replace(/"/g, '""')}"`,
          r.phone,
          r.email,
          r.age,
          r.gender,
          `"${(r.sport || '').replace(/"/g, '""')}"`,
          `"${(r.trainingGoal || '').replace(/"/g, '""')}"`,
        ].join(',');
        csv += line + '\n';
      });
      filename = 'hpc-lab-clients.csv';
    }

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('ok', `فایل ${filename} دانلود شد.`);
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data || typeof data !== 'object') throw new Error('فرمت نامعتبر');

        if (Array.isArray(data.exercises)) saveExercises(data.exercises);
        if (Array.isArray(data.programs)) savePrograms(data.programs);
        if (Array.isArray(data.clients)) saveClients(data.clients);
        if (Array.isArray(data.assessments)) saveAssessments(data.assessments);

        showMsg('ok', 'داده‌ها با موفقیت وارد شدند. صفحه را رفرش کنید.');
      } catch {
        showMsg('err', 'خطا در خواندن فایل. مطمئن شوید فایل پشتیبان HPC Lab است.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearAll = () => {
    if (!confirm('همه داده‌ها (حرکات، برنامه‌ها، شاگردان، ارزیابی‌ها) پاک شوند؟ این عمل قابل برگشت نیست.')) {
      return;
    }
    if (!confirm('برای تأیید نهایی دوباره تأیید کنید.')) return;

    localStorage.removeItem('hpc-lab-exercises');
    localStorage.removeItem('hpc-lab-programs');
    localStorage.removeItem('hpc-lab-clients');
    localStorage.removeItem('hpc-lab-assessments');
    showMsg('ok', 'همه داده‌ها پاک شد. صفحه را رفرش کنید.');
  };

  const counts = {
    exercises: getExercises().length,
    programs: getPrograms().length,
    clients: getClients().length,
    assessments: getAssessments().length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">تنظیمات</h1>
        <p className="text-slate-500 mt-1">پشتیبان‌گیری، خروجی داده و مدیریت سیستم</p>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm ${
            message.type === 'ok' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Data overview */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Database size={18} />
          وضعیت داده‌ها
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-slate-900">{counts.exercises}</div>
            <div className="text-slate-500">حرکت</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-slate-900">{counts.programs}</div>
            <div className="text-slate-500">برنامه</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-slate-900">{counts.clients}</div>
            <div className="text-slate-500">شاگرد</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-slate-900">{counts.assessments}</div>
            <div className="text-slate-500">ارزیابی</div>
          </div>
        </div>
      </div>

      {/* Backup / Export */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Download size={18} />
          پشتیبان‌گیری و خروجی
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          فایل JSON کامل برای بازیابی، یا CSV برای انتقال به اکسل/نرم‌افزار دیگر.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={exportAll} className="btn-primary">
            <Download size={16} />
            پشتیبان کامل (JSON)
          </button>
          <button onClick={() => exportCSV('exercises')} className="btn-secondary">
            خروجی CSV حرکات
          </button>
          <button onClick={() => exportCSV('clients')} className="btn-secondary">
            خروجی CSV شاگردان
          </button>
        </div>
      </div>

      {/* Import */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Upload size={18} />
          بازیابی از پشتیبان
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          فایل JSON قبلی را انتخاب کنید. داده‌های فعلی با محتوای فایل جایگزین می‌شوند.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
        <button onClick={() => fileRef.current?.click()} className="btn-secondary">
          <Upload size={16} />
          انتخاب فایل پشتیبان
        </button>
      </div>

      {/* Danger zone */}
      <div className="card p-5 mb-6 border-red-200">
        <h2 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} />
          منطقه خطر
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          پاک کردن همه داده‌ها غیرقابل بازگشت است. قبل از آن پشتیبان بگیرید.
        </p>
        <button onClick={clearAll} className="btn-danger">
          <Trash2 size={16} />
          پاک کردن همه داده‌ها
        </button>
      </div>

      {/* About */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          درباره سیستم
        </h2>
        <dl className="text-sm space-y-2 text-slate-600">
          <div className="flex gap-2">
            <dt className="text-slate-400 w-28 shrink-0">نام</dt>
            <dd>HPC Lab — سیستم طراحی تمرین</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-400 w-28 shrink-0">نسخه</dt>
            <dd>۰.۴.۰</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-400 w-28 shrink-0">ذخیره‌سازی</dt>
            <dd>محلی (مرورگر) — بدون سرور</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-400 w-28 shrink-0">مالکیت</dt>
            <dd>کامل در اختیار شما — بدون لایسنس دوره‌ای</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-400 w-28 shrink-0">فونت</dt>
            <dd>Vazirmatn</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
