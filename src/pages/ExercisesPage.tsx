import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { Exercise, ExerciseFilters } from '../types/exercise';
import { getExercises, deleteExercise, addExercise, updateExercise, generateId, generateCode } from '../lib/storage';
import ExerciseCard from '../components/ExerciseCard';
import ExerciseFilters from '../components/ExerciseFilters';
import ExerciseForm from '../components/ExerciseForm';

const emptyFilters: ExerciseFilters = {
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

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filters, setFilters] = useState<ExerciseFilters>(emptyFilters);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);

  useEffect(() => {
    setExercises(getExercises());
  }, []);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const q = filters.search.trim().toLowerCase();
      if (q) {
        const match =
          ex.nameFa.toLowerCase().includes(q) ||
          ex.nameEn.toLowerCase().includes(q) ||
          ex.code.toLowerCase().includes(q) ||
          (ex.alternatives || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filters.difficulty && ex.difficulty !== filters.difficulty) return false;
      if (filters.equipment && !(ex.equipment || []).includes(filters.equipment)) return false;
      if (filters.trainingGoal && !(ex.trainingGoal || []).includes(filters.trainingGoal)) return false;
      if (filters.bodyArea && (ex.bodyArea || '') !== filters.bodyArea) return false;
      if (filters.movementType === 'تک‌مفصلی' && ex.isCompound) return false;
      if (filters.movementType === 'چندمفصلی' && !ex.isCompound) return false;
      if (filters.sideType === 'یک‌طرفه' && !ex.isUnilateral) return false;
      if (filters.sideType === 'دوطرفه' && ex.isUnilateral) return false;
      if (filters.chainType && ex.chainType !== filters.chainType) return false;
      if (filters.category && (ex.category || '') !== filters.category) return false;
      return true;
    });
  }, [exercises, filters]);

  const handleSave = (data: Partial<Exercise>) => {
    if (editing) {
      const updated = { ...editing, ...data } as Exercise;
      updateExercise(updated);
      setExercises(getExercises());
    } else {
      const newEx: Exercise = {
        id: generateId(),
        code: data.code || generateCode(),
        nameFa: data.nameFa || '',
        nameEn: data.nameEn || '',
        movementGroup: data.movementGroup || '',
        movementPattern: data.movementPattern || '',
        bodyArea: data.bodyArea || '',
        primaryMuscles: data.primaryMuscles || [],
        secondaryMuscles: data.secondaryMuscles || [],
        joints: data.joints || [],
        exerciseType: data.exerciseType || '',
        trainingGoal: data.trainingGoal || [],
        category: data.category || '',
        difficulty: data.difficulty || 'مبتدی',
        equipment: data.equipment || [],
        bodyPosition: data.bodyPosition || '',
        executionNotes: data.executionNotes || '',
        commonMistakes: data.commonMistakes || '',
        precautions: data.precautions || '',
        imageUrl: data.imageUrl || '',
        videoUrl: data.videoUrl || '',
        coachNotes: data.coachNotes || '',
        isUnilateral: data.isUnilateral || false,
        isCompound: data.isCompound ?? true,
        chainType: data.chainType || 'زنجیره بسته',
        alternatives: data.alternatives || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addExercise(newEx);
      setExercises(getExercises());
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این حرکت مطمئن هستید؟')) {
      deleteExercise(id);
      setExercises(getExercises());
    }
  };

  const handleEdit = (ex: Exercise) => {
    setEditing(ex);
    setShowForm(true);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">بانک حرکات</h1>
          <p className="text-slate-500 mt-1">مدیریت و دسته‌بندی حرکات تمرینی</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          <Plus size={18} />
          افزودن حرکت جدید
        </button>
      </div>

      {/* Filters */}
      <ExerciseFilters
        filters={filters}
        onChange={setFilters}
        totalCount={exercises.length}
        filteredCount={filtered.length}
      />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500">حرکتی یافت نشد.</p>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="btn-primary mt-4"
          >
            <Plus size={18} />
            افزودن اولین حرکت
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ExerciseForm
          exercise={editing}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
