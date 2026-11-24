import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Plus, Trash2, Search, GripVertical, Save, Printer } from 'lucide-react';
import type { Program, ProgramDay, ProgramExercise } from '../types/program';
import type { Exercise } from '../types/exercise';
import { getProgram, updateProgram, createEmptyDay, createEmptyProgramExercise } from '../lib/programStorage';
import { getClients } from '../lib/clientStorage';
import type { Client } from '../types/client';
import { getExercises } from '../lib/storage';

interface Props {
  programId: string;
  onBack: () => void;
  onPrint?: () => void;
}

export default function ProgramEditorPage({ programId, onBack, onPrint }: Props) {
  const [program, setProgram] = useState<Program | null>(null);
  const [activeDayId, setActiveDayId] = useState<string>('');
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = getProgram(programId);
    if (p) {
      setProgram(p);
      if (p.days.length > 0) setActiveDayId(p.days[0].id);
    }
    setAllExercises(getExercises());
    setClients(getClients());
  }, [programId]);

  const activeDay = useMemo(
    () => program?.days.find((d) => d.id === activeDayId),
    [program, activeDayId]
  );

  const filteredExercises = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    if (!q) return allExercises;
    return allExercises.filter(
      (e) =>
        e.nameFa.toLowerCase().includes(q) ||
        e.nameEn.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q)
    );
  }, [allExercises, pickerSearch]);

  if (!program) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">برنامه یافت نشد.</p>
        <button onClick={onBack} className="btn-secondary mt-4">بازگشت</button>
      </div>
    );
  }

  const persist = (updated: Program) => {
    setProgram(updated);
    updateProgram(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const updateMeta = (field: keyof Program, value: string | number) => {
    persist({ ...program, [field]: value });
  };

  const assignClient = (clientId: string) => {
    if (!clientId) {
      persist({ ...program, clientId: undefined, clientName: undefined, clientCode: undefined });
      return;
    }
    const c = clients.find((x) => x.id === clientId);
    persist({
      ...program,
      clientId,
      clientName: c ? (c.fullName || c.code) : undefined,
      clientCode: c ? c.code : undefined,
    });
  };

  const addDay = () => {
    const week = program.weeksCount || 1;
    // day number within current structure
    const daysInWeek = program.days.filter((d) => d.weekNumber === week).length;
    const dayNum = daysInWeek + 1;
    const newDay = createEmptyDay(week, dayNum);
    const updated = { ...program, days: [...program.days, newDay] };
    persist(updated);
    setActiveDayId(newDay.id);
  };

  const updateDayWeek = (dayId: string, weekNumber: number) => {
    const days = program.days.map((d) =>
      d.id === dayId ? { ...d, weekNumber: Math.max(1, weekNumber) } : d
    );
    persist({ ...program, days });
  };

  const removeDay = (dayId: string) => {
    if (program.days.length <= 1) {
      alert('حداقل یک روز باید باقی بماند.');
      return;
    }
    if (!confirm('این روز و تمام حرکاتش حذف شود؟')) return;
    const days = program.days.filter((d) => d.id !== dayId);
    const updated = { ...program, days };
    persist(updated);
    if (activeDayId === dayId) setActiveDayId(days[0]?.id || '');
  };

  const updateDayName = (dayId: string, name: string) => {
    const days = program.days.map((d) => (d.id === dayId ? { ...d, name } : d));
    persist({ ...program, days });
  };

  const addExerciseToDay = (ex: Exercise) => {
    if (!activeDay) return;
    const order = activeDay.exercises.length + 1;
    const progEx = createEmptyProgramExercise(
      ex.id,
      ex.nameFa,
      ex.nameEn,
      ex.code,
      ex.videoUrl,
      ex.imageUrl,
      order
    );
    const days = program.days.map((d) =>
      d.id === activeDayId ? { ...d, exercises: [...d.exercises, progEx] } : d
    );
    persist({ ...program, days });
    setShowExercisePicker(false);
    setPickerSearch('');
  };

  const clearDayExercises = () => {
    if (!activeDay || activeDay.exercises.length === 0) return;
    if (!confirm('همه حرکات این روز پاک شوند؟')) return;
    const days = program.days.map((d) =>
      d.id === activeDayId ? { ...d, exercises: [] } : d
    );
    persist({ ...program, days });
  };

  const removeExercise = (exId: string) => {
    if (!activeDay) return;
    const days = program.days.map((d) =>
      d.id === activeDayId
        ? { ...d, exercises: d.exercises.filter((e) => e.id !== exId).map((e, i) => ({ ...e, order: i + 1 })) }
        : d
    );
    persist({ ...program, days });
  };

  const updateExerciseField = (exId: string, field: keyof ProgramExercise, value: string | number) => {
    if (!activeDay) return;
    const days = program.days.map((d) =>
      d.id === activeDayId
        ? {
            ...d,
            exercises: d.exercises.map((e) =>
              e.id === exId ? { ...e, [field]: value } : e
            ),
          }
        : d
    );
    persist({ ...program, days });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-secondary !px-3">
            <ArrowRight size={18} />
          </button>
          <div>
            <input
              className="text-2xl font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary-500 focus:outline-none w-full max-w-md"
              value={program.name}
              onChange={(e) => updateMeta('name', e.target.value)}
            />
            <input
              className="text-sm text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary-500 focus:outline-none mt-1 w-full max-w-md"
              placeholder="هدف برنامه..."
              value={program.goal}
              onChange={(e) => updateMeta('goal', e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Save size={14} /> ذخیره شد
            </span>
          )}
          {onPrint && (
            <button onClick={onPrint} className="btn-secondary text-sm">
              <Printer size={16} />
              خروجی PDF
            </button>
          )}
          <div className="flex items-center gap-2 text-sm">
            <label className="text-slate-500">شاگرد:</label>
            <select
              className="input w-48"
              value={program.clientId || ''}
              onChange={(e) => assignClient(e.target.value)}
            >
              <option value="">بدون شاگرد</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName || 'بدون نام'} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <label className="text-slate-500">تعداد هفته:</label>
            <input
              type="number"
              min={1}
              max={52}
              className="input w-20"
              value={program.weeksCount}
              onChange={(e) => updateMeta('weeksCount', parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Days sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="card p-3 space-y-1">
            <div className="text-xs font-medium text-slate-500 px-2 py-1">روزهای تمرینی</div>
            {program.days.map((day) => (
              <button
                key={day.id}
                onClick={() => setActiveDayId(day.id)}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  activeDayId === day.id
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="truncate">
                  <span className="text-xs text-slate-400 ml-1">و{day.weekNumber}</span>
                  {day.name}
                </span>
                <span className="text-xs text-slate-400">{day.exercises.length}</span>
              </button>
            ))}
            <button onClick={addDay} className="w-full btn-secondary text-sm mt-2">
              <Plus size={14} />
              افزودن روز
            </button>
          </div>
        </div>

        {/* Day content */}
        <div className="flex-1 min-w-0">
          {activeDay ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className="input font-semibold text-lg w-48"
                    value={activeDay.name}
                    onChange={(e) => updateDayName(activeDay.id, e.target.value)}
                  />
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-slate-500">هفته:</span>
                    <input
                      type="number"
                      min={1}
                      max={program.weeksCount || 52}
                      className="input w-16 text-sm"
                      value={activeDay.weekNumber}
                      onChange={(e) => updateDayWeek(activeDay.id, parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <button
                    onClick={() => removeDay(activeDay.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="حذف روز"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setShowExercisePicker(true)} className="btn-primary">
                    <Plus size={16} />
                    افزودن حرکت از بانک
                  </button>
                  {activeDay.exercises.length > 0 && (
                    <button onClick={clearDayExercises} className="btn-secondary text-sm">
                      پاک کردن حرکات روز
                    </button>
                  )}
                </div>
              </div>

              {activeDay.exercises.length === 0 ? (
                <div className="card p-10 text-center">
                  <p className="text-slate-500 mb-4">هنوز حرکتی به این روز اضافه نشده.</p>
                  <button onClick={() => setShowExercisePicker(true)} className="btn-primary">
                    <Plus size={16} />
                    انتخاب حرکت
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeDay.exercises.map((ex, idx) => (
                    <div key={ex.id} className="card p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-slate-300 pt-1">
                          <GripVertical size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div>
                              <span className="text-xs font-mono text-slate-400 ml-2">{idx + 1}.</span>
                              <span className="font-semibold text-slate-900">{ex.nameFa}</span>
                              <span className="text-sm text-slate-500 mr-2"> / {ex.nameEn}</span>
                              <span className="text-xs font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                {ex.code}
                              </span>
                            </div>
                            <button
                              onClick={() => removeExercise(ex.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            <div>
                              <label className="label text-xs">ست</label>
                              <input
                                type="number"
                                min={1}
                                className="input text-sm"
                                value={ex.sets}
                                onChange={(e) => updateExerciseField(ex.id, 'sets', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            <div>
                              <label className="label text-xs">تکرار</label>
                              <input
                                className="input text-sm"
                                value={ex.reps}
                                onChange={(e) => updateExerciseField(ex.id, 'reps', e.target.value)}
                                placeholder="8-12"
                              />
                            </div>
                            <div>
                              <label className="label text-xs">شدت / وزن</label>
                              <input
                                className="input text-sm"
                                value={ex.intensity}
                                onChange={(e) => updateExerciseField(ex.id, 'intensity', e.target.value)}
                                placeholder="مثلاً 60kg"
                              />
                            </div>
                            <div>
                              <label className="label text-xs">RPE</label>
                              <input
                                className="input text-sm"
                                value={ex.rpe}
                                onChange={(e) => updateExerciseField(ex.id, 'rpe', e.target.value)}
                                placeholder="7"
                              />
                            </div>
                            <div>
                              <label className="label text-xs">RIR</label>
                              <input
                                className="input text-sm"
                                value={ex.rir}
                                onChange={(e) => updateExerciseField(ex.id, 'rir', e.target.value)}
                                placeholder="2"
                              />
                            </div>
                            <div>
                              <label className="label text-xs">استراحت (ثانیه)</label>
                              <input
                                type="number"
                                min={0}
                                className="input text-sm"
                                value={ex.restSeconds}
                                onChange={(e) => updateExerciseField(ex.id, 'restSeconds', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                            <div>
                              <label className="label text-xs">تمپو</label>
                              <input
                                className="input text-sm"
                                value={ex.tempo}
                                onChange={(e) => updateExerciseField(ex.id, 'tempo', e.target.value)}
                                placeholder="3-0-1-0"
                              />
                            </div>
                            <div>
                              <label className="label text-xs">مدت / مسافت</label>
                              <input
                                className="input text-sm"
                                value={ex.duration}
                                onChange={(e) => updateExerciseField(ex.id, 'duration', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="label text-xs">دامنه / محدودیت</label>
                              <input
                                className="input text-sm"
                                value={ex.romLimitation || ''}
                                onChange={(e) => updateExerciseField(ex.id, 'romLimitation', e.target.value)}
                                placeholder="مثلاً تا ۹۰ درجه"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="label text-xs">توضیحات مربی</label>
                              <input
                                className="input text-sm"
                                value={ex.notes}
                                onChange={(e) => updateExerciseField(ex.id, 'notes', e.target.value)}
                              />
                            </div>
                          </div>
                          {(ex.videoUrl || ex.imageUrl) && (
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                              {ex.imageUrl && (
                                <img
                                  src={ex.imageUrl}
                                  alt={ex.nameFa}
                                  className="w-14 h-14 rounded object-cover bg-slate-100"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              {ex.videoUrl && (
                                <a href={ex.videoUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                                  لینک ویدیو حرکت
                                </a>
                              )}
                              {ex.imageUrl && (
                                <a href={ex.imageUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                                  لینک تصویر
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card p-10 text-center text-slate-500">روزی انتخاب نشده است.</div>
          )}

          <div className="card p-4 mt-4">
            <label className="label">یادداشت کلی برنامه</label>
            <textarea
              className="input min-h-[70px]"
              value={program.notes || ''}
              onChange={(e) => updateMeta('notes', e.target.value)}
              placeholder="توضیحات کلی برای کل برنامه..."
            />
          </div>
        </div>
      </div>

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">انتخاب حرکت از بانک</h3>
              <button onClick={() => setShowExercisePicker(false)} className="btn-secondary !px-3 text-sm">
                بستن
              </button>
            </div>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="input pr-10"
                  placeholder="جست‌وجوی حرکت..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {filteredExercises.length === 0 ? (
                <p className="text-center text-slate-500 py-8">حرکتی یافت نشد. اول در بانک حرکات اضافه کنید.</p>
              ) : (
                filteredExercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => addExerciseToDay(ex)}
                    className="w-full text-right px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 truncate">{ex.nameFa}</div>
                      <div className="text-sm text-slate-500 truncate">{ex.nameEn} · {ex.code}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      ex.difficulty === 'مبتدی' ? 'bg-green-100 text-green-700' :
                      ex.difficulty === 'متوسط' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
