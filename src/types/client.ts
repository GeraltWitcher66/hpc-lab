export interface Client {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  sport: string;
  trainingGoal: string;
  trainingHistory: string;
  availableEquipment: string;
  limitations: string;
  notes: string;
  // later: assessments, progress
  createdAt: string;
  updatedAt: string;
}

export interface ClientFilters {
  search: string;
  goal: string;
}
