export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  category: 'interest' | 'skill' | 'learning';
  weight: number;
}

export interface QuizAnswer {
  questionId: number;
  selectedOption: number;
}

export interface QuizResult {
  stream: 'Science' | 'Commerce' | 'Arts';
  score: number;
  recommendations: CourseRecommendation[];
  colleges: College[];
}

export interface CourseRecommendation {
  id: number;
  name: string;
  description: string;
  rationale: string;
  duration: string;
  scope: string;
}

export interface College {
  id: number;
  name: string;
  location: string;
  district: string;
  state: string;
  type: 'Government' | 'Private';
  courses: string[];
  website?: string;
  contact: string;
}

export interface StudentData {
  id: number;
  name: string;
  stream: string;
  district: string;
  score: number;
  completedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  streamDistribution: { stream: string; count: number; percentage: number }[];
  districtData: { district: string; count: number }[];
}