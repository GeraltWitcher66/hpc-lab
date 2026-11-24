import type { Exercise } from '../types/exercise';
import { Edit2, Trash2, Play, Image as ImageIcon } from 'lucide-react';

interface Props {
  exercise: Exercise;
  onEdit: (ex: Exercise) => void;
  onDelete: (id: string) => void;
}

export default function ExerciseCard({ exercise, onEdit, onDelete }: Props) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-3">
        {exercise.imageUrl ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.nameFa}
            className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : null}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {exercise.code}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              exercise.difficulty === 'مبتدی' ? 'bg-green-100 text-green-700' :
              exercise.difficulty === 'متوسط' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {exercise.difficulty}
            </span>
          </div>
          
          <h3 className="font-semibold text-slate-900 text-base truncate">
            {exercise.nameFa}
          </h3>
          <p className="text-sm text-slate-500 truncate">{exercise.nameEn}</p>
        </div>

        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(exercise)}
            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="ویرایش"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(exercise.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {exercise.equipment.slice(0, 3).map((eq) => (
          <span key={eq} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {eq}
          </span>
        ))}
        {exercise.primaryMuscles.slice(0, 2).map((m) => (
          <span key={m} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
            {m}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        {exercise.videoUrl ? (
          <span className="flex items-center gap-1 text-primary-600">
            <Play size={12} /> ویدیو
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Play size={12} /> بدون ویدیو
          </span>
        )}
        {exercise.imageUrl ? (
          <span className="flex items-center gap-1 text-primary-600">
            <ImageIcon size={12} /> تصویر
          </span>
        ) : null}
        <span>{exercise.isCompound ? 'چندمفصلی' : 'تک‌مفصلی'}</span>
      </div>
    </div>
  );
}
