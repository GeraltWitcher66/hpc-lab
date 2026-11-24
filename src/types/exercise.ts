export type Difficulty = 'مبتدی' | 'متوسط' | 'پیشرفته';
export type ChainType = 'زنجیره باز' | 'زنجیره بسته';

export interface Exercise {
  id: string;
  nameFa: string;
  nameEn: string;
  code: string;
  movementGroup: string;
  movementPattern: string;
  bodyArea: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  joints: string[];
  exerciseType: string;
  trainingGoal: string[];
  category: string;
  difficulty: Difficulty;
  equipment: string[];
  bodyPosition: string;
  executionNotes: string;
  commonMistakes: string;
  precautions: string;
  imageUrl?: string;
  videoUrl?: string;
  coachNotes?: string;
  isUnilateral: boolean;
  isCompound: boolean;
  chainType: ChainType;
  /** کد یا نام حرکات جایگزین / رگرسیون / پروگرسیون */
  alternatives: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseFilters {
  search: string;
  difficulty: Difficulty | '';
  equipment: string;
  trainingGoal: string;
  bodyArea: string;
  movementType: string; // تک‌مفصلی | چندمفصلی
  sideType: string; // یک‌طرفه | دوطرفه
  chainType: string;
  category: string;
}
