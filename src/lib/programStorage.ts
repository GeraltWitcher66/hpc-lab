import type { Program, ProgramDay, ProgramExercise } from '../types/program';

const STORAGE_KEY = 'hpc-lab-programs';

export function getPrograms(): Program[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePrograms(programs: Program[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
}

export function getProgram(id: string): Program | undefined {
  return getPrograms().find((p) => p.id === id);
}

export function addProgram(program: Program): void {
  const programs = getPrograms();
  programs.unshift(program);
  savePrograms(programs);
}

export function updateProgram(updated: Program): void {
  const programs = getPrograms();
  const index = programs.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    programs[index] = { ...updated, updatedAt: new Date().toISOString() };
    savePrograms(programs);
  }
}

export function deleteProgram(id: string): void {
  savePrograms(getPrograms().filter((p) => p.id !== id));
}

export function generateProgramId(): string {
  return `prg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateDayId(): string {
  return `day-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function generateProgExId(): string {
  return `pex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createEmptyDay(weekNumber: number, dayNumber: number, name?: string): ProgramDay {
  return {
    id: generateDayId(),
    weekNumber,
    dayNumber,
    name: name || `هفته ${weekNumber} — روز ${dayNumber}`,
    exercises: [],
  };
}

export function createEmptyProgramExercise(
  exerciseId: string,
  nameFa: string,
  nameEn: string,
  code: string,
  videoUrl?: string,
  imageUrl?: string,
  order = 1
): ProgramExercise {
  return {
    id: generateProgExId(),
    exerciseId,
    order,
    nameFa,
    nameEn,
    code,
    videoUrl,
    imageUrl,
    sets: 3,
    reps: '10',
    intensity: '',
    rpe: '',
    rir: '',
    restSeconds: 90,
    tempo: '',
    duration: '',
    romLimitation: '',
    notes: '',
  };
}
