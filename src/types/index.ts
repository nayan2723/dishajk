export interface QuizQuestion {
  id: number;
  question: string;
  options?: string[];
  category: 'interest' | 'skill' | 'learning' | 'profile';
  weight: number;
  type: 'multiple_choice' | 'dropdown' | 'input';
  inputType?: 'text' | 'select';
}

export interface QuizAnswer {
  questionId: number;
  selectedOption: number;
  value?: string; // For text inputs like location
}

export interface UserProfile {
  stream: 'Science' | 'Commerce' | 'Arts' | 'Vocational';
  location: string;
  district: string;
  futureGoals: 'higher_studies' | 'government_jobs' | 'private_sector' | 'skill_based';
}

export interface QuizResult {
  stream: 'Science' | 'Commerce' | 'Arts' | 'Vocational';
  score: number;
  recommendations: CourseRecommendation[];
  colleges: College[];
  userProfile: UserProfile;
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