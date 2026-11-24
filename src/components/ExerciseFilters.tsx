import { Search } from 'lucide-react';
import type { ExerciseFilters as Filters, Difficulty } from '../types/exercise';
import {
  TRAINING_GOALS,
  BODY_AREAS,
  EQUIPMENT_OPTIONS,
  DIFFICULTIES,
  CATEGORIES,
} from '../lib/exerciseOptions';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

const emptyFilters: Filters = {
  search: '',
  difficulty: '',
  equipment: '',
  trainingGoal: '',
  bodyArea: '',
  movementType: '',
  sideType: '',
  chainType: '',
  category: '',
};

export default function ExerciseFilters({ filters, onChange, totalCount, filteredCount }: Props) {
  return (
    <div className="card p-4 mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="جست‌وجو بر اساس نام فارسی، انگلیسی یا کد..."
            className="input pr-10"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500">
            نمایش <span className="font-medium text-slate-800">{filteredCount}</span> از {totalCount} حرکت
          </div>
          <button onClick={() => onChange(emptyFilters)} className="btn-secondary text-xs !py-1.5">
            پاک کردن فیلترها
          </button>
        </div>
      </div>

      {/* الف) هدف تمرینی + ب) ناحیه بدن */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="label">هدف تمرینی</label>
          <select
            className="input"
            value={filters.trainingGoal}
            onChange={(e) => onChange({ ...filters, trainingGoal: e.target.value })}
          >
            <option value="">همه اهداف</option>
            {TRAINING_GOALS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">ناحیه بدن</label>
          <select
            className="input"
            value={filters.bodyArea}
            onChange={(e) => onChange({ ...filters, bodyArea: e.target.value })}
          >
            <option value="">همه نواحی</option>
            {BODY_AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">تجهیزات</label>
          <select
            className="input"
            value={filters.equipment}
            onChange={(e) => onChange({ ...filters, equipment: e.target.value })}
          >
            <option value="">همه تجهیزات</option>
            {EQUIPMENT_OPTIONS.map((eq) => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>
      </div>

      {/* د) سطح و نوع حرکت */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div>
          <label className="label">سطح دشواری</label>
          <select
            className="input"
            value={filters.difficulty}
            onChange={(e) => onChange({ ...filters, difficulty: e.target.value as Difficulty | '' })}
          >
            <option value="">همه سطوح</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">تک / چندمفصلی</label>
          <select
            className="input"
            value={filters.movementType}
            onChange={(e) => onChange({ ...filters, movementType: e.target.value })}
          >
            <option value="">همه</option>
            <option value="تک‌مفصلی">تک‌مفصلی</option>
            <option value="چندمفصلی">چندمفصلی</option>
          </select>
        </div>
        <div>
          <label className="label">یک‌طرفه / دوطرفه</label>
          <select
            className="input"
            value={filters.sideType}
            onChange={(e) => onChange({ ...filters, sideType: e.target.value })}
          >
            <option value="">همه</option>
            <option value="یک‌طرفه">یک‌طرفه</option>
            <option value="دوطرفه">دوطرفه</option>
          </select>
        </div>
        <div>
          <label className="label">زنجیره حرکتی</label>
          <select
            className="input"
            value={filters.chainType}
            onChange={(e) => onChange({ ...filters, chainType: e.target.value })}
          >
            <option value="">همه</option>
            <option value="زنجیره باز">زنجیره باز</option>
            <option value="زنجیره بسته">زنجیره بسته</option>
          </select>
        </div>
        <div>
          <label className="label">دسته‌بندی</label>
          <select
            className="input"
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
          >
            <option value="">همه</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
