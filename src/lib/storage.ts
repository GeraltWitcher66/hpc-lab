import type { Exercise } from '../types/exercise';
import { sampleExercises } from '../data/sampleExercises';

const STORAGE_KEY = 'hpc-lab-exercises';

function normalizeExercise(ex: Exercise): Exercise {
  return {
    ...ex,
    bodyArea: ex.bodyArea || '',
    alternatives: ex.alternatives || '',
    primaryMuscles: ex.primaryMuscles || [],
    secondaryMuscles: ex.secondaryMuscles || [],
    joints: ex.joints || [],
    trainingGoal: ex.trainingGoal || [],
    equipment: ex.equipment || [],
  };
}

export function getExercises(): Exercise[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return (JSON.parse(data) as Exercise[]).map(normalizeExercise);
    }
    // First time: seed with sample data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleExercises));
    return sampleExercises;
  } catch {
    return sampleExercises;
  }
}

export function saveExercises(exercises: Exercise[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
}

export function addExercise(exercise: Exercise): void {
  const exercises = getExercises();
  exercises.push(exercise);
  saveExercises(exercises);
}

export function updateExercise(updated: Exercise): void {
  const exercises = getExercises();
  const index = exercises.findIndex((e) => e.id === updated.id);
  if (index !== -1) {
    exercises[index] = { ...updated, updatedAt: new Date().toISOString() };
    saveExercises(exercises);
  }
}

export function deleteExercise(id: string): void {
  const exercises = getExercises().filter((e) => e.id !== id);
  saveExercises(exercises);
}

export function generateId(): string {
  return `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateCode(prefix: string = 'EX'): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `${prefix}-${num}`;
}
