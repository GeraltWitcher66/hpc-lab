import type { Assessment, AssessmentItem } from '../types/assessment';

const STORAGE_KEY = 'hpc-lab-assessments';

export function getAssessments(): Assessment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAssessments(list: Assessment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getAssessment(id: string): Assessment | undefined {
  return getAssessments().find((a) => a.id === id);
}

export function getClientAssessments(clientId: string): Assessment[] {
  return getAssessments()
    .filter((a) => a.clientId === clientId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function addAssessment(a: Assessment): void {
  const list = getAssessments();
  list.unshift(a);
  saveAssessments(list);
}

export function updateAssessment(updated: Assessment): void {
  const list = getAssessments();
  const i = list.findIndex((a) => a.id === updated.id);
  if (i !== -1) {
    list[i] = { ...updated, updatedAt: new Date().toISOString() };
    saveAssessments(list);
  }
}

export function deleteAssessment(id: string): void {
  saveAssessments(getAssessments().filter((a) => a.id !== id));
}

export function generateAssessmentId(): string {
  return `asm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateItemId(): string {
  return `ait-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createEmptyItem(): AssessmentItem {
  return {
    id: generateItemId(),
    name: '',
    category: 'عملکردی',
    value: '',
    unit: '',
    notes: '',
  };
}
