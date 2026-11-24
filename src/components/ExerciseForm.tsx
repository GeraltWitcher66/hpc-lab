import { useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Exercise, Difficulty, ChainType } from '../types/exercise';
import { TRAINING_GOALS, BODY_AREAS, EQUIPMENT_OPTIONS, CATEGORIES } from '../lib/exerciseOptions';

interface Props {
  exercise: Exercise | null;
  onSave: (data: Partial<Exercise>) => void;
  onClose: () => void;
}

export default function ExerciseForm({ exercise, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    nameFa: exercise?.nameFa || '',
    nameEn: exercise?.nameEn || '',
    code: exercise?.code || '',
    movementGroup: exercise?.movementGroup || '',
    movementPattern: exercise?.movementPattern || '',
    bodyArea: exercise?.bodyArea || '',
    primaryMuscles: exercise?.primaryMuscles?.join('، ') || '',
    secondaryMuscles: exercise?.secondaryMuscles?.join('، ') || '',
    joints: exercise?.joints?.join('، ') || '',
    exerciseType: exercise?.exerciseType || '',
    trainingGoal: exercise?.trainingGoal?.join('، ') || '',
    category: exercise?.category || '',
    difficulty: (exercise?.difficulty || 'مبتدی') as Difficulty,
    equipment: exercise?.equipment?.join('، ') || '',
    bodyPosition: exercise?.bodyPosition || '',
    executionNotes: exercise?.executionNotes || '',
    commonMistakes: exercise?.commonMistakes || '',
    precautions: exercise?.precautions || '',
    videoUrl: exercise?.videoUrl || '',
    imageUrl: exercise?.imageUrl || '',
    coachNotes: exercise?.coachNotes || '',
    isUnilateral: exercise?.isUnilateral || false,
    isCompound: exercise?.isCompound ?? true,
    chainType: (exercise?.chainType || 'زنجیره بسته') as ChainType,
    alternatives: exercise?.alternatives || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      nameFa: form.nameFa.trim(),
      nameEn: form.nameEn.trim(),
      code: form.code.trim(),
      movementGroup: form.movementGroup.trim(),
      movementPattern: form.movementPattern.trim(),
      bodyArea: form.bodyArea.trim(),
      primaryMuscles: form.primaryMuscles.split(/[،,]/).map((s) => s.trim()).filter(Boolean),
      secondaryMuscles: form.secondaryMuscles.split(/[،,]/).map((s) => s.trim()).filter(Boolean),
      joints: form.joints.split(/[،,]/).map((s) => s.trim()).filter(Boolean),
      exerciseType: form.exerciseType.trim(),
      trainingGoal: form.trainingGoal.split(/[،,]/).map((s) => s.trim()).filter(Boolean),
      category: form.category.trim(),
      difficulty: form.difficulty,
      equipment: form.equipment.split(/[،,]/).map((s) => s.trim()).filter(Boolean),
      bodyPosition: form.bodyPosition.trim(),
      executionNotes: form.executionNotes.trim(),
      commonMistakes: form.commonMistakes.trim(),
      precautions: form.precautions.trim(),
      videoUrl: form.videoUrl.trim(),
      imageUrl: form.imageUrl.trim(),
      coachNotes: form.coachNotes.trim(),
      isUnilateral: form.isUnilateral,
      isCompound: form.isCompound,
      chainType: form.chainType,
      alternatives: form.alternatives.trim(),
    });
  };

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold">
            {exercise ? 'ویرایش حرکت' : 'افزودن حرکت جدید'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">نام فارسی *</label>
              <input className="input" required value={form.nameFa} onChange={(e) => set('nameFa', e.target.value)} />
            </div>
            <div>
              <label className="label">نام انگلیسی</label>
              <input className="input" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
            </div>
            <div>
              <label className="label">کد / شناسه</label>
              <input className="input" value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="خودکار تولید می‌شود" />
            </div>
            <div>
              <label className="label">سطح دشواری</label>
              <select className="input" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
                <option value="مبتدی">مبتدی</option>
                <option value="متوسط">متوسط</option>
                <option value="پیشرفته">پیشرفته</option>
              </select>
            </div>
            <div>
              <label className="label">گروه حرکتی</label>
              <input className="input" value={form.movementGroup} onChange={(e) => set('movementGroup', e.target.value)} placeholder="مثلاً اندام تحتانی" />
            </div>
            <div>
              <label className="label">الگوی حرکتی</label>
              <input className="input" value={form.movementPattern} onChange={(e) => set('movementPattern', e.target.value)} placeholder="مثلاً اسکوات" />
            </div>
            <div>
              <label className="label">ناحیه بدن</label>
              <select className="input" value={form.bodyArea} onChange={(e) => set('bodyArea', e.target.value)}>
                <option value="">انتخاب کنید</option>
                {BODY_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">عضلات اصلی (با ، جدا کنید)</label>
              <input className="input" value={form.primaryMuscles} onChange={(e) => set('primaryMuscles', e.target.value)} />
            </div>
            <div>
              <label className="label">عضلات کمکی</label>
              <input className="input" value={form.secondaryMuscles} onChange={(e) => set('secondaryMuscles', e.target.value)} />
            </div>
            <div>
              <label className="label">مفاصل درگیر</label>
              <input className="input" value={form.joints} onChange={(e) => set('joints', e.target.value)} />
            </div>
            <div>
              <label className="label">تجهیزات (با ، جدا کنید)</label>
              <input className="input" value={form.equipment} onChange={(e) => set('equipment', e.target.value)} placeholder="وزن بدن، دمبل، ..." />
            </div>
            <div>
              <label className="label">اهداف تمرینی (با ، جدا کنید)</label>
              <input className="input" value={form.trainingGoal} onChange={(e) => set('trainingGoal', e.target.value)} />
            </div>
            <div>
              <label className="label">دسته‌بندی تمرین</label>
              <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">انتخاب کنید</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">نوع حرکت</label>
              <input className="input" value={form.exerciseType} onChange={(e) => set('exerciseType', e.target.value)} placeholder="قدرتی، پایداری، اصلاحی..." />
            </div>
          </div>

          <div>
            <label className="label">وضعیت بدن و نحوه اجرا</label>
            <textarea className="input min-h-[60px]" value={form.bodyPosition} onChange={(e) => set('bodyPosition', e.target.value)} />
          </div>
          <div>
            <label className="label">نکات کلیدی اجرای صحیح</label>
            <textarea className="input min-h-[60px]" value={form.executionNotes} onChange={(e) => set('executionNotes', e.target.value)} />
          </div>
          <div>
            <label className="label">خطاهای رایج</label>
            <textarea className="input min-h-[60px]" value={form.commonMistakes} onChange={(e) => set('commonMistakes', e.target.value)} />
          </div>
          <div>
            <label className="label">موارد احتیاط و محدودیت‌ها</label>
            <textarea className="input min-h-[60px]" value={form.precautions} onChange={(e) => set('precautions', e.target.value)} />
          </div>
          <div>
            <label className="label">توضیحات اختصاصی مربی</label>
            <textarea className="input min-h-[60px]" value={form.coachNotes} onChange={(e) => set('coachNotes', e.target.value)} placeholder="یادداشت شخصی مربی برای این حرکت..." />
          </div>

          <div>
            <label className="label">حرکات جایگزین / رگرسیون / پروگرسیون</label>
            <textarea
              className="input min-h-[50px]"
              value={form.alternatives}
              onChange={(e) => set('alternatives', e.target.value)}
              placeholder="مثلاً: باکس اسکوات (رگرسیون) · گابلت اسکوات (پروگرسیون)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">لینک ویدیوی آموزشی</label>
              <input className="input" value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="label">لینک تصویر حرکت</label>
              <input className="input" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://... یا مسیر محلی" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isCompound} onChange={(e) => set('isCompound', e.target.checked)} />
              چندمفصلی
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isUnilateral} onChange={(e) => set('isUnilateral', e.target.checked)} />
              یک‌طرفه
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span>نوع زنجیره:</span>
              <select className="input w-auto" value={form.chainType} onChange={(e) => set('chainType', e.target.value)}>
                <option value="زنجیره بسته">زنجیره بسته</option>
                <option value="زنجیره باز">زنجیره باز</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">
              انصراف
            </button>
            <button type="submit" className="btn-primary">
              {exercise ? 'ذخیره تغییرات' : 'افزودن حرکت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
