import { useState, useEffect, useMemo } from 'react';
import { Plus, Users, Trash2, Edit2, Search, Phone, Target } from 'lucide-react';
import type { Client } from '../types/client';
import { getClients, deleteClient, generateClientId, generateClientCode, addClient } from '../lib/clientStorage';
import { getPrograms } from '../lib/programStorage';

interface Props {
  onOpenClient: (id: string | null) => void;
}

export default function ClientsPage({ onOpenClient }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setClients(getClients());
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.trainingGoal.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const handleCreate = () => {
    const newClient: Client = {
      id: generateClientId(),
      code: generateClientCode(),
      fullName: '',
      phone: '',
      email: '',
      age: '',
      gender: '',
      sport: '',
      trainingGoal: '',
      trainingHistory: '',
      availableEquipment: '',
      limitations: '',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addClient(newClient);
    setClients(getClients());
    onOpenClient(newClient.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این شاگرد مطمئن هستید؟ برنامه‌های مرتبط حذف نمی‌شوند.')) {
      deleteClient(id);
      setClients(getClients());
    }
  };

  const getClientProgramCount = (clientId: string) => {
    return getPrograms().filter((p) => p.clientId === clientId).length;
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
          <h1 className="text-2xl font-bold text-slate-900">مدیریت شاگردان</h1>
          <p className="text-slate-500 mt-1">ثبت و مدیریت اطلاعات شاگردان</p>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          <Plus size={18} />
          شاگرد جدید
        </button>
      </div>

      <div className="card p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="input pr-10"
            placeholder="جست‌وجو بر اساس نام، کد، تلفن یا هدف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-slate-500 mt-2">
          {filtered.length} از {clients.length} شاگرد
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 mb-4">
            {clients.length === 0 ? 'هنوز شاگردی ثبت نشده است.' : 'نتیجه‌ای یافت نشد.'}
          </p>
          {clients.length === 0 && (
            <button onClick={handleCreate} className="btn-primary">
              <Plus size={18} />
              ثبت اولین شاگرد
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 truncate">
                    {c.fullName || 'بدون نام'}
                  </h3>
                  {c.trainingGoal && (
                    <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                      <Target size={12} />
                      {c.trainingGoal}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onOpenClient(c.id)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                    title="ویرایش"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm text-slate-500">
                {c.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} />
                    {c.phone}
                  </div>
                )}
                {c.age && <div>سن: {c.age}</div>}
                {c.sport && <div>رشته: {c.sport}</div>}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{getClientProgramCount(c.id)} برنامه</span>
                <span>{formatDate(c.updatedAt)}</span>
              </div>

              <button
                onClick={() => onOpenClient(c.id)}
                className="btn-secondary w-full mt-4 text-sm"
              >
                مشاهده / ویرایش
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
