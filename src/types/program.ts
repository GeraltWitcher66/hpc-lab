export interface ProgramExercise {
  id: string;
  exerciseId: string;
  order: number;
  // snapshot from bank — تغییر بانک، برنامه‌های قبلی را خراب نمی‌کند
  nameFa: string;
  nameEn: string;
  code: string;
  videoUrl?: string;
  imageUrl?: string;
  // متغیرهای جلسه
  sets: number;
  reps: string;
  intensity: string; // وزن یا درصد رکورد
  rpe: string;
  rir: string;
  restSeconds: number;
  tempo: string;
  duration: string; // مدت یا مسافت
  romLimitation: string; // دامنه حرکتی یا محدودیت اختصاصی
  notes: string; // توضیحات مربی
}

export interface ProgramDay {
  id: string;
  weekNumber: number;
  dayNumber: number;
  name: string;
  exercises: ProgramExercise[];
}

export interface Program {
  id: string;
  name: string;
  goal: string;
  notes: string;
  weeksCount: number;
  days: ProgramDay[];
  createdAt: string;
  updatedAt: string;
  clientId?: string;
  clientName?: string;
  clientCode?: string;
}
