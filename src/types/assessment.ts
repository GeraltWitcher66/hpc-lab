export interface AssessmentItem {
  id: string;
  name: string;
  category: string; // دامنه حرکتی، قدرت، تعادل، عملکردی، اختصاصی
  value: string;
  unit: string;
  notes: string;
}

export interface Assessment {
  id: string;
  clientId: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  title: string;
  notes: string;
  items: AssessmentItem[];
  createdAt: string;
  updatedAt: string;
}
